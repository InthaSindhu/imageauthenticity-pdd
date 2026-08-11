import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class HistoryPage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
  }

  async openHistoryScreen() {
    await this.navigateTo('/history');
  }

  async openHistoryEmptyScreen() {
    await this.navigateTo('/history-empty');
  }

  async openHistoryLoadingScreen() {
    await this.navigateTo('/history-loading');
  }

  async openRecentActivityScreen() {
    await this.navigateTo('/activity');
  }

  async openSearchFilterScreen() {
    await this.navigateTo('/search');
  }
}
