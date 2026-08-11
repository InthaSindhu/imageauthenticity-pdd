import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class AuthPage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
    this.emailInput = By.css('input[type="email"], input[name="email"], #email');
    this.passwordInput = By.css('input[type="password"], input[name="password"], #password');
    this.submitBtn = By.css('button[type="submit"], button:has-text("Login"), button:has-text("Sign Up")');
    this.heading = By.css('h1, h2, .title');
  }

  async openLogin() {
    await this.navigateTo('/login');
  }

  async openSignup() {
    await this.navigateTo('/signup');
  }

  async openLoginError() {
    await this.navigateTo('/login-error');
  }

  async openSignupError() {
    await this.navigateTo('/signup-error');
  }

  async hasPageHeader() {
    return await this.isElementPresent(By.css('h1, h2, header, div'));
  }
}
