import { BaseMobilePage } from './BaseMobilePage.js';

export class UploadAnalysisMobilePage extends BaseMobilePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
  }

  async openHomeScreen() {
    await this.navigateToScreen('/home');
  }

  async openUploadScreen() {
    await this.navigateToScreen('/upload');
  }

  async openUploadingScreen() {
    await this.navigateToScreen('/uploading');
  }

  async openUploadErrorScreen() {
    await this.navigateToScreen('/upload-error');
  }

  async openProcessingScreen() {
    await this.navigateToScreen('/processing');
  }

  async openResultScreen() {
    await this.navigateToScreen('/result');
  }

  async openResultAuthenticScreen() {
    await this.navigateToScreen('/result-authentic');
  }

  async openResultFakeScreen() {
    await this.navigateToScreen('/result-fake');
  }

  async openResultUncertainScreen() {
    await this.navigateToScreen('/result-uncertain');
  }

  async openDetailedAnalysisScreen() {
    await this.navigateToScreen('/analysis');
  }

  async openMetadataScreen() {
    await this.navigateToScreen('/metadata');
  }

  async openConfidenceScreen() {
    await this.navigateToScreen('/confidence');
  }

  async openComparisonScreen() {
    await this.navigateToScreen('/comparison');
  }

  async openShareScreen() {
    await this.navigateToScreen('/share');
  }

  async openFeedbackScreen() {
    await this.navigateToScreen('/feedback');
  }
}
