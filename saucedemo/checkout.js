const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");
const LoginPage = require("../pages/loginPage");
const Data =require("../fixtures/Data.json");
const InventoryPage = require("../pages/inventoryPage");
const InformationPage = require("../pages/informationPage");
const path = require("path");
const fs = require("fs");
const { compareScreenshots } = require("../helper/visualTesting");

async function saucedemoCheckout() {
    describe("Saucedemo Checkout", function () {
        let driver;
        let browserName = "chrome";
        let loginPage;
        let inventoryPage;
        let informationPage;

        beforeEach(async function () {
            this.timeout(30000);
            // Membuat koneksi dengan webdriver
            driver = await new Builder().forBrowser(browserName).build();
            loginPage = new LoginPage(driver);
            inventoryPage = new InventoryPage(driver);
            informationPage = new InformationPage(driver);

            // Open url
            await loginPage.open(Data.baseUrl);
            await loginPage.login(Data.validUser.username, Data.validUser.password);
        });

        it("Checkout 1 Item", async function () {
            
            await informationPage.checkout();
            await informationPage.inputInformation("audry","astridia","15413");

            await informationPage.checkoutComplete();
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

saucedemoCheckout();
