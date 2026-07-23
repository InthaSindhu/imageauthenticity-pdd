"""
Profile Page — POM for user profile and settings screens.
"""

from appium.webdriver.common.appiumby import AppiumBy
from automation.pages.base_page import BasePage
import logging

logger = logging.getLogger(__name__)


class ProfilePage(BasePage):

    PROFILE_HEADER     = (AppiumBy.XPATH, '//android.widget.TextView[contains(@text,"Profile") or contains(@text,"Settings")]')
    NAME_FIELD         = (AppiumBy.XPATH, '//android.widget.EditText[contains(@hint,"Name")]')
    EMAIL_FIELD        = (AppiumBy.XPATH, '//android.widget.EditText[contains(@hint,"Email")]')
    SAVE_BTN           = (AppiumBy.XPATH, '//android.widget.Button[contains(@text,"Save") or contains(@text,"Update")]')
    LOGOUT_BTN         = (AppiumBy.XPATH, '//android.widget.Button[contains(@text,"Logout") or contains(@text,"Sign Out")]')
    CHANGE_PASS_BTN    = (AppiumBy.XPATH, '//android.widget.Button[contains(@text,"Change Password")]')
    OLD_PASS_INPUT     = (AppiumBy.XPATH, '//android.widget.EditText[contains(@hint,"Current") or contains(@hint,"Old")]')
    NEW_PASS_INPUT     = (AppiumBy.XPATH, '//android.widget.EditText[contains(@hint,"New")]')
    CONFIRM_PASS_INPUT = (AppiumBy.XPATH, '//android.widget.EditText[contains(@hint,"Confirm")]')
    SUCCESS_MSG        = (AppiumBy.XPATH, '//android.widget.TextView[contains(@text,"updated") or contains(@text,"saved") or contains(@text,"success")]')
    ERROR_MSG          = (AppiumBy.XPATH, '//android.widget.TextView[contains(@text,"Error") or contains(@text,"failed")]')
    DELETE_ACCOUNT_BTN = (AppiumBy.XPATH, '//android.widget.Button[contains(@text,"Delete Account")]')

    def is_on_profile_screen(self) -> bool:
        return self.is_displayed(self.PROFILE_HEADER, 5)

    def update_name(self, name: str):
        self.enter_text(self.NAME_FIELD, name)

    def update_email(self, email: str):
        self.enter_text(self.EMAIL_FIELD, email)

    def tap_save(self):
        self.click(self.SAVE_BTN)

    def tap_logout(self):
        self.click(self.LOGOUT_BTN)

    def is_success_shown(self) -> bool:
        return self.is_displayed(self.SUCCESS_MSG, 5)

    def is_error_shown(self) -> bool:
        return self.is_displayed(self.ERROR_MSG, 5)

    def tap_change_password(self):
        self.click(self.CHANGE_PASS_BTN)

    def change_password(self, old_pass: str, new_pass: str, confirm_pass: str):
        self.tap_change_password()
        self.enter_text(self.OLD_PASS_INPUT, old_pass)
        self.enter_text(self.NEW_PASS_INPUT, new_pass)
        self.enter_text(self.CONFIRM_PASS_INPUT, confirm_pass)
        self.tap_save()

    def get_current_name(self) -> str:
        try:
            return self.get_text(self.NAME_FIELD)
        except Exception:
            return ""

    def get_current_email(self) -> str:
        try:
            return self.get_text(self.EMAIL_FIELD)
        except Exception:
            return ""
