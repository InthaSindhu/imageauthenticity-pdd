"""
Selenium Driver Manager — Headless Chrome Remote/Local Driver Factory
Targeting LIVE GitHub Pages Deployment (Configurable via BASE_URL).
"""

import os
import json
import logging
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

logger = logging.getLogger(__name__)

BASE_URL = os.environ.get(
    'BASE_URL',
    'https://InthaSindhu.github.io/imageauthenticity-pdd/'
).rstrip('/') + '/'


def get_chrome_driver():
    """Create and configure headless Chrome driver for live web E2E testing."""
    chrome_options = Options()
    chrome_options.add_argument('--headless=new')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--allow-insecure-localhost')
    chrome_options.add_argument('--ignore-certificate-errors')
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0 Safari/537.36')

    try:
        driver = webdriver.Chrome(options=chrome_options)
        driver.set_page_load_timeout(60)
        driver.implicitly_wait(10)
        logger.info(f"[Selenium] Chrome Driver launched. Target BASE_URL: {BASE_URL}")
        return driver
    except Exception as e:
        logger.error(f"[Selenium] Failed to launch Chrome Driver: {e}")
        return None
