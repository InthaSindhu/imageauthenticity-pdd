"""
Edge & Lighting Consistency Analysis — Forensic Module
======================================================
In authentic photographs, lighting and shadows are physically consistent:
  - Light direction is the same across the whole scene
  - Shadow angles match the light source position
  - Gradient field is integrable (it's consistent with a real 3D scene)

When images are manipulated by pasting objects from different photos,
the lighting conditions of the pasted region typically don't match
the rest of the image, creating detectable inconsistencies.
"""

import io
import base64
import numpy as np
import cv2
from PIL import Image
from scipy.ndimage import gaussian_filter


def analyze_edge_lighting(image_pil: Image.Image) -> dict:
    """
    Analyze edge and lighting consistency to detect manipulation.

    Returns:
        dict with:
          - edge_score (float 0-100): edge inconsistency indicator
          - lighting_score (float 0-100): lighting inconsistency indicator
          - combined_score (float 0-100): overall indicator
          - lighting_direction (str): estimated primary light direction
          - local_inconsistency_score (float): regional lighting variance
          - is_suspicious (bool)
          - interpretation (str)
          - heatmap_base64 (str)
    """
    img_rgb = image_pil.convert("RGB")
    img_arr = np.array(img_rgb, dtype=np.uint8)
    h, w    = img_arr.shape[:2]

    img_gray = cv2.cvtColor(img_arr, cv2.COLOR_RGB2GRAY).astype(np.float32)

    # ── Step 1: Gradient Field Analysis ───────────────────────────────────
    # Compute image gradients
    gx = cv2.Sobel(img_gray, cv2.CV_32F, 1, 0, ksize=3)
    gy = cv2.Sobel(img_gray, cv2.CV_32F, 0, 1, ksize=3)

    gradient_mag = np.sqrt(gx**2 + gy**2)
    gradient_dir = np.arctan2(gy, gx)  # in radians, -pi to pi

    # ── Step 2: Local Lighting Direction Estimation ────────────────────────
    # In authentic images, bright edges should come mostly from the same direction
    # (consistent lighting). Divide into a grid and estimate local light direction.
    block_size  = max(h // 8, 32)
    rows        = h // block_size
    cols        = w // block_size

    local_angles = []
    local_mag    = []
    angle_map    = np.zeros((rows, cols), dtype=np.float32)

    for r in range(rows):
        for c in range(cols):
            y0, y1 = r * block_size, (r + 1) * block_size
            x0, x1 = c * block_size, (c + 1) * block_size
            block_gx  = gx[y0:y1, x0:x1]
            block_gy  = gy[y0:y1, x0:x1]
            block_mag = gradient_mag[y0:y1, x0:x1]

            if block_mag.max() > 0:
                # Weighted average direction (weight by gradient magnitude)
                weights    = block_mag.flatten()
                angles_blk = np.arctan2(block_gy.flatten(), block_gx.flatten())
                if weights.sum() > 0:
                    # Circular mean of angles
                    mean_sin = np.average(np.sin(angles_blk), weights=weights)
                    mean_cos = np.average(np.cos(angles_blk), weights=weights)
                    mean_angle = float(np.arctan2(mean_sin, mean_cos))
                    local_angles.append(mean_angle)
                    local_mag.append(float(block_mag.mean()))
                    angle_map[r, c] = mean_angle
                else:
                    local_angles.append(0.0)
                    local_mag.append(0.0)
                    angle_map[r, c] = 0.0

    # ── Step 3: Lighting Consistency Score ────────────────────────────────
    # Compute circular variance of local angle estimates
    # Low variance → consistent lighting direction → authentic
    # High variance → inconsistent → possible manipulation
    if len(local_angles) > 2:
        angles_arr  = np.array(local_angles)
        mean_sin    = np.mean(np.sin(angles_arr))
        mean_cos    = np.mean(np.cos(angles_arr))
        # Resultant length (R): 1 = perfectly consistent, 0 = totally random
        R            = float(np.sqrt(mean_sin**2 + mean_cos**2))
        circular_var = 1.0 - R  # 0 = consistent, 1 = random

        # Primary light direction estimate
        global_angle = float(np.arctan2(mean_sin, mean_cos))
        angle_deg    = float(np.degrees(global_angle)) % 360
        lighting_dir = _angle_to_direction(angle_deg)
    else:
        circular_var = 0.0
        lighting_dir = "Unknown"
        R = 1.0

    # Local inconsistency: are neighboring blocks' lighting directions very different?
    neighbor_diffs = []
    for r in range(rows):
        for c in range(cols):
            if c + 1 < cols:
                diff = abs(float(angle_map[r, c]) - float(angle_map[r, c+1]))
                diff = min(diff, 2 * np.pi - diff)  # circular distance
                neighbor_diffs.append(diff)
            if r + 1 < rows:
                diff = abs(float(angle_map[r, c]) - float(angle_map[r+1, c]))
                diff = min(diff, 2 * np.pi - diff)
                neighbor_diffs.append(diff)

    local_inconsistency = float(np.mean(neighbor_diffs)) if neighbor_diffs else 0.0

    lighting_score = float(min(100, circular_var * 100 * 0.6 + local_inconsistency * 30))

    # ── Step 4: Edge Sharpness Consistency ────────────────────────────────
    # Check if edge sharpness is globally consistent
    # In composited images, pasted objects often have different sharpness
    edge_vars = []
    for r in range(rows):
        for c in range(cols):
            y0, y1 = r * block_size, (r + 1) * block_size
            x0, x1 = c * block_size, (c + 1) * block_size
            block_mag_local = gradient_mag[y0:y1, x0:x1]
            edge_vars.append(float(np.var(block_mag_local)))

    edge_var_std = float(np.std(edge_vars)) if edge_vars else 0
    edge_var_mean = float(np.mean(edge_vars)) if edge_vars else 1

    # High coefficient of variation in block-level gradient magnitudes = inconsistency
    edge_cv = edge_var_std / max(edge_var_mean, 1.0)
    edge_score = float(min(100, edge_cv * 50))

    # ── Step 5: Combined Score ─────────────────────────────────────────────
    combined_score = float(0.55 * lighting_score + 0.45 * edge_score)
    is_suspicious  = combined_score > 45

    # Interpretation
    if is_suspicious and lighting_score > 60:
        interpretation = (
            f"Significant lighting inconsistency detected (score: {lighting_score:.0f}/100). "
            f"Primary light direction: {lighting_dir}. "
            "Different regions show conflicting light directions, suggesting compositing."
        )
    elif is_suspicious and edge_score > 50:
        interpretation = (
            f"Edge sharpness inconsistency detected across image regions (score: {edge_score:.0f}/100). "
            "Possible object insertion from a different source."
        )
    elif combined_score > 25:
        interpretation = (
            f"Moderate edge/lighting inconsistency (score: {combined_score:.0f}/100). "
            f"Primary light source: {lighting_dir}. Inconclusive."
        )
    else:
        interpretation = (
            f"Edge and lighting appear globally consistent (score: {combined_score:.0f}/100). "
            f"Primary light direction: {lighting_dir}. Consistent with authentic photograph."
        )

    heatmap_b64 = _generate_lighting_heatmap(gradient_mag, img_arr)

    return {
        "edge_score":              edge_score,
        "lighting_score":          lighting_score,
        "combined_score":          combined_score,
        "lighting_direction":      lighting_dir,
        "local_inconsistency_score": float(local_inconsistency * 100),
        "circular_variance":       float(circular_var),
        "is_suspicious":           is_suspicious,
        "interpretation":          interpretation,
        "heatmap_base64":          heatmap_b64
    }


def _angle_to_direction(angle_deg: float) -> str:
    dirs = ["Right", "Upper-Right", "Up", "Upper-Left",
            "Left", "Lower-Left", "Down", "Lower-Right"]
    idx = int((angle_deg + 22.5) / 45) % 8
    return dirs[idx]


def _generate_lighting_heatmap(gradient_mag: np.ndarray, original: np.ndarray) -> str:
    orig_uint8 = np.clip(original, 0, 255).astype(np.uint8)
    h, w, _ = orig_uint8.shape

    norm = cv2.normalize(gradient_mag, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    colored = cv2.applyColorMap(norm, cv2.COLORMAP_PLASMA)
    colored = cv2.cvtColor(colored, cv2.COLOR_BGR2RGB)
    blended = cv2.addWeighted(orig_uint8, 0.6, colored, 0.4, 0)

    pil_out = Image.fromarray(blended)
    buf     = io.BytesIO()
    pil_out.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
