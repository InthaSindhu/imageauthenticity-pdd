import { BaseMobilePage } from './BaseMobilePage.js';

export class ProfileSettingsMobilePage extends BaseMobilePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
  }

  async openProfileScreen() {
    await this.navigateToScreen('/profile');
  }

  async openEditProfileScreen() {
    await this.navigateToScreen('/edit-profile');
  }

  async openChangePasswordScreen() {
    await this.navigateToScreen('/change-password');
  }

  async openSettingsScreen() {
    await this.navigateToScreen('/settings');
  }

  async openDarkModeScreen() {
    await this.navigateToScreen('/dark-mode');
  }

  async openHelpFAQScreen() {
    await this.navigateToScreen('/help-faq');
  }

  async openAppUpdateScreen() {
    await this.navigateToScreen('/app-update');
  }
}
