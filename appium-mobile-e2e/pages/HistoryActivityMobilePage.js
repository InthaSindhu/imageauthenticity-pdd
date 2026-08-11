import { BaseMobilePage } from './BaseMobilePage.js';

export class HistoryActivityMobilePage extends BaseMobilePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
  }

  async openHistoryScreen() {
    await this.navigateToScreen('/history');
  }

  async openHistoryEmptyScreen() {
    await this.navigateToScreen('/history-empty');
  }

  async openHistoryLoadingScreen() {
    await this.navigateToScreen('/history-loading');
  }

  async openRecentActivityScreen() {
    await this.navigateToScreen('/activity');
  }

  async openSearchFilterScreen() {
    await this.navigateToScreen('/search');
  }
}
