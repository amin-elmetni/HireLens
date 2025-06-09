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

logger = logging.getLogger(__name__)

# Configuration des chemins
PROJECT_ROOT = Path(__file__).resolve().parent.parent
env_path = PROJECT_ROOT / '.env'
load_dotenv(dotenv_path=env_path)

app = FastAPI(
    title="Text Processing API",
    version="1.0"
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
                if 'skills' in resume:
                    skills.update(skill['name'].lower() for skill in resume['skills'])
                if 'categories' in resume:
                    categories.update(cat.lower() for cat in resume['categories'])

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
    if return_skills:
        result['skills'] = find_matches(text_input.text, ALL_SKILLS)
    if return_categories:
        result['categories'] = find_matches(text_input.text, ALL_CATEGORIES)
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