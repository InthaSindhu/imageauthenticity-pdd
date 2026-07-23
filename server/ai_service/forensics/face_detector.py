"""
Face Detector — Forensic Pre-processor
======================================
Detects human faces in images using OpenCV Haar Cascade classifier.
When a face is present, extracts the face patch with a 20% bounding box margin
so face-swap / deepfake / AI inpainting artifacts can be evaluated specifically.
"""

import numpy as np
import cv2
from PIL import Image


def detect_and_crop_face(image_pil: Image.Image) -> dict:
    """
    Detect frontal human faces in PIL image.

    Returns:
        dict containing:
          - has_face (bool)
          - face_count (int)
          - face_crop_pil (PIL.Image or None): cropped face patch with 20% margin
          - face_bbox (tuple or None): (x, y, w, h) of original face box
          - margin_bbox (tuple or None): (x1, y1, x2, y2) of 20% expanded crop box
    """
    img_rgb = image_pil.convert("RGB")
    img_arr = np.array(img_rgb, dtype=np.uint8)
    h, w, _ = img_arr.shape

    img_gray = cv2.cvtColor(img_arr, cv2.COLOR_RGB2GRAY)

    # Load OpenCV default frontal face Haar cascade classifier
    faces = []
    try:
        if hasattr(cv2, 'CascadeClassifier'):
            data_path = getattr(getattr(cv2, 'data', None), 'haarcascades', '')
            cascade_path = data_path + "haarcascade_frontalface_default.xml" if data_path else ""
            face_cascade = cv2.CascadeClassifier(cascade_path)
            if not face_cascade.empty():
                faces = face_cascade.detectMultiScale(
                    img_gray,
                    scaleFactor=1.1,
                    minNeighbors=4,
                    minSize=(40, 40)
                )
    except Exception:
        faces = []

    if len(faces) == 0:

        return {
            "has_face": False,
            "face_count": 0,
            "face_crop_pil": None,
            "face_bbox": None,
            "margin_bbox": None
        }

    # Select largest face by area
    largest_face = max(faces, key=lambda f: f[2] * f[3])
    fx, fy, fw, fh = largest_face

    # Apply 20% margin expand
    margin_x = int(fw * 0.20)
    margin_y = int(fh * 0.20)

    x1 = max(0, fx - margin_x)
    y1 = max(0, fy - margin_y)
    x2 = min(w, fx + fw + margin_x)
    y2 = min(h, fy + fh + margin_y)

    crop_arr = img_arr[y1:y2, x1:x2]
    crop_pil = Image.fromarray(crop_arr)

    return {
        "has_face": True,
        "face_count": len(faces),
        "face_crop_pil": crop_pil,
        "face_bbox": (int(fx), int(fy), int(fw), int(fh)),
        "margin_bbox": (int(x1), int(y1), int(x2), int(y2))
    }
