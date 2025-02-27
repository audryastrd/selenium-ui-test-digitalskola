const { By } = require("selenium-webdriver");

const assert = require("assert");
class informationPage{
    constructor(driver){
        this.driver = driver;
    this.firstnameInput = By.id("first-name");
    this.lastnameInput = By.id("last-name");
    this.postalcodeInput = By.id("postal-code");

}

    async checkout(){
        await this.driver.findElement(By.xpath("//button[contains(text(),'Add to cart')]")).click();
        await this.driver.findElement(By.xpath("//button[contains(text(),'Add to cart')]")).click();
        await this.driver.findElement(By.css(".shopping_cart_link")).click();
        await this.driver.findElement(By.xpath("//button[@id='checkout']")).click();

    }
    async inputInformation(firstname, lastname,postalcode){
        await this.driver.findElement(this.firstnameInput).sendKeys(firstname);
        await this.driver.findElement(this.lastnameInput).sendKeys(lastname);
        await this.driver.findElement(this.postalcodeInput).sendKeys(postalcode);
        await this.driver.findElement(By.xpath("//input[@id='continue']")).click();
        await this.driver.findElement(By.xpath("//button[@id='finish']")).click();
    }

    async checkoutComplete(){
    let titleText = await this.driver.findElement(By.id("checkout_complete_container")).getText();
    assert.strictEqual(
      titleText.includes("Thank you"),
      true,
      'Checkout Complete Successfully'
    );
    }
}

module.exports = informationPage;