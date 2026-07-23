"""
Upload Page — POM for Image Upload and forensic verification screens.
"""

from appium.webdriver.common.appiumby import AppiumBy
from automation.pages.base_page import BasePage
import logging, base64, os

logger = logging.getLogger(__name__)


class UploadPage(BasePage):

    # ── Locators ─────────────────────────────────────────────────────────────
    UPLOAD_HEADER     = (AppiumBy.XPATH, '//android.widget.TextView[contains(@text,"Upload") or contains(@text,"Image")]')
    GALLERY_BTN       = (AppiumBy.XPATH, '//android.widget.Button[contains(@text,"Gallery") or contains(@text,"Choose")]')
    CAMERA_BTN        = (AppiumBy.XPATH, '//android.widget.Button[contains(@text,"Camera")]')
    VERIFY_BTN        = (AppiumBy.XPATH, '//android.widget.Button[contains(@text,"Verify") or contains(@text,"Analyze")]')
    IMAGE_PREVIEW     = (AppiumBy.XPATH, '//android.widget.ImageView')
    SUCCESS_INDICATOR = (AppiumBy.XPATH, '//android.widget.TextView[contains(@text,"loaded") or contains(@text,"Ready")]')
    ERROR_BANNER      = (AppiumBy.XPATH, '//android.widget.TextView[contains(@text,"Error") or contains(@text,"failed")]')
    LOADING_SPINNER   = (AppiumBy.XPATH, '//android.widget.ProgressBar')
    RESULT_CARD       = (AppiumBy.XPATH, '//android.widget.TextView[contains(@text,"Real") or contains(@text,"Deepfake") or contains(@text,"Tempered")]')

    # ── Actions ───────────────────────────────────────────────────────────────
    def is_on_upload_screen(self) -> bool:
        return self.is_displayed(self.UPLOAD_HEADER, 5)

    def tap_gallery(self):
        self.click(self.GALLERY_BTN)

    def tap_camera(self):
        self.click(self.CAMERA_BTN)

    def tap_verify(self):
        self.click(self.VERIFY_BTN)

    def is_image_loaded(self) -> bool:
        return (self.is_displayed(self.IMAGE_PREVIEW, 5) or
                self.is_displayed(self.SUCCESS_INDICATOR, 5))

    def is_error_shown(self) -> bool:
        return self.is_displayed(self.ERROR_BANNER, 3)

    def wait_for_analysis_result(self, timeout: int = 60) -> bool:
        return self.is_displayed(self.RESULT_CARD, timeout)

    def is_verify_button_enabled(self) -> bool:
        try:
            el = self.wait_for_element(self.VERIFY_BTN, 5)
            return el.is_enabled()
        except Exception:
            return False

    def is_loading(self) -> bool:
        return self.is_displayed(self.LOADING_SPINNER, 3)
