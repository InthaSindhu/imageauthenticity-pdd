import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class UploadPage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
  }

  async openUploadScreen() {
    await this.navigateTo('/upload');
  }

  async openUploadingScreen() {
    await this.navigateTo('/uploading');
  }

  async openUploadErrorScreen() {
    await this.navigateTo('/upload-error');
  }

  async openUploadDragOverScreen() {
    await this.navigateTo('/upload-drag');
  }

  async openProcessingScreen() {
    await this.navigateTo('/processing');
  }

  async openResultScreen() {
    await this.navigateTo('/result');
  }

  async openResultAuthenticScreen() {
    await this.navigateTo('/result-authentic');
  }

  async openResultFakeScreen() {
    await this.navigateTo('/result-fake');
  }

  async openResultUncertainScreen() {
    await this.navigateTo('/result-uncertain');
  }

  async openDetailedAnalysisScreen() {
    await this.navigateTo('/analysis');
  }

  async openImageMetadataScreen() {
    await this.navigateTo('/metadata');
  }

  async openAIConfidenceScreen() {
    await this.navigateTo('/confidence');
  }

  async openImageComparisonScreen() {
    await this.navigateTo('/comparison');
  }

  async openShareScreen() {
    await this.navigateTo('/share');
  }

  async openFeedbackScreen() {
    await this.navigateTo('/feedback');
  }
}
