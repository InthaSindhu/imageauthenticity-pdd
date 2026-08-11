import { BaseMobilePage } from './BaseMobilePage.js';

export class AuthMobilePage extends BaseMobilePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
  }

  async openLoginScreen() {
    await this.navigateToScreen('/login');
  }

  async openSignupScreen() {
    await this.navigateToScreen('/signup');
  }

  async openLoginErrorScreen() {
    await this.navigateToScreen('/login-error');
  }

  async openSignupErrorScreen() {
    await this.navigateToScreen('/signup-error');
  }
}
