/* Silahkan install dulu resemblejs ke folder project kalian
npm instal resemblejs
*/

const fs = require("fs");
const path = require("path");
const resemble = require("resemblejs");

const screenshotDir = path.join(__dirname, "../screenshots");
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir);
}

async function compareScreenshots(testCaseName) {
  const baselineImage = path.join(
    screenshotDir,
    `${testCaseName}_baseline.png`
  );
  const newImage = path.join(screenshotDir, `${testCaseName}_new.png`);
  const diffImage = path.join(screenshotDir, `${testCaseName}_diff.png`);

  // Jika baseline belum ada, simpan screenshot pertama sebagai baseline
  if (!fs.existsSync(baselineImage)) {
    console.log(
      `Baseline image for ${testCaseName} not found. Saving new image as baseline.`
    );
    fs.copyFileSync(newImage, baselineImage);
    return;
  }

  return new Promise((resolve, reject) => {
    resemble(baselineImage)
      .compareTo(newImage)
      .ignoreColors()
      .onComplete((data) => {
        fs.writeFileSync(diffImage, data.getBuffer());
        console.log(`Visual difference: ${data.misMatchPercentage}%`);

        if (data.misMatchPercentage > 1) {
          console.error(`Visual regression detected! Check ${diffImage}`);
        } else {
          console.log(`No significant visual differences detected.`);
        }
        resolve();
      });
  });
}

module.exports = { compareScreenshots };
