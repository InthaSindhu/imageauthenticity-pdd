"""
Noise Pattern Analysis — Forensic Module
=========================================
Authentic camera images contain sensor noise that follows the Poisson–Gaussian
noise model. The noise variance increases proportionally with the signal (brighter
areas are noisier). When an image is manipulated by splicing or compositing,
the noise in the pasted region comes from a different camera/context, creating
detectable discontinuities in the noise field.

AI-generated images have spatially correlated, non-camera noise that also
departs from the Poisson–Gaussian model.
"""

import io
import base64
import numpy as np
import cv2
from PIL import Image
from scipy.ndimage import gaussian_filter


def analyze_noise(image_pil: Image.Image) -> dict:
    """
    Perform noise pattern analysis to detect manipulation evidence.

    Returns:
        dict with:
          - noise_score (float 0-100): overall manipulation indicator
          - noise_mean (float): mean noise level
          - noise_variance (float): overall noise variance
          - inconsistency_score (float): local noise inconsistency
          - poisson_correlation (float): how well noise follows Poisson model (authentic ↑)
          - interpretation (str)
          - heatmap_base64 (str): PNG heatmap
    """
    img_rgb = image_pil.convert("RGB")
    img_arr = np.array(img_rgb, dtype=np.float32)

    # ── Step 1: Extract Noise Residual ────────────────────────────────────
    # Use Gaussian blur to estimate the "signal" component,
    # then subtract to get the noise residual
    img_gray = cv2.cvtColor(img_arr.astype(np.uint8), cv2.COLOR_RGB2GRAY).astype(np.float32)
    smoothed = gaussian_filter(img_gray, sigma=1.5)
    noise_residual = img_gray - smoothed  # isolate noise

    # ── Step 2: Local Noise Variance Map ──────────────────────────────────
    h, w = img_gray.shape
    block_size = 32
    rows = h // block_size
    cols = w // block_size

    local_vars = []
    block_map  = np.zeros((rows, cols), dtype=np.float32)

    for r in range(rows):
        for c in range(cols):
            y0, y1 = r * block_size, (r + 1) * block_size
            x0, x1 = c * block_size, (c + 1) * block_size
            block = noise_residual[y0:y1, x0:x1]
            v = float(np.var(block))
            local_vars.append(v)
            block_map[r, c] = v

    local_vars = np.array(local_vars)
    global_var  = float(np.var(noise_residual))
    local_mean  = float(local_vars.mean()) if len(local_vars) > 0 else 0
    local_std   = float(local_vars.std())  if len(local_vars) > 0 else 0

    # ── Step 3: Poisson–Gaussian Correlation ──────────────────────────────
    # For authentic camera images: var(noise) ∝ mean(signal)
    # Compute this correlation per block
    signal_means = []
    noise_vars   = []
    for r in range(rows):
        for c in range(cols):
            y0, y1 = r * block_size, (r + 1) * block_size
            x0, x1 = c * block_size, (c + 1) * block_size
            block_signal = img_gray[y0:y1, x0:x1]
            block_noise  = noise_residual[y0:y1, x0:x1]
            signal_means.append(float(block_signal.mean()))
            noise_vars.append(float(np.var(block_noise)))

    # Pearson correlation between signal level and noise variance
    if len(signal_means) > 2:
        corr = float(np.corrcoef(signal_means, noise_vars)[0, 1])
        poisson_correlation = max(0.0, corr)  # Should be positive for authentic images
    else:
        poisson_correlation = 0.0

    # ── Step 4: Noise Inconsistency Score ─────────────────────────────────
    # High variance in LOCAL noise variance = inconsistencies = manipulation
    # (normalized relative to mean)
    inconsistency = local_std / max(local_mean + 1e-6, 1.0)
    inconsistency_score = float(min(100, inconsistency * 100))

    # ── Step 5: Noise Integrity Score (0 = very inconsistent) ─────────────
    #
    # Authentic cameras: moderate noise, positively correlated with signal,
    # relatively uniform noise variance across image.
    #
    # Manipulated: abrupt noise changes at splice boundaries.
    # AI-generated: very low, spatially correlated noise.

    noise_mean = float(np.abs(noise_residual).mean())

    # Low Poisson correlation means noise doesn't follow camera physics
    poisson_penalty = max(0, (0.3 - poisson_correlation) * 100)

    # High inconsistency score means local noise variance is non-uniform
    inconsistency_penalty = inconsistency_score * 0.5

    # Very low noise overall might mean AI-generated (too clean)
    low_noise_penalty = max(0, (2.0 - noise_mean) * 15) if noise_mean < 2.0 else 0

    noise_score = min(100, poisson_penalty + inconsistency_penalty + low_noise_penalty)
    noise_score = float(noise_score)

    # Interpretation
    if noise_mean < 1.0:
        interpretation = "Extremely low noise — may indicate AI-generated or heavily processed image"
        is_suspicious  = True
    elif poisson_correlation > 0.5 and inconsistency_score < 30:
        interpretation = "Noise pattern consistent with authentic camera sensor (Poisson–Gaussian model)"
        is_suspicious  = False
    elif inconsistency_score > 60:
        interpretation = f"High local noise inconsistency ({inconsistency_score:.0f}/100) — potential splice boundary detected"
        is_suspicious  = True
    elif poisson_correlation < 0.1:
        interpretation = "Noise does not correlate with signal level — inconsistent with camera physics"
        is_suspicious  = True
    else:
        interpretation = "Noise pattern within acceptable range for authentic image"
        is_suspicious  = False

    heatmap_b64 = _generate_noise_heatmap(block_map, img_arr)

    return {
        "noise_score":          noise_score,
        "noise_mean":           noise_mean,
        "noise_variance":       global_var,
        "inconsistency_score":  inconsistency_score,
        "poisson_correlation":  poisson_correlation,
        "is_suspicious":        is_suspicious,
        "interpretation":       interpretation,
        "heatmap_base64":       heatmap_b64
    }


def _generate_noise_heatmap(block_map: np.ndarray, original: np.ndarray) -> str:
    """Generate noise inconsistency heatmap overlaid on original."""
    orig_uint8 = np.clip(original, 0, 255).astype(np.uint8)
    h, w, _ = orig_uint8.shape

    # Upscale block_map to image size
    norm_map = cv2.normalize(block_map, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    upscaled = cv2.resize(norm_map, (w, h), interpolation=cv2.INTER_LINEAR)
    heatmap_color = cv2.applyColorMap(upscaled, cv2.COLORMAP_INFERNO)
    heatmap_color = cv2.cvtColor(heatmap_color, cv2.COLOR_BGR2RGB)

    blended = cv2.addWeighted(orig_uint8, 0.6, heatmap_color, 0.4, 0)

    pil_out = Image.fromarray(blended)
    buf = io.BytesIO()
    pil_out.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
