"""
Error Level Analysis (ELA) — Full-Resolution Forensic Module
============================================================
Performs Error Level Analysis at FULL ORIGINAL RESOLUTION without prior downsampling.
Downsampling / interpolation overwrites high-frequency noise & JPEG quantization artifacts.

Also extracts fixed 256x256 pixel crops directly from the original resolution to preserve
microscopic pixel-level physics.
"""

import io
import base64
import numpy as np
import cv2
from PIL import Image


def analyze_ela(image_pil: Image.Image, quality: int = 90) -> dict:
    """
    Perform Error Level Analysis at full original resolution.
    Extracts fixed 256x256 crops from original resolution for quantization analysis.

    Returns:
        dict containing ELA metrics, 256x256 crop ELA score, suspicious regions, and heatmap base64.
    """
    img_rgb = image_pil.convert("RGB")
    w, h = img_rgb.size

    # Resave at known JPEG quality at full resolution
    buffer = io.BytesIO()
    img_rgb.save(buffer, format="JPEG", quality=quality)
    buffer.seek(0)
    resaved = Image.open(buffer).convert("RGB")
    resaved.load()

    # Compute full-resolution pixel difference
    orig_arr  = np.array(img_rgb,  dtype=np.float32)
    saved_arr = np.array(resaved,  dtype=np.float32)
    diff      = np.abs(orig_arr - saved_arr)

    # Scale for visibility
    ela_scaled = np.clip(diff * 10.0, 0, 255).astype(np.uint8)
    ela_gray   = ela_scaled.mean(axis=2)  # Full resolution ELA grayscale map

    ela_mean = float(ela_gray.mean())
    ela_std  = float(ela_gray.std())
    ela_max  = float(ela_gray.max())

    # ── Extract Fixed 256x256 Crop from Original Resolution ───────────────
    crop_size = 256
    if w >= crop_size and h >= crop_size:
        # 1. Center 256x256 Crop
        cx0 = (w - crop_size) // 2
        cy0 = (h - crop_size) // 2
        center_crop_ela = ela_gray[cy0:cy0+crop_size, cx0:cx0+crop_size]
        crop_mean = float(center_crop_ela.mean())
        crop_std  = float(center_crop_ela.std())
    else:
        crop_mean = ela_mean
        crop_std  = ela_std

    # Uniformity: low std relative to mean → unnaturally flat (AI-generated indicator)
    ela_uniformity = 1.0 - min(1.0, ela_std / max(ela_mean + 1e-6, 1.0))

    # Find suspicious regions using 32x32 blocks on full resolution
    block_size = 32
    suspicious_regions = []
    if ela_mean > 0:
        threshold = ela_mean + 2.5 * ela_std
        for y in range(0, h - block_size, block_size):
            for x in range(0, w - block_size, block_size):
                block_mean = ela_gray[y:y+block_size, x:x+block_size].mean()
                if block_mean > threshold:
                    suspicious_regions.append({
                        "x": int(x), "y": int(y),
                        "w": block_size, "h": block_size,
                        "score": float(block_mean)
                    })

    # ELA Score calculation (combines full resolution mean, crop mean, and region anomaly density)
    mean_score   = min(100.0, ela_mean * 2.5)
    std_score    = min(100.0, ela_std * 3.0)
    crop_score   = min(100.0, crop_mean * 2.5)
    region_score = min(100.0, len(suspicious_regions) * 2.5)

    ela_score = 0.35 * mean_score + 0.30 * std_score + 0.20 * crop_score + 0.15 * region_score
    ela_score = float(np.clip(ela_score, 0, 100))

    if ela_mean < 3.0:
        ela_interpretation = "Extremely low ELA — possible AI-generated image (no JPEG compression history)"
        ai_generated_signal = True
    elif ela_score > 60:
        ela_interpretation = f"High ELA score ({ela_score:.0f}/100) — significant compression inconsistencies detected"
        ai_generated_signal = False
    elif ela_score > 35:
        ela_interpretation = f"Moderate ELA score ({ela_score:.0f}/100) — mild local compression variance"
        ai_generated_signal = False
    else:
        ela_interpretation = f"Normal ELA score ({ela_score:.0f}/100) — uniform compression history across full resolution"
        ai_generated_signal = False

    heatmap_b64 = _generate_heatmap(ela_gray, orig_arr)

    return {
        "ela_score":           ela_score,
        "ela_mean":            ela_mean,
        "ela_std":             ela_std,
        "ela_max":             ela_max,
        "crop_256_mean":       crop_mean,
        "crop_256_std":        crop_std,
        "ela_uniformity":      ela_uniformity,
        "suspicious_regions":  suspicious_regions[:20],
        "interpretation":      ela_interpretation,
        "ai_generated_signal": ai_generated_signal,
        "heatmap_base64":      heatmap_b64
    }


def _generate_heatmap(ela_gray: np.ndarray, original: np.ndarray) -> str:
    norm = cv2.normalize(ela_gray, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    heatmap_color = cv2.applyColorMap(norm, cv2.COLORMAP_JET)
    heatmap_color = cv2.cvtColor(heatmap_color, cv2.COLOR_BGR2RGB)

    orig_uint8 = np.clip(original, 0, 255).astype(np.uint8)
    blended = cv2.addWeighted(orig_uint8, 0.5, heatmap_color, 0.5, 0)

    pil_out = Image.fromarray(blended)
    buf = io.BytesIO()
    pil_out.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
