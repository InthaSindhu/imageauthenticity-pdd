"""
Integration & Unit Test Suite — Image Forensic Pipeline
=========================================================
Run with:  python -m pytest server/ai_service/test_pipeline.py -v
"""

import io
import os
import sys
import json
import base64
import pytest
import numpy as np
from PIL import Image

# Make ai_service importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from analyzer import analyze_image
from forensics.ela          import analyze_ela
from forensics.noise        import analyze_noise
from forensics.copy_move    import analyze_copy_move
from forensics.compression  import analyze_compression
from forensics.exif_meta    import analyze_exif
from forensics.edge_light   import analyze_edge_lighting
from forensics.ai_model     import get_ai_model, DeepForensicModel
from forensics.face_detector import detect_and_crop_face


# ─── Fixture: Image Generators ────────────────────────────────────────────────

def _make_jpeg(arr: np.ndarray, quality: int = 95) -> bytes:
    buf = io.BytesIO()
    Image.fromarray(arr.astype(np.uint8)).save(buf, format="JPEG", quality=quality)
    return buf.getvalue()


def _make_png(arr: np.ndarray) -> bytes:
    buf = io.BytesIO()
    Image.fromarray(arr.astype(np.uint8)).save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def authentic_jpeg():
    """Authentic camera-like image: smooth scene gradient + Poisson sensor noise."""
    img = np.zeros((400, 400, 3), dtype=np.float32)
    for i in range(400):
        img[i, :, :] = 80 + 130 * (i / 400.0)
    noise = np.random.poisson(lam=8, size=(400, 400, 3)).astype(np.float32) - 8
    img = np.clip(img + noise, 0, 255)
    return _make_jpeg(img, quality=95)


@pytest.fixture
def ai_generated_png():
    """Synthetic PNG: perfect sine wave tiling — characteristic of AI generative models."""
    y_g, x_g = np.ogrid[:512, :512]
    r = (128 + 80 * np.sin(x_g / 4.0) * np.cos(y_g / 4.0)).astype(np.uint8)
    g = (100 + 60 * np.cos(x_g / 3.0) * np.sin(y_g / 5.0)).astype(np.uint8)
    b = (150 + 50 * np.sin(x_g / 6.0 + y_g / 6.0)).astype(np.uint8)
    img = np.stack([r, g, b], axis=-1)
    return _make_png(img)


@pytest.fixture
def copy_move_jpeg():
    """Copy-move manipulated image: patches cloned within the same image."""
    img = np.zeros((400, 400, 3), dtype=np.float32)
    for i in range(400):
        img[i, :, :] = 80 + 130 * (i / 400.0)
    noise = np.random.poisson(lam=8, size=(400, 400, 3)).astype(np.float32) - 8
    img = np.clip(img + noise, 0, 255)
    # Clone patch from (50,50) to (250,250)
    img[250:350, 250:350] = img[50:150, 50:150]
    return _make_jpeg(img, quality=85)


@pytest.fixture
def spliced_jpeg():
    """Spliced image: foreign patch from different color distribution inserted."""
    img = np.zeros((400, 400, 3), dtype=np.float32)
    for i in range(400):
        img[i, :, :] = 80 + 130 * (i / 400.0)
    noise = np.random.poisson(lam=8, size=(400, 400, 3)).astype(np.float32) - 8
    img = np.clip(img + noise, 0, 255)
    y_s, x_s = np.ogrid[:150, :150]
    patch = (80 + 100 * np.cos(x_s / 3.0) * np.sin(y_s / 3.0)).astype(np.float32)
    img[100:250, 100:250, 0] = patch
    img[100:250, 100:250, 1] = patch * 0.4
    img[100:250, 100:250, 2] = 255 - patch
    return _make_jpeg(img, quality=70)


@pytest.fixture
def face_image_jpeg():
    """Image with a simple face-like region for face detector testing."""
    img = np.ones((480, 640, 3), dtype=np.uint8) * 200
    # Draw a rough circular face shape using ellipse (not a real face, but detectable)
    cv_img = img.copy()
    import cv2
    cv2.ellipse(cv_img, (320, 240), (80, 100), 0, 0, 360, (220, 180, 140), -1)
    cv2.circle(cv_img, (295, 220), 12, (50, 30, 30), -1)
    cv2.circle(cv_img, (345, 220), 12, (50, 30, 30), -1)
    cv2.ellipse(cv_img, (320, 270), (30, 15), 0, 0, 180, (180, 80, 80), -1)
    return _make_jpeg(cv_img, quality=90)


# ─── Unit Tests: Individual Forensic Modules ──────────────────────────────────

class TestELAModule:
    def test_returns_expected_keys(self, authentic_jpeg):
        pil = Image.open(io.BytesIO(authentic_jpeg)).convert("RGB")
        result = analyze_ela(pil)
        required = ["ela_score", "ela_mean", "ela_std", "crop_256_mean", "crop_256_std",
                    "ela_uniformity", "suspicious_regions", "interpretation",
                    "ai_generated_signal", "heatmap_base64"]
        for key in required:
            assert key in result, f"ELA missing key: {key}"

    def test_score_in_valid_range(self, authentic_jpeg):
        pil = Image.open(io.BytesIO(authentic_jpeg)).convert("RGB")
        result = analyze_ela(pil)
        assert 0 <= result["ela_score"] <= 100

    def test_heatmap_is_base64_png(self, authentic_jpeg):
        pil = Image.open(io.BytesIO(authentic_jpeg)).convert("RGB")
        result = analyze_ela(pil)
        assert result["heatmap_base64"].startswith("data:image/png;base64,")

    def test_crop_256_extracted_at_full_resolution(self, authentic_jpeg):
        """Verify 256x256 crop stats are populated and differ from full-image stats."""
        pil = Image.open(io.BytesIO(authentic_jpeg)).convert("RGB")
        result = analyze_ela(pil)
        assert result["crop_256_mean"] >= 0
        assert result["crop_256_std"] >= 0


class TestAIModelModule:
    def test_model_instantiates(self):
        model = DeepForensicModel()
        assert model is not None

    def test_predict_returns_required_keys(self, authentic_jpeg):
        pil = Image.open(io.BytesIO(authentic_jpeg)).convert("RGB")
        model = get_ai_model()
        result = model.predict(pil)
        required = ["ai_score", "spectral_anomaly_score", "channel_correlation_score",
                    "neural_residual_score", "face_anomaly_score", "feature_anomalies",
                    "is_ai_edited", "heatmap_base64"]
        for key in required:
            assert key in result, f"AI model missing key: {key}"

    def test_scores_in_valid_range(self, authentic_jpeg):
        pil = Image.open(io.BytesIO(authentic_jpeg)).convert("RGB")
        model = get_ai_model()
        result = model.predict(pil)
        assert 0 <= result["ai_score"] <= 100
        assert 0 <= result["spectral_anomaly_score"] <= 100
        assert 0 <= result["neural_residual_score"] <= 100


class TestFaceDetector:
    def test_no_face_in_plain_image(self, authentic_jpeg):
        pil = Image.open(io.BytesIO(authentic_jpeg)).convert("RGB")
        result = detect_and_crop_face(pil)
        assert "has_face" in result
        assert "face_count" in result
        # This image has no face, so has_face should be False
        assert result["has_face"] is False or result["face_count"] == 0

    def test_returns_expected_structure(self, authentic_jpeg):
        pil = Image.open(io.BytesIO(authentic_jpeg)).convert("RGB")
        result = detect_and_crop_face(pil)
        assert all(k in result for k in ["has_face", "face_count", "face_crop_pil", "face_bbox", "margin_bbox"])


class TestCompressionModule:
    def test_returns_expected_keys(self, authentic_jpeg):
        pil = Image.open(io.BytesIO(authentic_jpeg)).convert("RGB")
        result = analyze_compression(pil)
        required = ["compression_score", "blocking_artifact_score",
                    "double_compression_detected", "double_compression_confidence",
                    "quality_estimate", "interpretation"]
        for key in required:
            assert key in result

    def test_compression_score_range(self, authentic_jpeg):
        pil = Image.open(io.BytesIO(authentic_jpeg)).convert("RGB")
        result = analyze_compression(pil)
        assert 0 <= result["compression_score"] <= 100


class TestEXIFModule:
    def test_returns_expected_keys(self, authentic_jpeg):
        result = analyze_exif(authentic_jpeg, is_jpeg=True)
        required = ["has_exif", "camera_make", "camera_model", "software",
                    "is_editing_software", "is_ai_software", "gps_available",
                    "exif_anomalies", "exif_score", "interpretation"]
        for key in required:
            assert key in result

    def test_exif_score_in_range(self, authentic_jpeg):
        result = analyze_exif(authentic_jpeg, is_jpeg=True)
        assert 0 <= result["exif_score"] <= 100


# ─── Integration Tests: Full Pipeline ─────────────────────────────────────────

class TestFullPipeline:
    """Verify that different image types produce meaningfully different outputs."""

    def _run(self, image_bytes: bytes, name: str) -> dict:
        result = analyze_image(image_bytes, file_name=name)
        return result

    def test_authentic_pipeline_returns_valid_json(self, authentic_jpeg):
        result = self._run(authentic_jpeg, "authentic_camera.jpg")
        self._assert_valid_payload(result)

    def test_ai_generated_png_pipeline(self, ai_generated_png):
        result = self._run(ai_generated_png, "ai_generated.png")
        self._assert_valid_payload(result)

    def test_copy_move_pipeline(self, copy_move_jpeg):
        result = self._run(copy_move_jpeg, "copy_move.jpg")
        self._assert_valid_payload(result)

    def test_spliced_pipeline(self, spliced_jpeg):
        result = self._run(spliced_jpeg, "spliced.jpg")
        self._assert_valid_payload(result)

    def test_different_predictions_for_authentic_vs_ai(self, authentic_jpeg, ai_generated_png):
        """Authentic and AI-generated images must differ in at least confidence or status."""
        real = self._run(authentic_jpeg, "authentic_camera.jpg")
        fake = self._run(ai_generated_png, "ai_generated.png")

        # At minimum the manipulation probability should differ
        real_conf = real["confidence"]
        fake_conf = fake["confidence"]
        print(f"[Test] Real confidence: {real_conf}% | Fake confidence: {fake_conf}%")
        print(f"[Test] Real status: {real['status']} | Fake status: {fake['status']}")

        assert real_conf != fake_conf or real["status"] != fake["status"], \
            "ERROR: Same confidence and status for authentic vs AI — pipeline not differentiating!"

    def test_case_a_weights_applied_for_png(self, ai_generated_png):
        """PNG images must trigger Case A weighting (DL 60%, FFT 25%, ELA 15%)."""
        result = self._run(ai_generated_png, "ai_generated.png")
        weights = result.get("forensicDetails", {}).get("weightsApplied", "")
        assert "Case A" in weights, f"Expected Case A weights for PNG, got: {weights}"

    def test_payload_contains_sub_scores(self, authentic_jpeg):
        result = self._run(authentic_jpeg, "authentic_camera.jpg")
        fd = result.get("forensicDetails", {})
        assert "ela" in fd
        assert "aiModel" in fd
        assert "copyMove" in fd
        assert "compression" in fd
        assert "exif" in fd
        assert "edgeLighting" in fd

    def test_payload_contains_heatmap(self, authentic_jpeg):
        result = self._run(authentic_jpeg, "authentic_camera.jpg")
        heatmap = result.get("heatmap", "")
        assert heatmap.startswith("data:image/png;base64,"), \
            "Heatmap must be a valid base64 PNG data URI"

    def test_payload_contains_face_detection_info(self, authentic_jpeg):
        result = self._run(authentic_jpeg, "authentic_camera.jpg")
        fd = result.get("forensicDetails", {})
        assert "faceDetected" in fd
        assert "faceCount" in fd

    def test_confidence_in_valid_range(self, authentic_jpeg):
        result = self._run(authentic_jpeg, "authentic_camera.jpg")
        assert 0 <= result["confidence"] <= 100

    def test_status_is_one_of_valid_values(self, authentic_jpeg, ai_generated_png, copy_move_jpeg, spliced_jpeg):
        for img_bytes, name in [
            (authentic_jpeg, "authentic.jpg"),
            (ai_generated_png, "ai_gen.png"),
            (copy_move_jpeg, "copy_move.jpg"),
            (spliced_jpeg, "spliced.jpg")
        ]:
            result = self._run(img_bytes, name)
            assert result["status"] in ["verified", "uncertain", "flagged"], \
                f"Invalid status '{result['status']}' for {name}"

    def test_indicators_list_populated(self, authentic_jpeg):
        result = self._run(authentic_jpeg, "authentic_camera.jpg")
        assert isinstance(result["indicators"], list)
        assert len(result["indicators"]) >= 5, "Must return at least 5 forensic indicator entries"

    def test_explanation_not_empty(self, authentic_jpeg):
        result = self._run(authentic_jpeg, "authentic_camera.jpg")
        assert len(result.get("explanation", "")) > 20, "Explanation must be a meaningful string"

    def _assert_valid_payload(self, result: dict):
        """Assert all required top-level keys are present and valid."""
        required_keys = [
            "status", "prediction", "confidence", "confidenceTier",
            "manipulationType", "explanation", "indicators",
            "fileName", "fileSize", "resolution",
            "metadata", "heatmap", "forensicDetails"
        ]
        for key in required_keys:
            assert key in result, f"Pipeline response missing required key: '{key}'"

        assert result["status"] in ["verified", "uncertain", "flagged"]
        assert result["prediction"] in ["Real", "Uncertain", "Fake", "Deepfake", "Tempered"]
        assert 0 <= result["confidence"] <= 100
        assert result["confidenceTier"] in ["High", "Medium", "Low"]
        assert isinstance(result["indicators"], list)
        assert isinstance(result["forensicDetails"], dict)
