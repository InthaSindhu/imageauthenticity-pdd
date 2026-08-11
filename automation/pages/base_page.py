class BasePage:
    def __init__(self, driver):
        self.driver = driver

    def find_element(self, locator):
        if self.driver:
            try:
                return self.driver.find_element(*locator)
            except Exception:
                return None
        return None

    def click(self, locator):
        el = self.find_element(locator)
        if el:
            el.click()

    def type_text(self, locator, text):
        el = self.find_element(locator)
        if el:
            el.clear()
            el.send_keys(text)
