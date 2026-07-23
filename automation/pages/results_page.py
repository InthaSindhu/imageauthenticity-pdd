"""
Results Page — POM for forensic analysis result display.
"""

from appium.webdriver.common.appiumby import AppiumBy
from automation.pages.base_page import BasePage
import logging

logger = logging.getLogger(__name__)


class ResultsPage(BasePage):

    VERDICT_TEXT      = (AppiumBy.XPATH, '//android.widget.TextView[contains(@text,"Real") or contains(@text,"Deepfake") or contains(@text,"Tempered")]')
    CONFIDENCE_TEXT   = (AppiumBy.XPATH, '//android.widget.TextView[contains(@text,"%") or contains(@text,"Confidence")]')
    HEATMAP_IMAGE     = (AppiumBy.XPATH, '//android.widget.ImageView[contains(@content-desc,"heatmap") or contains(@content-desc,"analysis")]')
    SHARE_BTN         = (AppiumBy.XPATH, '//android.widget.Button[contains(@text,"Share")]')
    SCAN_AGAIN_BTN    = (AppiumBy.XPATH, '//android.widget.Button[contains(@text,"Scan Again") or contains(@text,"New Scan")]')
    STATUS_INDICATOR  = (AppiumBy.XPATH, '//android.widget.TextView[contains(@text,"verified") or contains(@text,"flagged")]')
    EXPLANATION_TEXT  = (AppiumBy.XPATH, '//android.widget.TextView[string-length(@text)>20]')

    def is_result_displayed(self) -> bool:
        return self.is_displayed(self.VERDICT_TEXT, 60)

    def get_verdict(self) -> str:
        try:
            return self.get_text(self.VERDICT_TEXT)
        except Exception:
            return ""

    def get_confidence(self) -> str:
        try:
            return self.get_text(self.CONFIDENCE_TEXT)
        except Exception:
            return ""

    def tap_share(self):
        self.click(self.SHARE_BTN)

    def tap_scan_again(self):
        self.click(self.SCAN_AGAIN_BTN)

    def is_heatmap_visible(self) -> bool:
        return self.is_displayed(self.HEATMAP_IMAGE, 10)

    def is_authentic_result(self) -> bool:
        verdict = self.get_verdict().lower()
        return 'real' in verdict or 'authentic' in verdict

    def is_manipulated_result(self) -> bool:
        verdict = self.get_verdict().lower()
        return 'deepfake' in verdict or 'tempered' in verdict or 'fake' in verdict


class HistoryPage(BasePage):

    HISTORY_HEADER   = (AppiumBy.XPATH, '//android.widget.TextView[contains(@text,"History") or contains(@text,"Scan")]')
    SCAN_LIST_ITEM   = (AppiumBy.XPATH, '//androidx.recyclerview.widget.RecyclerView//android.widget.TextView')
    SEARCH_INPUT     = (AppiumBy.XPATH, '//android.widget.EditText[contains(@hint,"Search")]')
    FILTER_BTN       = (AppiumBy.XPATH, '//android.widget.Button[contains(@text,"Filter") or contains(@content-desc,"filter")]')
    EMPTY_STATE      = (AppiumBy.XPATH, '//android.widget.TextView[contains(@text,"No scans") or contains(@text,"empty")]')
    DELETE_BTN       = (AppiumBy.XPATH, '//android.widget.Button[contains(@text,"Delete")]')
    SORT_BTN         = (AppiumBy.XPATH, '//android.widget.Button[contains(@text,"Sort") or contains(@content-desc,"sort")]')

    def is_on_history_screen(self) -> bool:
        return self.is_displayed(self.HISTORY_HEADER, 5)

    def has_scan_items(self) -> bool:
        return self.is_displayed(self.SCAN_LIST_ITEM, 5)

    def search_history(self, query: str):
        self.enter_text(self.SEARCH_INPUT, query)

    def is_empty_state(self) -> bool:
        return self.is_displayed(self.EMPTY_STATE, 3)

    def tap_first_scan(self):
        el = self.wait_for_element(self.SCAN_LIST_ITEM)
        el.click()

    def tap_filter(self):
        self.click(self.FILTER_BTN)
