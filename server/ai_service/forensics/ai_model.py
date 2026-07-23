"""
Custom EfficientNet-B3 Image Authenticity Classifier
=====================================================
Loads the locally trained best_image_authenticity_model.pth
(trained on CDFFAKE V2 Dataset, 96.54% test accuracy).

Classes:
    0 = Deepfake
    1 = Real
    2 = Tempered

Returns three-class prediction with calibrated confidence.
No Hugging Face or external model dependencies.
"""

import os
import logging
import numpy as np
from PIL import Image

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)

# ── Resolve model path relative to this file ──────────────────────────────────
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_MODEL_PATH = os.path.normpath(os.path.join(_THIS_DIR, "..", "best_image_authenticity_model.pth"))

# ── Class index to label mapping ──────────────────────────────────────────────
CLASS_NAMES = {0: "Deepfake", 1: "Real", 2: "Tempered"}

# ── EfficientNet-B3 preprocessing constants (ImageNet mean/std, 300x300) ─────
_IMG_SIZE = 300
_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
_STD  = np.array([0.229, 0.224, 0.225], dtype=np.float32)

try:
    import torch
    import torch.nn as nn
    from torchvision import models as tv_models
    TORCH_AVAILABLE = True
    logger.info("[AI Model] PyTorch + torchvision loaded successfully")
except ImportError as e:
    TORCH_AVAILABLE = False
    logger.error(f"[AI Model] PyTorch not installed: {e}")
    logger.error("[AI Model] Run: pip install torch torchvision")


def _preprocess(pil_image: Image.Image) -> "torch.Tensor":
    """
    EfficientNet-B3 preprocessing:
    Resize to 300x300, normalize with ImageNet mean/std, return (1, 3, 300, 300) tensor.
    """
    img = pil_image.convert("RGB").resize((_IMG_SIZE, _IMG_SIZE), Image.BILINEAR)
    arr = np.array(img, dtype=np.float32) / 255.0   # scale to [0, 1]
    arr = (arr - _MEAN) / _STD                       # ImageNet normalization
    arr = arr.transpose(2, 0, 1)                     # HWC -> CHW
    tensor = torch.from_numpy(arr).unsqueeze(0)      # add batch dim -> (1, 3, 300, 300)
    return tensor


class EfficientNetB3Classifier:
    """
    Wraps the custom-trained EfficientNet-B3 model for three-class inference.
    """

    def __init__(self):
        self.model = None
        self.device = None
        self.model_loaded = False
        self._load_model()

    def _load_model(self):
        if not TORCH_AVAILABLE:
            logger.error("[AI Model] Cannot load model - PyTorch is not installed.")
            return

        if not os.path.isfile(_MODEL_PATH):
            msg = (
                f"EfficientNet-B3 model file not found: {_MODEL_PATH}\n"
                "Place best_image_authenticity_model.pth in server/ai_service/"
            )
            logger.error(f"[AI Model] {msg}")
            raise FileNotFoundError(msg)

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"[AI Model] Using device: {self.device}")

        try:
            with torch.no_grad():
                # Build EfficientNet-B3 with 3-class head
                self.model = tv_models.efficientnet_b3(weights=None)
                in_features = self.model.classifier[1].in_features
                self.model.classifier[1] = nn.Linear(in_features, 3)

                # Load trained weights
                state = torch.load(_MODEL_PATH, map_location=self.device)

                # Handle common checkpoint wrapper formats
                if isinstance(state, dict):
                    if "model_state_dict" in state:
                        state = state["model_state_dict"]
                    elif "state_dict" in state:
                        state = state["state_dict"]

                self.model.load_state_dict(state, strict=True)
                self.model.to(self.device)
                self.model.eval()
                self.model_loaded = True
                logger.info(f"[AI Model] EfficientNet-B3 loaded from '{_MODEL_PATH}' [OK]")

        except Exception as e:
            logger.warning(f"[AI Model] EfficientNet-B3 loading fallback: {e}")
            self.model_loaded = False


    def predict(self, image_pil: Image.Image, face_crop_pil: Image.Image = None) -> dict:
        """
        Run three-class EfficientNet-B3 inference.
        Uses face crop when available (better for face-based deepfakes).

        Returns dict with fields:
            verdict, confidence, class_id, probabilities,
            ai_score, fake_probability, real_probability, is_real,
            feature_anomalies (all backwards-compatible with analyzer.py)
        """
        if not self.model_loaded or self.model is None:
            raise RuntimeError(
                "EfficientNet-B3 model is not loaded. "
                "Ensure best_image_authenticity_model.pth exists in server/ai_service/"
            )

        with torch.no_grad():
            tensor_full = _preprocess(image_pil).to(self.device)
            logits_full = self.model(tensor_full)
            probs_full  = torch.softmax(logits_full, dim=1).squeeze(0).cpu().numpy().astype(float)

            if face_crop_pil is not None:
                tensor_face = _preprocess(face_crop_pil).to(self.device)
                logits_face = self.model(tensor_face)
                probs_face  = torch.softmax(logits_face, dim=1).squeeze(0).cpu().numpy().astype(float)
                # Dual-pass ensemble: 50% global image context + 50% face crop patch
                probs_np = 0.5 * probs_full + 0.5 * probs_face
            else:
                probs_np = probs_full

        deepfake_prob = float(probs_np[0])
        real_prob     = float(probs_np[1])
        tempered_prob = float(probs_np[2])


        class_id   = int(np.argmax(probs_np))
        verdict    = CLASS_NAMES[class_id]
        confidence = round(float(probs_np[class_id]) * 100, 2)

        # Fake-likelihood score (0 = genuine, 100 = deepfake or tempered)
        # Used by analyzer.py as a diagnostic indicator only — does NOT affect verdict
        ai_score = round((deepfake_prob + tempered_prob) * 100, 2)

        feature_anomalies = []
        if verdict == "Deepfake":
            feature_anomalies.append(
                f"EfficientNet-B3: Deepfake face detected ({deepfake_prob * 100:.1f}% probability)"
            )
        elif verdict == "Tempered":
            feature_anomalies.append(
                f"EfficientNet-B3: Image tampering detected ({tempered_prob * 100:.1f}% probability)"
            )
        else:
            feature_anomalies.append(
                f"EfficientNet-B3: Authentic image classified ({real_prob * 100:.1f}% real probability)"
            )

        result = {
            # Primary three-class output fields
            "verdict":       verdict,
            "confidence":    confidence,
            "class_id":      class_id,
            "probabilities": {
                "Deepfake": round(deepfake_prob, 4),
                "Real":     round(real_prob, 4),
                "Tempered": round(tempered_prob, 4),
            },
            # Backwards-compatible fields used by analyzer.py 9-stage pipeline
            "ai_score":                  ai_score,
            "fake_probability":          round(deepfake_prob + tempered_prob, 4),
            "real_probability":          round(real_prob, 4),
            "is_real":                   verdict == "Real",
            "is_ai_edited":              verdict in ["Deepfake", "Tempered"],
            "feature_anomalies":         feature_anomalies,
            "spectral_anomaly_score":    0.0,
            "neural_residual_score":     0.0,
            "channel_correlation_score": 0.0,
            "face_anomaly_score":        0.0,
            "heatmap_base64":            "",
        }

        logger.info(
            f"[AI Model] Prediction: verdict={verdict}, class_id={class_id}, "
            f"confidence={confidence}%, probs=deepfake:{deepfake_prob:.4f} "
            f"real:{real_prob:.4f} tempered:{tempered_prob:.4f}"
        )
        return result


# ── Module-level singleton ────────────────────────────────────────────────────
_model_instance: EfficientNetB3Classifier = None


def get_ai_model() -> EfficientNetB3Classifier:
    global _model_instance
    if _model_instance is None:
        _model_instance = EfficientNetB3Classifier()
    return _model_instance


# Alias for backward compatibility
DeepForensicModel = EfficientNetB3Classifier

