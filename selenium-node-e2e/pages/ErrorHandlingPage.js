import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class ErrorHandlingPage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
  }

  async openNoInternetScreen() {
    await this.navigateTo('/error-no-internet');
  }

  async openNetworkErrorScreen() {
    await this.navigateTo('/error-network');
  }

  async openServerErrorScreen() {
    await this.navigateTo('/error-server');
  }

  async openTimeoutErrorScreen() {
    await this.navigateTo('/error-timeout');
  }

  async openGeneralErrorScreen() {
    await this.navigateTo('/error-general');
  }

  async openServiceUnavailableScreen() {
    await this.navigateTo('/error-service-unavailable');
  }

  async openScanCompletedNotification() {
    await this.navigateTo('/notification-scan-completed');
  }

  async openScanWarningNotification() {
    await this.navigateTo('/notification-scan-warning');
  }

  async openNotificationCenterScreen() {
    await this.navigateTo('/notifications');
  }

  async openErrorAlertDialog() {
    await this.navigateTo('/alert-error');
  }

  async openDeleteConfirmationDialog() {
    await this.navigateTo('/alert-delete-confirmation');
  }

  async openLogoutConfirmationDialog() {
    await this.navigateTo('/alert-logout-confirmation');
  }

  async openClearHistoryConfirmationDialog() {
    await this.navigateTo('/alert-clear-history');
  }
}
