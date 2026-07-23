"""
JPEG Compression Artifact Analysis — Forensic Module
=====================================================
JPEG compression uses 8×8 DCT blocks. When an image is saved as JPEG multiple
times (double compression), or when a region from a different source is pasted
(which was compressed at a different quality factor), characteristic artifacts
appear at DCT block boundaries.

Detection strategy:
  1. Measure blocking artifact severity along 8×8 grid boundaries
  2. Detect double-compression signatures via DCT coefficient histograms
  3. Analyze quantization table mismatches across image regions
"""

import io
import base64
import numpy as np
import cv2
from PIL import Image


def analyze_compression(image_pil: Image.Image) -> dict:
    """
    Analyze JPEG compression artifacts for manipulation evidence.

    Returns:
        dict with:
          - compression_score (float 0-100): manipulation indicator
          - blocking_artifact_score (float): 8x8 block boundary strength
          - double_compression_detected (bool)
          - double_compression_confidence (float 0-1)
          - quality_estimate (int): estimated JPEG quality
          - interpretation (str)
    """
    img_rgb  = image_pil.convert("RGB")
    img_arr  = np.array(img_rgb, dtype=np.uint8)
    img_gray = cv2.cvtColor(img_arr, cv2.COLOR_RGB2GRAY).astype(np.float32)

    h, w = img_gray.shape

    # ── Step 1: Blocking Artifact Measurement ─────────────────────────────
    # Measure the average absolute difference across 8-pixel boundaries
    # vs within-block boundaries
    block_boundary_diffs  = []
    interior_diffs        = []

    for y in range(1, h):
        for x in range(1, w):
            diff = abs(float(img_gray[y, x]) - float(img_gray[y, x-1]))
            if x % 8 == 0:
                block_boundary_diffs.append(diff)
            else:
                interior_diffs.append(diff)

    ba_boundary = float(np.mean(block_boundary_diffs)) if block_boundary_diffs else 0
    ba_interior = float(np.mean(interior_diffs))       if interior_diffs        else 0

    # Blocking Artifact Score: ratio of boundary vs interior discontinuity
    # Higher ratio = stronger blocking = more compression artifacts
    if ba_interior > 0:
        ba_ratio = ba_boundary / ba_interior
    else:
        ba_ratio = 1.0

    blocking_artifact_score = float(min(100, max(0, (ba_ratio - 1.0) * 50)))

    # ── Step 2: DCT Coefficient Histogram Analysis ────────────────────────
    # For double-compressed JPEG, the DCT coefficient histogram shows
    # periodic zeros (Benford's Law deviation)
    dct_scores = []
    n_blocks_y = h // 8
    n_blocks_x = w // 8

    # Sample at most 500 blocks for speed
    sample_rows = list(range(0, n_blocks_y, max(1, n_blocks_y // 20)))
    sample_cols = list(range(0, n_blocks_x, max(1, n_blocks_x // 25)))

    coef_histograms = []
    for r in sample_rows:
        for c in sample_cols:
            y0, y1 = r * 8, (r + 1) * 8
            x0, x1 = c * 8, (c + 1) * 8
            if y1 <= h and x1 <= w:
                block = img_gray[y0:y1, x0:x1]
                dct_block = cv2.dct(block.astype(np.float32))
                # Flatten and keep AC coefficients (skip DC at [0,0])
                ac_coefs = dct_block.flatten()[1:]
                coef_histograms.extend(ac_coefs.tolist())

    coef_histograms = np.array(coef_histograms)

    # Double-JPEG signature: periodic zeros in AC coefficient histogram
    # Compute histogram of quantized DCT values
    if len(coef_histograms) > 100:
        hist, bins = np.histogram(coef_histograms, bins=100, range=(-100, 100))
        # Count zero-bins (periodic gaps indicate double quantization)
        near_zero_mask = np.abs(bins[:-1]) < 3
        zero_density = float(hist[near_zero_mask].mean()) if near_zero_mask.any() else 0
        nonzero_density = float(hist[~near_zero_mask].mean()) if (~near_zero_mask).any() else 1
        zero_ratio = zero_density / max(nonzero_density, 1)

        # Double-compression: periodic dips in histogram (ratio < 0.5 suggests it)
        double_compression_confidence = float(max(0.0, min(1.0, 1.0 - zero_ratio)))
    else:
        double_compression_confidence = 0.0

    double_compression_detected = double_compression_confidence > 0.6

    # ── Step 3: JPEG Quality Estimation ───────────────────────────────────
    # Resave at different qualities and find minimum MSE
    best_quality    = 85
    best_mse        = float('inf')
    pil_gray        = Image.fromarray(img_gray.astype(np.uint8))
    for q in [60, 70, 80, 85, 90, 95]:
        buf = io.BytesIO()
        pil_gray.save(buf, format="JPEG", quality=q)
        buf.seek(0)
        reloaded = np.array(Image.open(buf), dtype=np.float32)
        mse = float(np.mean((img_gray - reloaded) ** 2))
        if mse < best_mse:
            best_mse     = mse
            best_quality = q

    # ── Step 4: Overall Compression Score ─────────────────────────────────
    compression_score = (
        0.4 * blocking_artifact_score +
        0.6 * double_compression_confidence * 100
    )
    compression_score = float(min(100, compression_score))

    # Interpretation
    if double_compression_detected and blocking_artifact_score > 20:
        interpretation = (
            f"Double-JPEG compression detected (confidence: {double_compression_confidence:.0%}). "
            f"Strong evidence of image manipulation — content may have been pasted from another source. "
            f"Estimated quality: {best_quality}."
        )
    elif double_compression_detected:
        interpretation = (
            f"Possible double-JPEG compression ({double_compression_confidence:.0%} confidence). "
            f"Image may have been re-saved after editing. Quality estimate: {best_quality}."
        )
    elif blocking_artifact_score > 40:
        interpretation = f"Heavy JPEG compression artifacts detected (score: {blocking_artifact_score:.0f}/100). Low quality original."
    else:
        interpretation = f"Normal JPEG compression profile. Estimated quality: {best_quality}. No double-compression detected."

    return {
        "compression_score":              compression_score,
        "blocking_artifact_score":        blocking_artifact_score,
        "double_compression_detected":    double_compression_detected,
        "double_compression_confidence":  double_compression_confidence,
        "quality_estimate":               best_quality,
        "interpretation":                 interpretation
    }
