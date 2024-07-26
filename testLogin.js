const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
async function loginTest() {
  // launch the browser
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    //navigate to facebook login page
    await driver.get("https://test-login-app.vercel.app/");
    // Select input elements and fill them out
    await driver.findElement(By.id("email")).sendKeys("test3@gmail.com");
    await driver.findElement(By.id("password")).sendKeys("Password@12345");
    // Select login button and invoke click action
    //If login details are correct we wiil be redirected to the welcome page
    await driver.findElement(By.name("login")).click();
    //On succesful login get page title
    //Check page title, to confirm login was successful
    const pageTitle = await driver.getTitle();
    // assert usign node assertion
    assert.strictEqual(pageTitle, "Welcomepage");
    //Check if redirect to login page was successfull
    await driver.wait(until.titleIs("Welcomepage"), 4000);
  } finally {
    await driver.quit();
  }
}
loginTest();
