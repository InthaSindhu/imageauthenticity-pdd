"""
Driver Manager — Appium AndroidDriver lifecycle management.
Handles session creation, retry logic, desired capabilities, and teardown.
"""

import json
import os
import time
import logging
from appium import webdriver
from appium.options import UiAutomator2Options

CONFIG_PATH = os.path.join(os.path.dirname(__file__), '..', 'config', 'appium.config.json')

logger = logging.getLogger(__name__)


def _load_config() -> dict:
    with open(CONFIG_PATH, 'r') as f:
        return json.load(f)


def create_driver(apk_path: str = None, max_retries: int = 3) -> webdriver.Remote:
    """
    Create an Appium RemoteDriver with retry logic.
    Returns the driver instance on success, raises RuntimeError after max_retries.
    """
    config = _load_config()
    host = config['appium']['host']
    port = config['appium']['port']
    appium_url = f"http://{host}:{port}"

    caps_json = config['capabilities']
    options = UiAutomator2Options()
    options.platform_name          = caps_json['platformName']
    options.automation_name        = caps_json['automationName']
    options.device_name            = os.environ.get('DEVICE_NAME', caps_json['deviceName'])
    options.platform_version       = os.environ.get('ANDROID_API_LEVEL', caps_json['platformVersion'])
    options.app_package            = caps_json['appPackage']
    options.app_activity           = caps_json['appActivity']
    options.no_reset               = caps_json['noReset']
    options.full_reset             = caps_json['fullReset']
    options.auto_grant_permissions = caps_json['autoGrantPermissions']
    options.new_command_timeout    = caps_json['newCommandTimeout']

    if apk_path and os.path.exists(apk_path):
        options.app = os.path.abspath(apk_path)

    for attempt in range(1, max_retries + 1):
        try:
            logger.info(f"[Driver] Creating session (attempt {attempt}/{max_retries})")
            driver = webdriver.Remote(appium_url, options=options)
            driver.implicitly_wait(config['timeouts']['implicit'])
            logger.info(f"[Driver] ✅ Session created: {driver.session_id}")
            return driver
        except Exception as e:
            logger.warning(f"[Driver] Attempt {attempt} failed: {e}")
            if attempt < max_retries:
                time.sleep(5)

    raise RuntimeError(f"[Driver] ❌ Could not create Appium session after {max_retries} attempts")


def quit_driver(driver) -> None:
    """Safely quit the Appium driver session."""
    if driver:
        try:
            driver.quit()
            logger.info("[Driver] Session closed.")
        except Exception as e:
            logger.warning(f"[Driver] Error closing session: {e}")
