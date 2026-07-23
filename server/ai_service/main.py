"""
Image Forensic Analysis API — FastAPI Service
=============================================
Runs on port 5001. Accepts POST /analyze with:
  - image_b64: base64-encoded image (with or without data: prefix)
  - file_name: original filename
  - metadata:  optional client metadata dict

Returns full forensic analysis result.
NO FALLBACKS — any failure raises HTTP 500 with full error details.
"""

import sys
import base64
import logging
import traceback

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

from fastapi import FastAPI, HTTPException

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

# Configure root logger so all module loggers output to console
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("main")

# ── Startup: load AI model eagerly so failures are visible immediately ──────
logger.info("=" * 60)
logger.info("  Image Forensic Analysis Service — startup")
logger.info("  Loading AI model eagerly...")
logger.info("=" * 60)

try:
    from analyzer import analyze_image
    from forensics.ai_model import get_ai_model

    # Force-initialize the model singleton now (not lazily on first request)
    _model = get_ai_model()
    if _model.model_loaded:
        logger.info("[OK] EfficientNet-B3 loaded - REAL 3-class dynamic scores ACTIVE")
    else:
        logger.error("[FAIL] EfficientNet-B3 FAILED to load")
except Exception as startup_err:
    logger.critical(f"STARTUP FAILURE: {startup_err}")
    traceback.print_exc()
    raise SystemExit(1)

app = FastAPI(
    title="Image Forensic Analysis API",
    description="EfficientNet-B3 three-class image authenticity detection: Deepfake / Real / Tempered",
    version="4.0.0"
)

# Allow requests from the Node.js backend and any dev origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    image_b64: str
    file_name: Optional[str] = "image.jpg"
    metadata: Optional[dict] = None


@app.get("/")
def root():
    model = get_ai_model()
    return {
        "status": "ok",
        "service": "Image Forensic Analysis API v4.0 — EfficientNet-B3",
        "model_loaded": model.model_loaded,
        "model": "EfficientNet-B3 (CDFFAKE V2, 96.54% accuracy)",
        "classes": ["Deepfake", "Real", "Tempered"]
    }


@app.get("/health")
def health():
    model = get_ai_model()
    return {
        "status": "healthy",
        "model_loaded": model.model_loaded,
    }


import asyncio

# Limit concurrent heavy PyTorch CPU model executions to prevent thread thrashing
_INFERENCE_SEMAPHORE = asyncio.Semaphore(8)


@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    """
    Run full forensic analysis on an uploaded image.
    Returns REAL dynamic scores — NO hardcoded fallbacks.
    On any error, raises HTTP 500 with full error details.
    """
    logger.info(f"[/analyze] Received request for file: '{req.file_name}'")

    # Strip data URI prefix if present
    b64_data = req.image_b64
    if b64_data.startswith("data:"):
        b64_data = b64_data.split(",", 1)[-1]

    # Decode base64 to bytes
    try:
        image_bytes = base64.b64decode(b64_data)
    except Exception as e:
        logger.error(f"[/analyze] Invalid base64 data: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid base64 image data: {e}")

    if len(image_bytes) < 1024:
        logger.error(f"[/analyze] Image too small: {len(image_bytes)} bytes")
        raise HTTPException(status_code=400, detail="Image data too small or corrupted")

    logger.info(f"[/analyze] Image decoded: {len(image_bytes)} bytes")

    try:
        async with _INFERENCE_SEMAPHORE:
            result = await asyncio.to_thread(
                analyze_image,
                image_bytes=image_bytes,
                file_name=req.file_name or "image.jpg",
                client_metadata=req.metadata or {}
            )
    except Exception as e:

        logger.error(f"[/analyze] Analysis pipeline FAILED: {e}")
        traceback.print_exc()
        # NEVER return fake data — expose the real error
        raise HTTPException(
            status_code=500,
            detail=f"Analysis pipeline failed: {str(e)}\n{traceback.format_exc()}"
        )

    # Log the key binary scores so you can see them change per upload
    logger.info(
        f"[/analyze] == RESULT for '{req.file_name}' == "
        f"verdict={result.get('verdict')} | "
        f"is_real={result.get('is_real')} | "
        f"confidence={result.get('confidence')}% | "
        f"status={result.get('status')}"
    )

    return result


if __name__ == "__main__":
    print("=" * 60)
    print("  Image Forensic Analysis Service v4.0")
    print("  Model: EfficientNet-B3 (CDFFAKE V2 Dataset)")
    print("  Classes: Deepfake / Real / Tempered")
    print("  Running on http://0.0.0.0:5001")
    print("=" * 60)
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5001,
        reload=False,
        log_level="info"
    )
