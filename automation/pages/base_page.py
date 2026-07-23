"""
Base Page — Page Object Model base class with explicit waits,
locator helpers, and common UI interaction methods.
"""

import logging
import time
from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

logger = logging.getLogger(__name__)
EXPLICIT_WAIT = 30


class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, EXPLICIT_WAIT)

    # ── Locator helpers ─────────────────────────────────────────────────────
    def _by_id(self, resource_id: str):
        return (AppiumBy.ID, resource_id)

    def _by_text(self, text: str):
        return (AppiumBy.ANDROID_UIAUTOMATOR,
                f'new UiSelector().text("{text}")')

    def _by_desc(self, desc: str):
        return (AppiumBy.ACCESSIBILITY_ID, desc)

    def _by_xpath(self, xpath: str):
        return (AppiumBy.XPATH, xpath)

    def _by_class(self, class_name: str):
        return (AppiumBy.CLASS_NAME, class_name)

    # ── Wait methods ─────────────────────────────────────────────────────────
    def wait_for_element(self, locator, timeout: int = EXPLICIT_WAIT):
        return WebDriverWait(self.driver, timeout).until(
            EC.presence_of_element_located(locator)
        )

    def wait_for_visible(self, locator, timeout: int = EXPLICIT_WAIT):
        return WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located(locator)
        )

    def wait_for_clickable(self, locator, timeout: int = EXPLICIT_WAIT):
        return WebDriverWait(self.driver, timeout).until(
            EC.element_to_be_clickable(locator)
        )

    def wait_for_text(self, text: str, timeout: int = EXPLICIT_WAIT) -> bool:
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located(self._by_text(text))
            )
            return True
        except TimeoutException:
            return False

    # ── Interaction methods ──────────────────────────────────────────────────
    def click(self, locator):
        el = self.wait_for_clickable(locator)
        el.click()
        logger.debug(f"Clicked: {locator}")

    def tap_by_text(self, text: str):
        self.click(self._by_text(text))

    def tap_by_desc(self, desc: str):
        self.click(self._by_desc(desc))

    def enter_text(self, locator, text: str, clear_first: bool = True):
        el = self.wait_for_visible(locator)
        if clear_first:
            el.clear()
        el.send_keys(text)
        logger.debug(f"Entered text '{text}' in {locator}")

    def get_text(self, locator) -> str:
        el = self.wait_for_visible(locator)
        return el.text

    def is_displayed(self, locator, timeout: int = 5) -> bool:
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.visibility_of_element_located(locator)
            )
            return True
        except (TimeoutException, NoSuchElementException):
            return False

    def is_text_present(self, text: str, timeout: int = 5) -> bool:
        return self.wait_for_text(text, timeout)

    # ── Navigation helpers ───────────────────────────────────────────────────
    def press_back(self):
        self.driver.press_keycode(4)

    def press_home(self):
        self.driver.press_keycode(3)

    def scroll_down(self):
        self.driver.execute_script(
            "mobile: scroll", {"direction": "down"}
        )

    def scroll_up(self):
        self.driver.execute_script(
            "mobile: scroll", {"direction": "up"}
        )

    def swipe_left(self):
        size = self.driver.get_window_size()
        self.driver.swipe(
            int(size['width'] * 0.8), int(size['height'] * 0.5),
            int(size['width'] * 0.2), int(size['height'] * 0.5),
            duration=500
        )

    def swipe_right(self):
        size = self.driver.get_window_size()
        self.driver.swipe(
            int(size['width'] * 0.2), int(size['height'] * 0.5),
            int(size['width'] * 0.8), int(size['height'] * 0.5),
            duration=500
        )

    # ── Screenshot ───────────────────────────────────────────────────────────
    def take_screenshot(self, name: str, output_dir: str = 'automation/screenshots') -> str:
        import os
        os.makedirs(output_dir, exist_ok=True)
        ts = int(time.time())
        path = os.path.join(output_dir, f"{name}_{ts}.png")
        self.driver.save_screenshot(path)
        logger.info(f"Screenshot saved: {path}")
        return path

    # ── Assertions ───────────────────────────────────────────────────────────
    def assert_text_visible(self, text: str, msg: str = ''):
        assert self.is_text_present(text, 10), \
            f"Expected text '{text}' not visible. {msg}"

    def assert_element_visible(self, locator, msg: str = ''):
        assert self.is_displayed(locator, 10), \
            f"Expected element {locator} not visible. {msg}"
