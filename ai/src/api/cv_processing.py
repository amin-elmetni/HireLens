from fastapi import FastAPI
from fastapi.responses import JSONResponse
import papermill as pm
from pathlib import Path
import logging
import os
from dotenv import load_dotenv

# Configuration du logging
logger = logging.getLogger(__name__)

# Configuration des chemins
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
NOTEBOOKS_DIR = PROJECT_ROOT / "notebooks"
NOTEBOOKS = {
    "extraction": "01-data-extraction.ipynb",
    "add_links": "02-adding-personal-links.ipynb",
    "scoring": "05-scoring_system.ipynb",
    "category_scoring": "06-category_scoring.ipynb"
}

# Vérification des chemins avec messages plus clairs
if not NOTEBOOKS_DIR.exists():
    logger.error(f"Dossier notebooks introuvable. Recherché à: {NOTEBOOKS_DIR}")
    logger.info(f"Contenu du répertoire {PROJECT_ROOT}: {list(PROJECT_ROOT.iterdir())}")
    raise FileNotFoundError(f"Dossier notebooks introuvable à {NOTEBOOKS_DIR}")

for notebook in NOTEBOOKS.values():
    notebook_path = NOTEBOOKS_DIR / notebook
    if not notebook_path.exists():
        logger.warning(f"Notebook {notebook} introuvable dans {NOTEBOOKS_DIR}")

app = FastAPI(
    title="CV Processing API",
    version="1.0"
)

def run_notebook(notebook_key: str, output_suffix: str = "-out") -> dict:
    """Exécute un notebook Jupyter et retourne les résultats"""
    if notebook_key not in NOTEBOOKS:
        logger.error(f"Clé de notebook inconnue: {notebook_key}")
        return JSONResponse(
            status_code=404,
            content={
                "status": "error",
                "error": f"Notebook key {notebook_key} not found",
                "available_notebooks": list(NOTEBOOKS.keys())
            }
        )

    input_name = NOTEBOOKS[notebook_key]
    input_path = NOTEBOOKS_DIR / input_name
    output_path = NOTEBOOKS_DIR / input_name.replace(".ipynb", f"{output_suffix}.ipynb")

    try:
        logger.info(f"Exécution du notebook: {input_path}")
        pm.execute_notebook(
            input_path=str(input_path),
            output_path=str(output_path),
            kernel_name="python3"
        )
        logger.info(f"Notebook exécuté avec succès: {input_name}")
        return {"status": "success", "notebook": input_name}
    except Exception as e:
        logger.error(f"Erreur lors de l'exécution de {input_name}: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "notebook": input_name,
                "error": str(e)
            }
        )

@app.get("/")
async def cv_root():
    return {"message": "Bienvenue sur l'API de traitement de CV"}

@app.post("/run/extraction")
async def run_extraction():
    return run_notebook("extraction")

@app.post("/run/add-links")
async def run_add_links():
    return run_notebook("add_links")

@app.post("/run/scoring")
async def run_scoring():
    return run_notebook("scoring")

@app.post("/run/category-scoring")  # Nouvel endpoint pour le notebook 07
async def run_category_scoring():
    return run_notebook("category_scoring")

@app.post("/run/full")
async def run_full_pipeline():
    results = []
    pipeline_steps = ["extraction", "add_links", "scoring", "category_scoring"]  # Ajout du nouveau notebook

    for step in pipeline_steps:
        logger.info(f"Début de l'étape: {step}")
        result = run_notebook(step)
        results.append({
            "step": step,
            "notebook": NOTEBOOKS[step],
            **result
        })
        if result.get("status") == "error":
            logger.error(f"Échec du pipeline à l'étape: {step}")
            return JSONResponse(
                status_code=500,
                content={
                    "pipeline": "failed",
                    "failed_at": step,
                    "results": results
                }
            )

    logger.info("Pipeline exécuté avec succès")
    return {
        "pipeline": "completed",
        "steps": results
    }