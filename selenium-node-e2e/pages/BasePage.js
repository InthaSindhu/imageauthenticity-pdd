import { By, until } from 'selenium-webdriver';

export class BasePage {
  constructor(driver, baseUrl) {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async navigateTo(path = '/') {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    await this.driver.get(url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(timeoutMs = 10000) {
    await this.driver.wait(async () => {
      const readyState = await this.driver.executeScript('return document.readyState');
      return readyState === 'complete';
    }, timeoutMs);
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  async getPageTitle() {
    return await this.driver.getTitle();
  }

  async findElement(locator, timeoutMs = 10000) {
    const el = await this.driver.wait(until.elementLocated(locator), timeoutMs);
    await this.driver.wait(until.elementIsVisible(el), timeoutMs);
    return el;
  }

  async isElementPresent(locator, timeoutMs = 3000) {
    try {
      await this.driver.wait(until.elementLocated(locator), timeoutMs);
      return true;
    } catch {
      return false;
    }
  }

  async click(locator) {
    const el = await this.findElement(locator);
    await el.click();
  }

  async type(locator, text) {
    const el = await this.findElement(locator);
    await el.clear();
    await el.sendKeys(text);
  }

  async getText(locator) {
    const el = await this.findElement(locator);
    return await el.getText();
  }
}
