import os

class AppiumConfig:
    HOST = os.getenv("APPIUM_HOST", "127.0.0.1")
    PORT = int(os.getenv("APPIUM_PORT", "4723"))
    APPIUM_SERVER_URL = f"http://{HOST}:{PORT}/"
    
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    WORKSPACE_DIR = os.path.dirname(BASE_DIR)
    BASE_URL = os.getenv("BASE_URL", "https://InthaSindhu.github.io/imageauthenticity-pdd/")
    
    APK_PATH = os.getenv("APK_PATH", os.path.join(WORKSPACE_DIR, "ImageAuthenticity-debug.apk"))
    PACKAGE_NAME = "com.imageauth.verifier"
    MAIN_ACTIVITY = "com.imageauth.verifier.MainActivity"
    
    ANDROID_CAPABILITIES = {
        "platformName": "Android",
        "appium:automationName": "UiAutomator2",
        "appium:deviceName": os.getenv("ANDROID_DEVICE_NAME", "Android Emulator"),
        "appium:app": APK_PATH,
        "appium:appPackage": PACKAGE_NAME,
        "appium:appActivity": MAIN_ACTIVITY,
        "appium:noReset": False,
        "appium:fullReset": False,
        "appium:autoGrantPermissions": True,
        "appium:newCommandTimeout": 300,
        "appium:adbExecTimeout": 60000
    }
    
    REPORTS_DIR = os.path.join(WORKSPACE_DIR, "Test Results")
    EXCEL_REPORTS_DIR = os.path.join(REPORTS_DIR, "Excel")
    HTML_REPORTS_DIR = os.path.join(REPORTS_DIR, "HTML")
    JSON_REPORTS_DIR = os.path.join(REPORTS_DIR, "JSON")
    SCREENSHOTS_DIR = os.path.join(REPORTS_DIR, "Screenshots")
    LOGS_DIR = os.path.join(REPORTS_DIR, "Logs")
    SUMMARY_DIR = os.path.join(REPORTS_DIR, "Summary")
