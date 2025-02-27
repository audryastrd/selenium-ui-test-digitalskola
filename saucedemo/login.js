const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");
const LoginPage = require("../pages/loginPage");
const InventoryPage = require("../pages/inventoryPage");
const Data = require("../fixtures/Data.json");
const fs = require("fs");
const path = require("path");
const { compareScreenshots } = require("../helper/visualTesting");

async function saucedemoLogin() {
  describe("Saucedemo Login", function () {
    let driver;
    let browserName = "chrome";
    let loginPage;
    let inventoryPage;

    beforeEach(async function () {
      // Menambahkan timeout
      this.timeout(30000); // 10.000 ms = 10 detik

      // Membuat koneksi dengan webdriver
      driver = await new Builder().forBrowser(browserName).build();
      loginPage = new LoginPage(driver);
      inventoryPage = new InventoryPage(driver);
      // Open url
      await loginPage.open(Data.baseUrl);
    });

    it("TC01-Login Success", async function () {
        this.timeout(3000);
      await loginPage.login(
        Data.validUser.username,
        Data.validUser.password
      );

      //assertion
      const titleText = await inventoryPage.getTitleText();

      assert.strictEqual(
        titleText.includes(Data.assertTitle),
        true,
        Data.titleError
      );

      console.log(Data.log.LoginSuccess);
    }),
      it("TC02-Login Failed", async function () {
        this.timeout(3000);
        await loginPage.login(
          Data.invalidUser.username,
          Data.invalidUser.password
        );

        //assertion
        const errorMessage = await loginPage.getErrorMessage();
        await loginPage.verifyLoginFailed(
          Data.messages.expectedLoginError,
          Data.messages.loginError
        );

        console.log(Data.log.LoginFailed);
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

saucedemoLogin();
