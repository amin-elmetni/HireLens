import uvicorn
from fastapi import FastAPI
from api.cv_processing import app as cv_app
from api.text_analysis import app as text_app
from contextlib import asynccontextmanager
from database_listener.postgres_listener import PostgresCVListener
import logging
from dotenv import load_dotenv
import os
from pathlib import Path

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Chargement des variables d'environnement
PROJECT_ROOT = Path(__file__).resolve().parent.parent
env_path = PROJECT_ROOT / '.env'
load_dotenv(dotenv_path=env_path)

# Configuration PostgreSQL
db_config = {
    'POSTGRES_HOST': os.getenv('POSTGRES_HOST', 'localhost'),
    'POSTGRES_PORT': os.getenv('POSTGRES_PORT', '5432'),
    'POSTGRES_DB': os.getenv('POSTGRES_DB', 'postgres'),
    'POSTGRES_USER': os.getenv('POSTGRES_USER', 'postgres'),
    'POSTGRES_PASSWORD': os.getenv('POSTGRES_PASSWORD', 'nttdata1234')
}

# Variable globale pour le listener
listener = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestion du cycle de vie de l'application"""
    global listener

    try:
        # Démarrage du listener
        listener = PostgresCVListener(db_config)
        listener.start_listener()
        logger.info("PostgreSQL listener started")
        yield
    finally:
        # Nettoyage à l'arrêt de l'application
        if listener:
            logger.info("Arrêt du listener PostgreSQL")
            listener.stop_listener()


# Création de l'application principale
app = FastAPI(
    title="CV Processing & Text Analysis API",
    version="1.0",
    lifespan=lifespan
)

# Montage des sous-applications
app.mount("/cv-processing", cv_app)
app.mount("/text-analysis", text_app)


@app.get("/")
async def root():
    """Endpoint racine avec message de bienvenue"""
    return {
        "message": "Bienvenue sur l'API de traitement de CV et analyse textuelle",
        "sub_apps": {
            "cv_processing": "/cv-processing",
            "text_analysis": "/text-analysis"
        }
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )