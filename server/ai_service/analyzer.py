"""
Image Forensic Analysis Engine — EfficientNet-B3 Authoritative Verdict
=======================================================================
The EfficientNet-B3 model is the SOLE source of the final verdict and confidence.

Forensic modules (ELA, Noise, Compression, Entropy, Metadata) provide
diagnostic information only. They NEVER alter the verdict or confidence.

Verdict is determined by:
    predicted_class = argmax(softmax_probabilities)
    confidence      = max(softmax_probabilities) × 100

Returns JSON with schema:
{
    "verdict":       "Real | Deepfake | Tempered",
    "confidence":    96.54,
    "class_id":      1,
    "probabilities": {"Deepfake": 0.02, "Real": 0.965, "Tempered": 0.015}
}

Plus backwards-compatible fields for Express/React UI and Android app.
"""

import io
import sys
import os
import time
import numpy as np
import cv2
from PIL import Image

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

sys.path.append(os.path.dirname(os.path.abspath(__file__)))


from forensics.ai_model import get_ai_model
from forensics.ela import analyze_ela
from forensics.noise import analyze_noise
from forensics.copy_move import analyze_copy_move
from forensics.compression import analyze_compression
from forensics.exif_meta import analyze_exif
from forensics.edge_light import analyze_edge_lighting
from forensics.face_detector import detect_and_crop_face


def analyze_image(image_bytes: bytes, file_name: str = "image.jpg",
                  client_metadata: dict = None) -> dict:
    """
    Run EfficientNet-B3 inference + forensic diagnostic analysis.

    The EfficientNet-B3 model determines the final verdict and confidence.
    All forensic modules provide supplementary diagnostic data only.
    """
    t_start = time.time()
    client_metadata = client_metadata or {}

    # ── 1. Decode Image ────────────────────────────────────────────────────
    try:
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        return _error_result(f"Cannot decode image bytes: {str(e)}")

    is_jpeg = image_bytes[:2] == b'\xff\xd8'
    is_png  = image_bytes[:4] == b'\x89PNG'
    is_webp = len(image_bytes) > 12 and image_bytes[8:12] == b'WEBP'
    fmt_str = "JPEG" if is_jpeg else ("PNG" if is_png else ("WEBP" if is_webp else "Unknown"))
    img_w, img_h = pil_image.size

    print(f"[Forensic Engine] Analyzing '{file_name}' ({img_w}x{img_h} {fmt_str})")

    # Detect optional human face crop patch
    face_info = detect_and_crop_face(pil_image)
    face_crop = face_info.get("face_crop_pil")

    # ══════════════════════════════════════════════════════════════════════
    # PRIMARY VERDICT: EfficientNet-B3 Three-Class Classifier
    # This is the ONLY source of the final verdict and confidence.
    # ══════════════════════════════════════════════════════════════════════
    ai_model = get_ai_model()
    ai_result = ai_model.predict(pil_image, face_crop_pil=face_crop)

    # Extract the authoritative result directly from the model
    verdict       = ai_result["verdict"]        # "Real" | "Deepfake" | "Tempered"
    confidence    = ai_result["confidence"]     # softmax max × 100, e.g. 90.0
    class_id      = ai_result["class_id"]       # 0 | 1 | 2
    probabilities = ai_result["probabilities"]  # {"Deepfake": ..., "Real": ..., "Tempered": ...}

    print(
        f"[Forensic Engine] EfficientNet-B3 -> verdict={verdict}, "
        f"class_id={class_id}, confidence={confidence}%"
    )


    # ══════════════════════════════════════════════════════════════════════
    # DIAGNOSTIC MODULES — informational only, NEVER change verdict/confidence
    # ══════════════════════════════════════════════════════════════════════

    # ELA — Error Level Analysis
    ela_data = {}
    try:
        ela_data = analyze_ela(pil_image)
        diag_ela = float(np.clip(ela_data.get("ela_score", 15.0), 0, 100))
    except Exception as e:
        print(f"[Forensic Engine] ELA diagnostic warning: {e}")
        diag_ela = 15.0

    # Noise Inconsistency Analysis
    noise_data = {}
    try:
        noise_data = analyze_noise(pil_image)
        diag_noise = float(np.clip(noise_data.get("noise_score", 10.0), 0, 100))
    except Exception as e:
        print(f"[Forensic Engine] Noise diagnostic warning: {e}")
        diag_noise = 10.0

    # JPEG Compression Artifact Analysis
    comp_data = {}
    try:
        comp_data = analyze_compression(pil_image)
        diag_compression = float(np.clip(comp_data.get("compression_score", 10.0), 0, 100))
    except Exception as e:
        print(f"[Forensic Engine] Compression diagnostic warning: {e}")
        diag_compression = 10.0


    # Edge and Sharpness Analysis
    diag_sharpness = _calculate_sharpness_score(pil_image)

    # Shannon Entropy Analysis
    diag_entropy = _calculate_entropy_score(pil_image)

    # Metadata / EXIF Analysis
    try:
        exif_data = analyze_exif(image_bytes, is_jpeg)
        diag_metadata = float(np.clip(exif_data.get("exif_score", 0.0), 0, 100))
        has_exif   = exif_data.get("has_exif", False)
        is_ai_sw   = exif_data.get("is_ai_software", False)
        is_edit_sw = exif_data.get("is_editing_software", False)
        sw_name    = exif_data.get("software", "")
    except Exception as e:
        print(f"[Forensic Engine] Metadata diagnostic warning: {e}")
        exif_data     = {}
        diag_metadata = 0.0
        has_exif      = False
        is_ai_sw      = False
        is_edit_sw    = False
        sw_name       = ""

    # Copy-Move & Edge Lighting (diagnostic)
    try:
        copy_move_data = analyze_copy_move(pil_image)
    except Exception:
        copy_move_data = {}

    try:
        edge_light_data = analyze_edge_lighting(pil_image)
    except Exception:
        edge_light_data = {}

    # Image Quality (informational)
    diag_quality = _calculate_quality_score(pil_image)

    # ══════════════════════════════════════════════════════════════════════
    # DIAGNOSTIC SUMMARY — assembled for display only
    # ══════════════════════════════════════════════════════════════════════
    analysis = {
        "ai_detector":   round(ai_result.get("ai_score", 0.0), 1),  # fake-likelihood score
        "ela":           round(diag_ela, 1),
        "noise":         round(diag_noise, 1),
        "compression":   round(diag_compression, 1),
        "entropy":       round(diag_entropy, 1),
        "sharpness":     round(diag_sharpness, 1),
        "metadata":      round(diag_metadata, 1),
    }

    # Build human-readable explanation
    explanation_list = _build_explanations(
        verdict, probabilities, diag_ela, diag_noise, diag_compression,
        has_exif, is_ai_sw, is_edit_sw, sw_name
    )
    explanation = " | ".join(explanation_list)

    elapsed = round(time.time() - t_start, 2)
    print(
        f"[Forensic Engine] Done in {elapsed}s | "
        f"Verdict: {verdict} | Confidence: {confidence}% | class_id: {class_id}"
    )

    # Backwards-compatible values derived from the model verdict
    is_real       = verdict == "Real"
    fake_prob     = round(probabilities.get("Deepfake", 0.0) + probabilities.get("Tempered", 0.0), 4)
    real_prob     = round(probabilities.get("Real", 0.0), 4)
    authenticity  = round(real_prob * 100, 1)

    status_map = {"Real": "verified", "Deepfake": "flagged", "Tempered": "flagged"}
    status = status_map.get(verdict, "flagged")

    manipulation_map = {"Deepfake": "Deepfake", "Tempered": "Tampered", "Real": "None"}
    manipulation_type = manipulation_map.get(verdict, "Unknown")

    confidence_tier = "High" if confidence >= 80 else ("Medium" if confidence >= 60 else "Low")

    heatmap_b64 = ela_data.get("heatmap_base64", "") if isinstance(ela_data, dict) else ""

    return {
        # ── Primary schema (EfficientNet-B3 authoritative output) ──────────
        "verdict":       verdict,
        "confidence":    confidence,
        "class_id":      class_id,
        "probabilities": probabilities,

        # ── Diagnostic fields ──────────────────────────────────────────────
        "analysis":      analysis,
        "explanation":   explanation,

        # ── Backwards-compatible fields for Express, React UI, Android ─────
        "authenticity_score": authenticity,
        "fake_probability":   round(fake_prob * 100, 1),
        "real_probability":   round(real_prob * 100, 1),
        "is_real":            is_real,
        "status":             status,
        "prediction":         verdict,
        "confidenceTier":     confidence_tier,
        "manipulationType":   manipulation_type,
        "fileName":           file_name,
        "fileSize":           client_metadata.get("fileSize", f"{len(image_bytes)/1048576:.1f} MB"),
        "resolution":         client_metadata.get("resolution", f"{img_w}x{img_h} px"),
        "indicators": [
            f"EfficientNet-B3 Verdict: {verdict} ({confidence}% confidence)",
            f"Deepfake Probability: {round(probabilities.get('Deepfake', 0)*100, 1)}%",
            f"Real Probability:     {round(probabilities.get('Real', 0)*100, 1)}%",
            f"Tempered Probability: {round(probabilities.get('Tempered', 0)*100, 1)}%",
            f"Error Level Analysis (ELA): {analysis['ela']}/100 (diagnostic only)",
            f"Noise Inconsistency: {analysis['noise']}/100 (diagnostic only)",
            f"JPEG Compression: {analysis['compression']}/100 (diagnostic only)",
            f"Metadata: {exif_data.get('interpretation', 'EXIF evaluated')} (diagnostic only)",
        ],
        "metadata": {
            "format":      fmt_str,
            "colorSpace":  "sRGB",
            "orientation": "Landscape" if img_w >= img_h else "Portrait",
            "processing":  "EfficientNet-B3 (CDFFAKE V2) — 96.54% Test Accuracy",
            "statusText":  f"EfficientNet-B3: {verdict} ({confidence}% confidence)",
        },
        "heatmap": heatmap_b64,
        "forensicDetails": {
            "verdictSource":         "EfficientNet-B3 argmax(softmax)",
            "diagnosticModules":     "ELA, Noise, Compression, Entropy, Sharpness, Metadata — informational only",
            "weightsApplied":         "Case A (PNG)" if is_png else ("Case B (JPEG)" if is_jpeg else "Case C"),
            "ela":                   ela_data,
            "aiModel":               ai_result,
            "copyMove":              copy_move_data,
            "compression":           comp_data,
            "exif":                  exif_data,
            "edgeLighting":          edge_light_data,
            "faceDetected":          face_info.get("has_face", False),
            "faceCount":             face_info.get("face_count", 0),
            "processingTimeSeconds": elapsed,
        },
        "aiModel":    "EfficientNet-B3 Custom Trained (CDFFAKE V2)",
        "aiAccuracy": "96.54% Test Accuracy — 3-Class: Deepfake / Real / Tempered",
    }



# ─────────────────────────────────────────────────────────────────────────────
# Forensic Diagnostic Calculators (informational only)
# ─────────────────────────────────────────────────────────────────────────────

def _calculate_sharpness_score(pil_img: Image.Image) -> float:
    """
    Edge and Sharpness Analysis — diagnostic only.
    Measures Laplacian variance and Sobel edge density.
    """
    try:
        gray = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2GRAY)
        lap_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        if lap_var < 50.0:
            score = 65.0 - (lap_var / 50.0) * 20.0
        elif lap_var > 1200.0:
            score = min(60.0, (lap_var - 1200.0) / 50.0)
        else:
            score = 15.0
        return float(np.clip(score, 0, 100))
    except Exception:
        return 15.0


def _calculate_entropy_score(pil_img: Image.Image) -> float:
    """
    Shannon Entropy Analysis — diagnostic only.
    Natural photos: entropy between 6.2 and 7.8.
    """
    try:
        gray = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2GRAY)
        hist, _ = np.histogram(gray.ravel(), bins=256, range=(0, 256))
        total = gray.size
        probs = hist / total
        probs = probs[probs > 0]
        entropy = -float(np.sum(probs * np.log2(probs)))
        if 6.2 <= entropy <= 7.8:
            score = 10.0
        elif entropy < 5.5:
            score = min(85.0, (5.5 - entropy) * 35.0)
        else:
            score = min(75.0, abs(entropy - 7.0) * 25.0)
        return float(np.clip(score, 0, 100))
    except Exception:
        return 15.0


def _calculate_quality_score(pil_img: Image.Image) -> float:
    """
    Image Quality Analysis — diagnostic only.
    Measures dynamic range and contrast clipping.
    """
    try:
        gray = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2GRAY)
        min_v, max_v = float(gray.min()), float(gray.max())
        dyn_range = max_v - min_v
        return 60.0 if dyn_range < 100 else 90.0
    except Exception:
        return 80.0


def _build_explanations(verdict: str, probabilities: dict,
                        ela_score: float, noise_score: float,
                        comp_score: float, has_exif: bool,
                        is_ai_sw: bool, is_edit_sw: bool, sw_name: str) -> list:
    """
    Generate human-readable diagnostic summaries.
    These describe what the model and forensic tools observed —
    they do NOT influence the verdict.
    """
    reasons = []
    df_pct = round(probabilities.get("Deepfake", 0.0) * 100, 1)
    re_pct = round(probabilities.get("Real",     0.0) * 100, 1)
    tm_pct = round(probabilities.get("Tempered", 0.0) * 100, 1)

    # 1. EfficientNet-B3 result
    if verdict == "Deepfake":
        reasons.append(
            f"EfficientNet-B3 classified this image as a Deepfake "
            f"(Deepfake: {df_pct}%, Real: {re_pct}%, Tempered: {tm_pct}%)."
        )
    elif verdict == "Tempered":
        reasons.append(
            f"EfficientNet-B3 detected image tampering "
            f"(Deepfake: {df_pct}%, Real: {re_pct}%, Tempered: {tm_pct}%)."
        )
    else:
        reasons.append(
            f"EfficientNet-B3 classified this image as authentic "
            f"(Deepfake: {df_pct}%, Real: {re_pct}%, Tempered: {tm_pct}%)."
        )

    # 2. Metadata (diagnostic only)
    if is_ai_sw:
        reasons.append(f"Diagnostic: EXIF metadata indicates generative AI tool: {sw_name} (informational only).")
    elif is_edit_sw:
        reasons.append(f"Diagnostic: Editing software detected in EXIF: {sw_name} (informational only).")
    elif has_exif:
        reasons.append("Diagnostic: Metadata consistent with genuine camera hardware.")
    else:
        reasons.append("Diagnostic: No EXIF metadata present (neutral, informational only).")

    # 3. Noise & Texture (diagnostic only)
    if noise_score < 30.0:
        reasons.append("Diagnostic: Noise pattern appears natural across color channels.")
    else:
        reasons.append("Diagnostic: Sensor noise inconsistency detected (informational only).")

    # 4. ELA & Compression (diagnostic only)
    if ela_score < 35.0 and comp_score < 35.0:
        reasons.append("Diagnostic: ELA shows no heavy editing or splicing signatures.")
    else:
        reasons.append("Diagnostic: ELA/compression artifacts detected (informational only).")

    return reasons


def _error_result(message: str) -> dict:
    """
    Returns an error result only when the image cannot be decoded at all.
    The EfficientNet model was not reached, so no verdict is available.
    """
    return {
        "verdict":            "Unknown",
        "confidence":         0.0,
        "class_id":           -1,
        "probabilities":      {"Deepfake": 0.0, "Real": 0.0, "Tempered": 0.0},
        "analysis": {
            "ai_detector": 0.0, "ela": 0.0, "noise": 0.0,
            "compression": 0.0, "entropy": 0.0, "sharpness": 0.0, "metadata": 0.0
        },
        "explanation":        f"Image decoding error: {message}. Could not run EfficientNet-B3.",
        "authenticity_score": 0.0,
        "fake_probability":   0.0,
        "real_probability":   0.0,
        "is_real":            False,
        "status":             "error",
        "prediction":         "Unknown",
        "confidenceTier":     "None",
        "manipulationType":   "Unknown",
        "indicators":         [f"Error: {message}"],
        "metadata":           {},
        "heatmap":            "",
        "forensicDetails":    {},
        "aiModel":            "EfficientNet-B3 (CDFFAKE V2)",
        "aiAccuracy":         "—",
    }
