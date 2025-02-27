const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");
const LoginPage = require("../pages/loginPage");
const Data =require("../fixtures/Data.json");
const InventoryPage = require("../pages/inventoryPage");
const path = require("path");
const fs = require("fs");
const { compareScreenshots } = require("../helper/visualTesting");

async function saucedemoInventory() {
    describe("Saucedemo Inventory", function () {
        let driver;
        let browserName = "chrome";
        let loginPage;
        let inventoryPage;

        beforeEach(async function () {
            this.timeout(30000);
            // Membuat koneksi dengan webdriver
            driver = await new Builder().forBrowser(browserName).build();
            loginPage = new LoginPage(driver);
            inventoryPage = new InventoryPage(driver);
            // Open url
            await loginPage.open(Data.baseUrl);
            await loginPage.login(Data.validUser.username, Data.validUser.password);
        });

        it("Add to Cart 1 item", async function () {
            await driver.findElement(By.xpath("//button[contains(text(),'Add to cart')]")).click();
            await driver.findElement(By.css(".shopping_cart_link")).click();
            let cartItem = await driver.findElement(By.className("shopping_cart_badge")).getText();
            assert.strictEqual(
            cartItem > 0,
            true,
            "Item berhasil ditambahkan ke cart"
            );

            console.log(Data.log.ItemAdded);
        });

        it("Add to Cart 0 item", async function () {
            await driver.findElement(By.css(".shopping_cart_link")).click();
            await driver.wait(until.elementLocated(By.className("cart_list")), 5000);

    // Get all items inside .cart_list
            let cartItems = await driver.findElements(By.css(".cart_list .cart_item"));


            console.log("Item successfully found in cart.");
                });


                afterEach(async function () {
                    this.timeout(3000);
                    const screenshotDir = path.join(__dirname, "../screenshots");
                    if (!fs.existsSync(screenshotDir)) {
                      fs.mkdirSync(screenshotDir);
                    }
              
                    // Gunakan nama test case untuk screenshot
                    const testCaseName = this.currentTest.title.replace(/\s+/g, "_"); // Ganti spasi dengan underscore
                    const newImagePath = path.join(screenshotDir, `${testCaseName}_new.png`);
                    const baselinePath = path.join(
                      screenshotDir,
                      `${testCaseName}_baseline.png`
                    );
              
                    // Simpan screenshot baru dengan nama test case
                    const image = await driver.takeScreenshot();
                    fs.writeFileSync(newImagePath, image, "base64");
              
                    // Jika baseline belum ada, simpan screenshot pertama sebagai baseline
                    if (!fs.existsSync(baselinePath)) {
                      fs.copyFileSync(newImagePath, baselinePath);
                    }
              
                    // Bandingkan screenshot berdasarkan nama test case
                    await compareScreenshots(testCaseName);
                await driver.quit();
                });
            });
}

saucedemoInventory();
