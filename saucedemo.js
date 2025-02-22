const { Builder, By, Key, until } = require("selenium-webdriver");

const assert = require("assert");

async function saucedemoAddToCartTest() {
  // Membuat koneksi dengan webdriver
  let driver = await new Builder().forBrowser("chrome").build();

  // Exception Handling & Conclusion
  try {
    // Buka website SauceDemo di browser
    await driver.get("https://saucedemo.com");
    
    // Login ke akun SauceDemo
    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
    await driver
      .findElement(By.xpath("//input[@id='password']"))
      .sendKeys("secret_sauce");
    await driver.findElement(By.name("login-button")).click();

    // Validasi user berada di dashboard setelah login

    await driver.wait(until.elementLocated(By.css(".title")), 60000);
    let titleText = await driver.findElement(By.css(".title")).getText();
    assert.strictEqual(
      titleText.includes("Products"),
      true,
      'Title does not include "User gagal masuk ke dashboard"'
    );

    // Tambah item ke cart
    await driver.findElement(By.css(".btn.btn_primary.btn_small.btn_inventory")).click();

    // Validasi item berhasil ditambahkan
    await driver.findElement(By.css(".shopping_cart_link")).click();
    let cartItem = await driver.findElement(By.className("shopping_cart_badge")).getText();
    assert.strictEqual(
      cartItem == 1,
      true,
      "Item gagal ditambahkan ke cart"
    );



  } finally {
    await driver.quit();
  }
}

saucedemoAddToCartTest();
