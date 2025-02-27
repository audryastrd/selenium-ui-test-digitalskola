const { By } = require("selenium-webdriver");

class InventoryPage {
  constructor(driver) {
    this.driver = driver;
    this.inventoryList = By.className("inventory_list");
    this.appLogo = By.css(".app_logo");
  }

  async getTitleText() {
    return await this.driver.findElement(this.appLogo).getText();
  }
}

module.exports = InventoryPage;