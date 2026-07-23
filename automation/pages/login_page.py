"""
Login Page — POM for Authentication screens.
Covers: Login Form, Invalid Credentials, Token management.
"""

from appium.webdriver.common.appiumby import AppiumBy
from automation.pages.base_page import BasePage
import logging

logger = logging.getLogger(__name__)


class LoginPage(BasePage):

    # ── Locators ─────────────────────────────────────────────────────────────
    EMAIL_INPUT     = (AppiumBy.XPATH, '//android.widget.EditText[@text="Email" or @hint="Email"]')
    PASSWORD_INPUT  = (AppiumBy.XPATH, '//android.widget.EditText[@text="Password" or @hint="Password"]')
    LOGIN_BUTTON    = (AppiumBy.XPATH, '//android.widget.Button[contains(@text,"Sign In") or contains(@text,"Login")]')
    SIGNUP_LINK     = (AppiumBy.XPATH, '//android.widget.TextView[contains(@text,"Sign Up") or contains(@text,"Register")]')
    FORGOT_LINK     = (AppiumBy.XPATH, '//android.widget.TextView[contains(@text,"Forgot")]')
    ERROR_MSG       = (AppiumBy.XPATH, '//android.widget.TextView[contains(@text,"Invalid") or contains(@text,"Error") or contains(@text,"incorrect")]')
    WELCOME_TEXT    = (AppiumBy.XPATH, '//android.widget.TextView[contains(@text,"Welcome") or contains(@text,"Sign In")]')
    HOME_INDICATOR  = (AppiumBy.XPATH, '//android.widget.TextView[contains(@text,"Image Authenticity") or contains(@text,"Dashboard") or contains(@text,"Upload")]')

    # ── Actions ───────────────────────────────────────────────────────────────
    def navigate_to_login(self):
        """Ensure app is on the Login screen."""
        if not self.is_displayed(self.WELCOME_TEXT, 3):
            self.press_home()
            self.driver.activate_app('com.imageauth.verifier')
        self.wait_for_visible(self.WELCOME_TEXT)

    def enter_email(self, email: str):
        self.enter_text(self.EMAIL_INPUT, email)

    def enter_password(self, password: str):
        self.enter_text(self.PASSWORD_INPUT, password)

    def tap_login(self):
        self.click(self.LOGIN_BUTTON)

    def login(self, email: str, password: str):
        """Full login flow: enter credentials and submit."""
        self.enter_email(email)
        self.enter_password(password)
        self.tap_login()

    def is_login_successful(self) -> bool:
        return self.is_displayed(self.HOME_INDICATOR, 15)

    def is_error_displayed(self) -> bool:
        return self.is_displayed(self.ERROR_MSG, 5)

    def get_error_message(self) -> str:
        if self.is_error_displayed():
            return self.get_text(self.ERROR_MSG)
        return ""

    def tap_signup_link(self):
        self.click(self.SIGNUP_LINK)

    def tap_forgot_password(self):
        self.click(self.FORGOT_LINK)

    def is_on_login_screen(self) -> bool:
        return self.is_displayed(self.WELCOME_TEXT, 5)
