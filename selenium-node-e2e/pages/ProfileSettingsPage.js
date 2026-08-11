import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class ProfileSettingsPage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
  }

  async openProfileScreen() {
    await this.navigateTo('/profile');
  }

  async openEditProfileScreen() {
    await this.navigateTo('/edit-profile');
  }

  async openChangePasswordScreen() {
    await this.navigateTo('/change-password');
  }

  async openSettingsScreen() {
    await this.navigateTo('/settings');
  }

  async openDarkModeScreen() {
    await this.navigateTo('/dark-mode');
  }

  async openHelpFAQScreen() {
    await this.navigateTo('/help-faq');
  }

  async openAppUpdateScreen() {
    await this.navigateTo('/app-update');
  }

  async openPermissionsScreen() {
    await this.navigateTo('/permissions');
  }
}
