"""
Screenshot Utility — Captures full device & element screenshots on test pass/fail.
"""

import os
import time
import logging

logger = logging.getLogger(__name__)


class ScreenshotUtil:
    def __init__(self, driver, output_dir: str = 'automation/screenshots'):
        self.driver = driver
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def _filename(self, name: str, status: str) -> str:
        ts = int(time.time())
        safe = name.replace(' ', '_').replace('/', '_').replace('\\', '_')
        return os.path.join(self.output_dir, f"{status}_{safe}_{ts}.png")

    def capture(self, test_name: str, status: str = 'INFO') -> str:
        path = self._filename(test_name, status)
        try:
            self.driver.save_screenshot(path)
            logger.info(f"[Screenshot] Saved: {path}")
            return path
        except Exception as e:
            logger.warning(f"[Screenshot] Failed: {e}")
            return ""

    def capture_on_failure(self, test_name: str) -> str:
        return self.capture(test_name, 'FAIL')

    def capture_on_pass(self, test_name: str) -> str:
        return self.capture(test_name, 'PASS')

    def capture_device(self, label: str = 'device') -> str:
        """Pull screenshot via ADB (most reliable for device state)."""
        import subprocess
        ts = int(time.time())
        path = os.path.join(self.output_dir, f"DEVICE_{label}_{ts}.png")
        try:
            subprocess.run(
                ['adb', 'shell', 'screencap', '-p', '/sdcard/sc.png'],
                check=True, capture_output=True, timeout=10
            )
            subprocess.run(
                ['adb', 'pull', '/sdcard/sc.png', path],
                check=True, capture_output=True, timeout=10
            )
            logger.info(f"[ADB Screenshot] Saved: {path}")
            return path
        except Exception as e:
            logger.warning(f"[ADB Screenshot] Fallback to Appium: {e}")
            return self.capture(label, 'DEVICE')
