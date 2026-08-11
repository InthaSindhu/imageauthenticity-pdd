import { BaseMobilePage } from './BaseMobilePage.js';

export class OnboardingPermissionsMobilePage extends BaseMobilePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
  }

  async openSplashScreen() {
    await this.navigateToScreen('/');
  }

  async openTutorialScreen() {
    await this.navigateToScreen('/tutorial');
  }

  async openOnboardingPermissionsScreen() {
    await this.navigateToScreen('/onboarding-permissions');
  }

  async openCameraPermissionScreen() {
    await this.navigateToScreen('/camera-permission');
  }

  async openStoragePermissionScreen() {
    await this.navigateToScreen('/storage-permission');
  }

  async openCameraPermissionDeniedScreen() {
    await this.navigateToScreen('/camera-permission-denied');
  }

  async openStoragePermissionDeniedScreen() {
    await this.navigateToScreen('/storage-permission-denied');
  }

  async openPermissionsOverviewScreen() {
    await this.navigateToScreen('/permissions');
  }
}
