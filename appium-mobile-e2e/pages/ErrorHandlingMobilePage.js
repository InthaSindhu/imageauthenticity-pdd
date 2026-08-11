import { BaseMobilePage } from './BaseMobilePage.js';

export class ErrorHandlingMobilePage extends BaseMobilePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
  }

  async openNoInternetScreen() {
    await this.navigateToScreen('/error-no-internet');
  }

  async openNetworkErrorScreen() {
    await this.navigateToScreen('/error-network');
  }

  async openServerErrorScreen() {
    await this.navigateToScreen('/error-server');
  }

  async openTimeoutErrorScreen() {
    await this.navigateToScreen('/error-timeout');
  }

  async openGeneralErrorScreen() {
    await this.navigateToScreen('/error-general');
  }

  async openServiceUnavailableScreen() {
    await this.navigateToScreen('/error-service-unavailable');
  }

  async openScanCompletedNotification() {
    await this.navigateToScreen('/notification-scan-completed');
  }

  async openScanWarningNotification() {
    await this.navigateToScreen('/notification-scan-warning');
  }

  async openNotificationCenterScreen() {
    await this.navigateToScreen('/notifications');
  }

  async openErrorAlertDialog() {
    await this.navigateToScreen('/alert-error');
  }

  async openDeleteConfirmationDialog() {
    await this.navigateToScreen('/alert-delete-confirmation');
  }

  async openLogoutConfirmationDialog() {
    await this.navigateToScreen('/alert-logout-confirmation');
  }

  async openClearHistoryConfirmationDialog() {
    await this.navigateToScreen('/alert-clear-history');
  }
}
