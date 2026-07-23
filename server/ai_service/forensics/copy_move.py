"""
Copy-Move Forgery Detection — Forensic Module
=============================================
Copy-move forgery is the most common type of image manipulation:
a region of the image is copied and pasted (possibly with slight
transformation) somewhere else in the same image to hide or duplicate content.

Detection approach:
  1. Divide image into overlapping 16×16 patches
  2. Compute DCT features for each patch (efficient descriptor)
  3. Lexicographically sort patches and compare neighbors
  4. Flag patches with high similarity that are spatially far apart
  5. Cluster matched pairs to identify copied regions
"""

import io
import base64
import numpy as np
import cv2
from PIL import Image


def analyze_copy_move(image_pil: Image.Image) -> dict:
    """
    Detect copy-move forgery in the image.

    Returns:
        dict with:
          - copy_move_score (float 0-100): manipulation indicator
          - matched_pairs (int): number of suspicious matching patch pairs
          - is_suspicious (bool)
          - interpretation (str)
          - heatmap_base64 (str)
    """
    img_rgb  = image_pil.convert("RGB")
    img_arr  = np.array(img_rgb, dtype=np.uint8)
    img_gray = cv2.cvtColor(img_arr, cv2.COLOR_RGB2GRAY)

    h, w = img_gray.shape

    # Downsample for speed if image is large (>1024 on either side)
    scale = 1.0
    max_dim = 800
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        new_w = int(w * scale)
        new_h = int(h * scale)
        img_gray_small = cv2.resize(img_gray, (new_w, new_h), interpolation=cv2.INTER_AREA)
    else:
        img_gray_small = img_gray
        new_h, new_w = h, w

    # ── Step 1: Extract overlapping patches ───────────────────────────────
    step       = 8   # sliding step
    patch_size = 16  # patch size
    patches    = []
    positions  = []

    for y in range(0, new_h - patch_size, step):
        for x in range(0, new_w - patch_size, step):
            patch = img_gray_small[y:y+patch_size, x:x+patch_size].astype(np.float32)
            patches.append(patch.flatten())
            positions.append((x, y))

    if len(patches) < 10:
        return {
            "copy_move_score":  0.0,
            "matched_pairs":    0,
            "is_suspicious":    False,
            "interpretation":   "Image too small for copy-move analysis",
            "heatmap_base64":   ""
        }

    patches_arr = np.array(patches, dtype=np.float32)
    positions   = np.array(positions)

    # ── Step 2: DCT feature reduction ─────────────────────────────────────
    # Apply DCT to each patch and keep first N coefficients (zig-zag order)
    n_coefs = 16  # keep top-16 DCT coefficients as feature
    features = np.zeros((len(patches_arr), n_coefs), dtype=np.float32)
    for i, patch_flat in enumerate(patches_arr):
        p = patch_flat.reshape(patch_size, patch_size)
        dct = cv2.dct(p)
        # Zig-zag scan the top-left 4×4 triangle (16 coefficients)
        zigzag = _zigzag_4x4(dct)
        features[i] = zigzag

    # ── Step 3: Lexicographic sort and nearest-neighbor comparison ─────────
    sort_idx   = np.lexsort(features[:, ::-1].T)
    sorted_pos = positions[sort_idx]
    sorted_feat = features[sort_idx]

    # Compare consecutive sorted entries
    match_heatmap = np.zeros((new_h, new_w), dtype=np.float32)
    matched_pairs = 0
    min_dist_px   = patch_size * 2  # must be spatially apart to be interesting

    for i in range(len(sorted_feat) - 1):
        diff = np.abs(sorted_feat[i] - sorted_feat[i+1]).sum()
        if diff < 2.0:  # very similar patches
            x1, y1 = sorted_pos[i]
            x2, y2 = sorted_pos[i+1]
            spatial_dist = np.sqrt((x1-x2)**2 + (y1-y2)**2)
            if spatial_dist > min_dist_px:
                matched_pairs += 1
                # Mark both regions in heatmap
                match_heatmap[y1:y1+patch_size, x1:x1+patch_size] += 1
                match_heatmap[y2:y2+patch_size, x2:x2+patch_size] += 1

    # ── Step 4: Score computation ──────────────────────────────────────────
    total_patches = len(patches)

    # Matched pairs ratio
    pair_ratio = matched_pairs / max(total_patches * 0.01, 1)
    copy_move_score = float(min(100, pair_ratio * 40))

    if matched_pairs > 50:
        copy_move_score = min(100, copy_move_score + 30)
    if matched_pairs > 200:
        copy_move_score = min(100, copy_move_score + 30)

    is_suspicious = copy_move_score > 30 or matched_pairs > 30

    if matched_pairs == 0:
        interpretation = "No copy-move regions detected"
    elif matched_pairs < 10:
        interpretation = f"Low copy-move signal ({matched_pairs} patch matches) — could be repetitive texture"
    elif matched_pairs < 50:
        interpretation = f"Moderate copy-move signal ({matched_pairs} patch matches) — possible cloning"
    else:
        interpretation = f"Strong copy-move evidence ({matched_pairs} patch matches) — duplicated regions detected"

    # Generate heatmap (upscale back to original size)
    heatmap_b64 = _generate_copymove_heatmap(match_heatmap, img_arr, scale, h, w)

    return {
        "copy_move_score":  copy_move_score,
        "matched_pairs":    int(matched_pairs),
        "is_suspicious":    is_suspicious,
        "interpretation":   interpretation,
        "heatmap_base64":   heatmap_b64
    }


def _zigzag_4x4(dct_matrix: np.ndarray) -> np.ndarray:
    """Return first 16 coefficients from a DCT matrix in zig-zag order."""
    zigzag_indices = [
        (0,0),(0,1),(1,0),(2,0),(1,1),(0,2),(0,3),(1,2),
        (2,1),(3,0),(3,1),(2,2),(1,3),(2,3),(3,2),(3,3)
    ]
    h, w = dct_matrix.shape
    return np.array([
        dct_matrix[r,c] if r < h and c < w else 0.0
        for r, c in zigzag_indices
    ], dtype=np.float32)


def _generate_copymove_heatmap(heatmap: np.ndarray, original: np.ndarray,
                                scale: float, orig_h: int, orig_w: int) -> str:
    orig_uint8 = np.clip(original, 0, 255).astype(np.uint8)

    norm = cv2.normalize(heatmap, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    upscaled = cv2.resize(norm, (orig_w, orig_h), interpolation=cv2.INTER_LINEAR)
    colored = cv2.applyColorMap(upscaled, cv2.COLORMAP_HOT)
    colored = cv2.cvtColor(colored, cv2.COLOR_BGR2RGB)

    blended = cv2.addWeighted(orig_uint8, 0.55, colored, 0.45, 0)
    pil_out = Image.fromarray(blended)

    buf = io.BytesIO()
    pil_out.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
