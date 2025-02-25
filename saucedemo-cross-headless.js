const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");
const edge = require("selenium-webdriver/edge");

async function saucedemoAddToCartTest() {
  const browsers = [
    {
      name: "chrome",
      options: new chrome.Options().addArguments("--headless"),
    },
    {
      name: "firefox",
      options: new firefox.Options().addArguments("--headless"),
    },
    {
      name: "MicrosoftEdge",
      options: new edge.Options().addArguments("--headless"),
    },
  ];

  for (let browser of browsers) {
    let driver = await new Builder()
      .forBrowser(browser.name)
      .setChromeOptions(browser.name === "chrome" ? browser.options : undefined)
      .setFirefoxOptions(
        browser.name === "firefox" ? browser.options : undefined
      )
      .setEdgeOptions(
        browser.name === "MicrosoftEdge" ? browser.options : undefined
      )
      .build();

    try {
      // Test Hooks: Before Each Test
      await driver.get("https://saucedemo.com");

      

      // User Success Login
      await driver.findElement(By.id("user-name")).sendKeys("standard_user");
      await driver.findElement(By.id("password")).sendKeys("secret_sauce");
      await driver.findElement(By.name("login-button")).click();

      // Validate User is on Dashboard
      let titleText = await driver.findElement(By.css(".app_logo")).getText();
      assert.strictEqual(
        titleText.includes("Swag Lab"),
        true,
        'Title does not include "Swag Labs"'
      );
      console.log("Testing Website in " + browser.name);
      console.log("User successfully logged in!");

      // Add Item to Cart
      await driver.findElement(By.xpath("//button[contains(text(),'Add to cart')]")).click();

      // Validate Item Successfully Added to Cart
      let cartBadge = await driver.findElement(By.className("shopping_cart_badge")).getText();
      assert.strictEqual(cartBadge, "1", "Item was not added to cart successfully!");
      console.log("Item successfully added to cart!");

    } catch (error) {
      console.error("Test failed: ", error);
    } finally {
      // Test Hooks: After Each Test
      await driver.quit();
    }
  }
}

saucedemoAddToCartTest();