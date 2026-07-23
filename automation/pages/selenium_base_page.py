"""
Selenium Base Page POM — Handles explicit waits, interaction methods,
screenshot captures, and browser console log retrieval against live BASE_URL.
"""

import os
import time
import logging
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

logger = logging.getLogger(__name__)

BASE_URL = os.environ.get(
    'BASE_URL',
    'https://InthaSindhu.github.io/imageauthenticity-pdd/'
).rstrip('/') + '/'


class SeleniumBasePage:
    def __init__(self, driver):
        self.driver = driver
        self.base_url = BASE_URL
        self.wait = WebDriverWait(driver, 20)

    def open(self, path: str = ''):
        target_url = f"{self.base_url}{path.lstrip('/')}"
        logger.info(f"[POM] Navigating to: {target_url}")
        self.driver.get(target_url)

    def find(self, locator, timeout: int = 20):
        return WebDriverWait(self.driver, timeout).until(
            EC.presence_of_element_located(locator)
        )

    def find_visible(self, locator, timeout: int = 20):
        return WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located(locator)
        )

    def click(self, locator):
        el = WebDriverWait(self.driver, 20).until(
            EC.element_to_be_clickable(locator)
        )
        el.click()

    def type_text(self, locator, text: str):
        el = self.find_visible(locator)
        el.clear()
        el.send_keys(text)

    def get_text(self, locator) -> str:
        return self.find_visible(locator).text

    def is_visible(self, locator, timeout: int = 5) -> bool:
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.visibility_of_element_located(locator)
            )
            return True
        except (TimeoutException, NoSuchElementException):
            return False

    def capture_screenshot(self, name: str, output_dir: str = 'Test Results/Screenshots') -> str:
        os.makedirs(output_dir, exist_ok=True)
        filename = f"{name}_{int(time.time())}.png"
        path = os.path.join(output_dir, filename)
        try:
            self.driver.save_screenshot(path)
            logger.info(f"[Screenshot] Captured: {path}")
            return path
        except Exception as e:
            logger.error(f"[Screenshot] Capture failed: {e}")
            return ""

    def get_browser_logs(self) -> list:
        try:
            return self.driver.get_log('browser')
        except Exception:
            return []
