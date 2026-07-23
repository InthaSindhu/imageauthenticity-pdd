"""
EXIF Metadata Analysis — Forensic Module
=========================================
EXIF (Exchangeable Image File Format) stores camera parameters, GPS data,
timestamps, and software information inside JPEG/TIFF files.

For forensic analysis:
  - Missing mandatory camera EXIF → possible screenshot, AI-generated, or web download
  - Editing software (Photoshop, GIMP, SD) listed in Software field → definite editing
  - Timestamp inconsistencies → possible manipulation
  - GPS coordinates present → helps establish authenticity context
  - Conflicting Make/Model → possible metadata injection
"""

import io
from typing import Optional

try:
    import exifread
    EXIFREAD_AVAILABLE = True
except ImportError:
    EXIFREAD_AVAILABLE = False


def analyze_exif(image_bytes: bytes, is_jpeg: bool) -> dict:
    """
    Extract and analyze EXIF metadata from raw image bytes.

    Returns:
        dict with:
          - has_exif (bool): EXIF data found
          - camera_make (str | None)
          - camera_model (str | None)
          - software (str | None)
          - datetime_original (str | None)
          - gps_available (bool)
          - gps_lat (float | None), gps_lon (float | None)
          - is_editing_software (bool): e.g. Photoshop, GIMP, SD
          - is_ai_software (bool): Stable Diffusion, MidJourney, DALL-E
          - exif_anomalies (list of str)
          - exif_score (float 0-100): manipulation indicator
          - interpretation (str)
    """
    result = {
        "has_exif":           False,
        "camera_make":        None,
        "camera_model":       None,
        "software":           None,
        "datetime_original":  None,
        "gps_available":      False,
        "gps_lat":            None,
        "gps_lon":            None,
        "is_editing_software": False,
        "is_ai_software":     False,
        "exif_anomalies":     [],
        "exif_score":         0.0,
        "interpretation":     "No EXIF data found or not a JPEG image."
    }

    if not is_jpeg or not EXIFREAD_AVAILABLE:
        result["interpretation"] = (
            "EXIF analysis skipped — not a JPEG or exifread library unavailable. "
            "PNG/WebP images typically do not embed EXIF."
        )
        return result

    try:
        buf = io.BytesIO(image_bytes)
        tags = exifread.process_file(buf, stop_tag="UNDEF", details=False)
    except Exception as e:
        result["interpretation"] = f"EXIF extraction error: {str(e)}"
        return result

    if not tags:
        result["interpretation"] = (
            "No EXIF data present — common for screenshots, web images, and AI-generated images. "
            "Not conclusive evidence of manipulation on its own."
        )
        return result

    result["has_exif"] = True
    anomalies = []

    # Camera Make/Model
    make  = _get_tag(tags, ["Image Make", "EXIF Make"])
    model = _get_tag(tags, ["Image Model", "EXIF Model"])
    result["camera_make"]  = make
    result["camera_model"] = model

    # Software
    software = _get_tag(tags, ["Image Software"])
    result["software"] = software

    # Editing software detection
    editing_software_keywords = [
        "photoshop", "gimp", "adobe", "lightroom", "affinity",
        "pixelmator", "capture one", "darktable", "rawtherapee",
        "paint.net", "paint shop", "corel",
    ]
    ai_software_keywords = [
        "stable diffusion", "stablediffusion", "midjourney", "dall-e", "dalle",
        "comfyui", "automatic1111", "invokeai", "novelai", "dreamstudio",
        "runway", "firefly", "imagen", "wuerstchen"
    ]

    if software:
        sw_lower = software.lower()
        result["is_editing_software"] = any(k in sw_lower for k in editing_software_keywords)
        result["is_ai_software"]      = any(k in sw_lower for k in ai_software_keywords)

        if result["is_ai_software"]:
            anomalies.append(f"AI generative software in EXIF: '{software}'")
        elif result["is_editing_software"]:
            anomalies.append(f"Image editing software in EXIF: '{software}'")

    # DateTime
    dt_orig = _get_tag(tags, ["EXIF DateTimeOriginal", "EXIF DateTimeDigitized", "Image DateTime"])
    result["datetime_original"] = dt_orig

    # GPS
    gps_lat_tag  = _get_tag(tags, ["GPS GPSLatitude"])
    gps_lon_tag  = _get_tag(tags, ["GPS GPSLongitude"])
    gps_lat_ref  = _get_tag(tags, ["GPS GPSLatitudeRef"])
    gps_lon_ref  = _get_tag(tags, ["GPS GPSLongitudeRef"])

    if gps_lat_tag and gps_lon_tag:
        result["gps_available"] = True
        try:
            result["gps_lat"] = _parse_gps(gps_lat_tag, gps_lat_ref)
            result["gps_lon"] = _parse_gps(gps_lon_tag, gps_lon_ref)
        except Exception:
            pass

    # Anomaly checks
    if make and model:
        # Check for suspicious make/model combos
        known_ai = ["stable", "diffusion", "generative", "synthetic", "dall", "midjourney"]
        combined = (make + " " + model).lower()
        if any(k in combined for k in known_ai):
            anomalies.append(f"Suspicious Make/Model in EXIF: '{make} / {model}'")

    # Missing timestamp in what looks like a camera photo
    if make and model and not dt_orig:
        anomalies.append("Camera make/model present but timestamp missing — possible metadata injection")

    # Score computation
    exif_score = 0.0
    if result["is_ai_software"]:
        exif_score = 95.0
    elif result["is_editing_software"]:
        exif_score = 55.0
    elif anomalies:
        exif_score = min(100, len(anomalies) * 25.0)

    result["exif_anomalies"] = anomalies
    result["exif_score"]     = float(exif_score)

    # Interpretation
    if result["is_ai_software"]:
        result["interpretation"] = (
            f"EXIF Software field confirms AI generation: '{software}'. "
            "Strong evidence this is an AI-generated image."
        )
    elif result["is_editing_software"]:
        result["interpretation"] = (
            f"Image editing software found in EXIF: '{software}'. "
            "Image has been processed by editing software."
        )
    elif result["gps_available"] and make and model and dt_orig:
        result["interpretation"] = (
            f"Authentic EXIF signature — Camera: {make} {model}, "
            f"GPS available, timestamp: {dt_orig}."
        )
    elif make and model:
        result["interpretation"] = f"Camera EXIF present: {make} {model}. {f'Timestamp: {dt_orig}.' if dt_orig else 'Timestamp missing.'}"
    else:
        result["interpretation"] = "EXIF present but no camera make/model detected. Possible web image or screenshot."

    return result


def _get_tag(tags: dict, keys: list) -> Optional[str]:
    for k in keys:
        if k in tags:
            return str(tags[k]).strip()
    return None


def _parse_gps(gps_str: str, ref: Optional[str]) -> Optional[float]:
    """Parse GPS coordinate string from exifread format to decimal degrees."""
    try:
        parts = gps_str.strip("[]").split(",")
        if len(parts) >= 2:
            # Format: [degrees, minutes, seconds]
            def to_float(s):
                s = s.strip()
                if "/" in s:
                    num, den = s.split("/")
                    return float(num) / float(den)
                return float(s)
            degs  = to_float(parts[0])
            mins  = to_float(parts[1]) if len(parts) > 1 else 0
            secs  = to_float(parts[2]) if len(parts) > 2 else 0
            value = degs + mins / 60 + secs / 3600
            if ref and ref.upper() in ("S", "W"):
                value = -value
            return round(value, 6)
    except Exception:
        pass
    return None
