export class BaseMobilePage {
  constructor(driver, baseUrl) {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async navigateToScreen(path = '/') {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    if (this.driver.get) {
      await this.driver.get(url);
    } else if (this.driver.url) {
      await this.driver.url(url);
    }
  }

  async getCurrentScreenUrl() {
    if (this.driver.getCurrentUrl) {
      return await this.driver.getCurrentUrl();
    } else if (this.driver.getUrl) {
      return await this.driver.getUrl();
    }
    return '';
  }

  async isScreenVisible() {
    return true;
  }
}
