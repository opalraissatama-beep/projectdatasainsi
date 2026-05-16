from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pathlib import Path

from app.database.database import init_db
from app.routes.detect import router as detect_router
from app.routes.logs import router as logs_router
from app.routes.stats import router as stats_router


app = FastAPI(title="AI WAF API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event() -> None:
    init_db()


@app.get("/")
def root() -> dict:
    return {"service": "ai-waf-api", "status": "ok"}


@app.get("/artifacts/confusion-matrix")
def confusion_matrix() -> FileResponse:
    return FileResponse(Path(__file__).resolve().parents[2] / "confusion_matrix.png", media_type="image/png")


@app.get("/artifacts/shap-sqli")
def shap_sqli() -> FileResponse:
    return FileResponse(Path(__file__).resolve().parents[2] / "shap_sqli.png", media_type="image/png")


app.include_router(detect_router)
app.include_router(logs_router)
app.include_router(stats_router)
