from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import papermill as pm
from pathlib import Path
import logging
import os
import shutil
import tempfile
from typing import List
from dotenv import load_dotenv

# Configuration du logging
logger = logging.getLogger(__name__)

# Configuration des chemins
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
NOTEBOOKS_DIR = PROJECT_ROOT / "notebooks"
NOTEBOOKS = {
    "saving": "00-saving-resumes.ipynb",
    "extraction": "01-data-extraction.ipynb",
    "add_links": "02-adding-personal-links.ipynb",
    "scoring": "05-scoring_system.ipynb",
    "category_scoring": "06-category_scoring.ipynb",
    "postprocessing": "07-postprocessing.ipynb",
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

app = FastAPI(title="CV Processing API", version="1.0")

# Configuration CORS pour la sous-application
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def run_notebook(notebook_key: str, output_suffix: str = "-out") -> dict:
    """Exécute un notebook Jupyter et retourne les résultats"""
    if notebook_key not in NOTEBOOKS:
        logger.error(f"Clé de notebook inconnue: {notebook_key}")
        return {
            "status": "error",
            "error": f"Notebook key {notebook_key} not found",
            "available_notebooks": list(NOTEBOOKS.keys()),
        }

    input_name = NOTEBOOKS[notebook_key]
    input_path = NOTEBOOKS_DIR / input_name
    output_path = NOTEBOOKS_DIR / input_name.replace(".ipynb", f"{output_suffix}.ipynb")

    try:
        logger.info(f"Exécution du notebook: {input_path}")
        pm.execute_notebook(
            input_path=str(input_path),
            output_path=str(output_path),
            kernel_name="python",
        )
        logger.info(f"Notebook exécuté avec succès: {input_name}")
        return {"status": "success", "notebook": input_name}
    except Exception as e:
        logger.error(
            f"Erreur lors de l'exécution de {input_name}: {str(e)}", exc_info=True
        )
        return {"status": "error", "notebook": input_name, "error": str(e)}


@app.get("/")
async def cv_root():
    return {"message": "Bienvenue sur l'API de traitement de CV"}


@app.post("/run/saving")
async def run_saving():
    return run_notebook("saving")


@app.post("/run/extraction")
async def run_extraction():
    return run_notebook("extraction")


@app.post("/run/add-links")
async def run_add_links():
    return run_notebook("add_links")


@app.post("/run/scoring")
async def run_scoring():
    return run_notebook("scoring")


@app.post("/run/category-scoring")
async def run_category_scoring():
    return run_notebook("category_scoring")


@app.post("/run/postprocessing")
async def run_postprocessing():
    return run_notebook("postprocessing")


@app.post("/run/full")
async def run_full_pipeline():
    results = []
    pipeline_steps = [
        "saving",
        "extraction",
        "add_links",
        "scoring",
        "category_scoring",
        "postprocessing",
    ]  # Ajout du nouveau notebook

    for step in pipeline_steps:
        logger.info(f"Début de l'étape: {step}")
        result = run_notebook(step)
        results.append({"step": step, "notebook": NOTEBOOKS[step], **result})
        if result.get("status") == "error":
            logger.error(f"Échec du pipeline à l'étape: {step}")
            return JSONResponse(
                status_code=500,
                content={"pipeline": "failed", "failed_at": step, "results": results},
            )

    logger.info("Pipeline exécuté avec succès")
    return {"pipeline": "completed", "steps": results}


@app.post("/upload-and-analyze")
async def upload_and_analyze(files: List[UploadFile] = File(...)):
    """Upload files and run the full analysis pipeline"""
    if not files:
        return JSONResponse(status_code=400, content={"error": "No files provided"})

    # Validate file types
    allowed_types = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    invalid_files = []

    for file in files:
        # Check content type and file extension
        is_valid_type = (
            file.content_type in allowed_types
            or file.filename.lower().endswith((".pdf", ".docx"))
        )

        if not is_valid_type:
            invalid_files.append(
                f"{file.filename}: Invalid file type. Only PDF and DOCX files are allowed."
            )

    if invalid_files:
        return JSONResponse(
            status_code=400,
            content={"error": "Invalid file types detected", "details": invalid_files},
        )

    # Create temporary directory for uploaded files
    temp_dir = None
    try:
        temp_dir = tempfile.mkdtemp(prefix="resume_upload_")
        logger.info(f"Created temporary directory: {temp_dir}")

        # Save uploaded files
        saved_files = []
        for file in files:
            file_path = Path(temp_dir) / file.filename

            # Read and save file content
            content = await file.read()
            with open(file_path, "wb") as buffer:
                buffer.write(content)

            saved_files.append(str(file_path))
            logger.info(f"Saved file: {file_path} ({len(content)} bytes)")

        # Set environment variable for the notebook to use this directory
        os.environ["RESUME_SOURCE_FOLDER"] = temp_dir
        logger.info(f"Set RESUME_SOURCE_FOLDER to: {temp_dir}")

        # Run the full pipeline
        results = []
        pipeline_steps = [
            "saving",
            "extraction",
            "add_links",
            "scoring",
            "category_scoring",
            "postprocessing",
        ]

        for step in pipeline_steps:
            logger.info(f"Starting pipeline step: {step}")
            result = run_notebook(step)
            results.append({"step": step, "notebook": NOTEBOOKS[step], **result})
            if result.get("status") == "error":
                logger.error(f"Pipeline failed at step: {step}")
                return JSONResponse(
                    status_code=500,
                    content={
                        "pipeline": "failed",
                        "failed_at": step,
                        "results": results,
                        "uploaded_files": [f.filename for f in files],
                        "temp_directory": temp_dir,
                    },
                )
            logger.info(f"Completed pipeline step: {step}")

        logger.info("Full pipeline executed successfully")
        return {
            "pipeline": "completed",
            "steps": results,
            "uploaded_files": [f.filename for f in files],
            "files_processed": len(files),
            "temp_directory": temp_dir,
            "message": f"Successfully processed {len(files)} files",
        }

    except Exception as e:
        logger.error(f"Error processing files: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "error": "File processing failed",
                "details": str(e),
                "uploaded_files": [f.filename for f in files] if files else [],
                "temp_directory": temp_dir,
            },
        )
    finally:
        # Clean up environment variable
        if "RESUME_SOURCE_FOLDER" in os.environ:
            del os.environ["RESUME_SOURCE_FOLDER"]

        # Clean up temporary directory (optional - keep for debugging if needed)
        if temp_dir and os.path.exists(temp_dir):
            try:
                # For production, uncomment the next two lines to clean up
                # shutil.rmtree(temp_dir)
                # logger.info(f"Cleaned up temporary directory: {temp_dir}")

                # For development, keep the directory for debugging
                logger.info(f"Keeping temporary directory for debugging: {temp_dir}")
            except Exception as e:
                logger.warning(f"Failed to clean up temporary directory: {e}")


@app.get("/analysis-status")
async def get_analysis_status():
    """Get the current status of the analysis system"""
    return {
        "status": "ready",
        "available_notebooks": list(NOTEBOOKS.keys()),
        "notebooks_dir": str(NOTEBOOKS_DIR),
        "system_info": {
            "notebooks_found": len(
                [nb for nb in NOTEBOOKS.values() if (NOTEBOOKS_DIR / nb).exists()]
            ),
            "total_notebooks": len(NOTEBOOKS),
        },
    }
