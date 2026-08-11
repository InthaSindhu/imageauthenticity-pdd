import os
from datetime import datetime
from automation.config.appium_config import AppiumConfig

class ScreenshotUtil:
    @staticmethod
    def capture_screenshot(driver, test_id):
        os.makedirs(AppiumConfig.SCREENSHOTS_DIR, exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{test_id}_{timestamp}.png"
        filepath = os.path.join(AppiumConfig.SCREENSHOTS_DIR, filename)
        
        try:
            if driver and hasattr(driver, 'save_screenshot'):
                driver.save_screenshot(filepath)
                return filepath
        except Exception as e:
            print(f"Failed to capture screenshot: {e}")
            
        return filepath
