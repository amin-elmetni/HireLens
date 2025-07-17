from fastapi import FastAPI, HTTPException, Query
from pymongo import MongoClient
from typing import List, Optional, Dict
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import re
import json
from pathlib import Path
import logging
from sentence_transformers import SentenceTransformer, util
import torch
from fastapi.middleware.cors import CORSMiddleware


logger = logging.getLogger(__name__)

# Configuration des chemins
PROJECT_ROOT = Path(__file__).resolve().parent.parent
env_path = PROJECT_ROOT / '.env'
load_dotenv(dotenv_path=env_path)

app = FastAPI(
    title="Text Processing API",
    version="1.0"
)

# ADD THIS BLOCK
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],  # your frontend dev origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextInput(BaseModel):
    text: str
    return_skills: bool = True
    return_categories: bool = True

class ExtractionResult(BaseModel):
    skills: Optional[List[str]] = None
    categories: Optional[List[str]] = None

FALLBACK_DATA_FILE = PROJECT_ROOT / "fallback_data.json"

def initialize_mongo_connection():
    """Initialise la connexion MongoDB avec gestion d'erreur"""
    try:
        client = MongoClient(
            host=os.getenv('MONGO_HOST', 'localhost'),
            port=int(os.getenv('MONGO_PORT', 27017)),
            username=os.getenv('MONGO_USER'),
            password=os.getenv('MONGO_PASSWORD'),
            serverSelectionTimeoutMS=5000
        )
        client.server_info()  # Test connection immediately
        return client
    except Exception as e:
        logger.error(f"Échec de connexion à MongoDB: {e}")
        return None

def save_fallback_data(data: dict):
    """Sauvegarde les données dans un fichier JSON"""
    try:
        with open(FALLBACK_DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        logger.error(f"Échec de sauvegarde des données de fallback: {e}")

def load_fallback_data() -> dict:
    """Charge les données depuis le fichier JSON de fallback"""
    try:
        if FALLBACK_DATA_FILE.exists():
            with open(FALLBACK_DATA_FILE, 'r') as f:
                return json.load(f)
    except Exception as e:
        logger.error(f"Échec de chargement des données de fallback: {e}")
    return {'skills': [], 'categories': []}


def extract_skills_and_categories() -> Dict[str, List[str]]:
    """Extrait les données depuis MongoDB ou le fallback"""
    mongo_client = initialize_mongo_connection()

    if mongo_client:
        try:
            db = mongo_client[os.getenv('MONGO_DB', 'PFE')]
            collection = db[os.getenv('MONGO_COLLECTION', 'resumes')]

            skills = set()
            categories = set()

            for resume in collection.find({}):
                # Handle skills - check different possible formats
                if 'skills' in resume:
                    if isinstance(resume['skills'], list):
                        for item in resume['skills']:
                            if isinstance(item, dict) and 'name' in item:
                                skills.add(item['name'].lower())
                            elif isinstance(item, str):
                                skills.add(item.lower())

                # Handle categories - check different possible formats
                if 'categories' in resume:
                    if isinstance(resume['categories'], list):
                        for item in resume['categories']:
                            if isinstance(item, str):
                                categories.add(item.lower())
                            elif isinstance(item, dict):
                                # Handle case where categories might be objects
                                if 'name' in item:
                                    categories.add(item['name'].lower())

            result = {
                'skills': sorted(skills),
                'categories': sorted(categories)
            }

            save_fallback_data(result)
            return result

        except Exception as e:
            logger.error(f"Erreur lors de l'extraction depuis MongoDB: {e}")
            if mongo_client:
                mongo_client.close()

    return load_fallback_data()

# Initialisation des données
mongo_data = extract_skills_and_categories()
ALL_SKILLS = mongo_data.get('skills', [])
ALL_CATEGORIES = mongo_data.get('categories', [])

EMBEDDING_MODEL = SentenceTransformer('all-MiniLM-L6-v2')

SKILL_EMBEDDINGS = EMBEDDING_MODEL.encode(ALL_SKILLS, convert_to_tensor=True)
CATEGORY_EMBEDDINGS = EMBEDDING_MODEL.encode(ALL_CATEGORIES, convert_to_tensor=True)

def semantic_match(text: str, patterns: List[str], pattern_embeddings: torch.Tensor, threshold: float = 0.8) -> List[str]:
    """Matches by checking semantic similarity between chunks of input and known patterns."""
    matched = set()
    # Break text into candidate phrases (tokens or 2-3 word chunks)
    words = re.findall(r'\w+', text.lower())
    ngrams = [' '.join(words[i:i+n]) for n in (1, 2, 3) for i in range(len(words)-n+1)]

    for phrase in ngrams:
        phrase_embedding = EMBEDDING_MODEL.encode(phrase, convert_to_tensor=True)
        similarities = util.cos_sim(phrase_embedding, pattern_embeddings)[0]
        for i, score in enumerate(similarities):
            if score >= threshold:
                matched.add(patterns[i])
    return sorted(matched)

def find_matches(text: str, patterns: List[str]) -> List[str]:
    """Trouve les correspondances dans le texte"""
    text_lower = text.lower()
    return [
        pattern for pattern in patterns
        if re.search(r'\b' + re.escape(pattern) + r's?\b', text_lower, re.IGNORECASE)
    ]

@app.get("/")
async def text_root():
    return {"message": "Bienvenue sur l'API d'analyse textuelle"}

@app.post("/extract", response_model=ExtractionResult)
async def extract_from_text(
        text_input: TextInput,
        return_skills: bool = Query(True),
        return_categories: bool = Query(True)
):
    result = {}
    text = text_input.text

    if return_skills:
        result['skills'] = semantic_match(text, ALL_SKILLS, SKILL_EMBEDDINGS)

    if return_categories:
        result['categories'] = semantic_match(text, ALL_CATEGORIES, CATEGORY_EMBEDDINGS)

    return result


@app.get("/all-skills", response_model=List[str])
async def get_all_skills():
    return ALL_SKILLS

@app.get("/all-categories", response_model=List[str])
async def get_all_categories():
    return ALL_CATEGORIES

@app.get("/health")
async def health_check():
    mongo_status = "up" if initialize_mongo_connection() else "down"
    return {
        "status": "up",
        "mongo": mongo_status,
        "skills_count": len(ALL_SKILLS),
        "categories_count": len(ALL_CATEGORIES)
    }