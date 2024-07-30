const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

// Added options for not found DevToolsActivePort file
const chrome = require('selenium-webdriver/chrome')
const options = new chrome.Options()

async function loginTest() {
  let driver;
  try {
    console.log('Init options for browser')
    options.addArguments('--disable-dev-shm-usage')
    options.addArguments('--no-sandbox')
    options.addArguments('--headless')
    console.log('Starting the browser...');
    let builder = new Builder().forBrowser('chrome').setChromeOptions(options);
    console.log("Building chrome");
    driver = await builder.build();

    console.log('Navigating to the login page...');
    await driver.get('https://test-login-app.vercel.app/');

    console.log('Entering the email...');
    await driver.findElement(By.id('email')).sendKeys('test3@gmail.com');

    console.log('Entering the password...');
    await driver.findElement(By.id('password')).sendKeys('Password@12345');

    console.log('Clicking the login button...');
    await driver.findElement(By.name('login')).click();

    console.log('Getting the page title...');
    const pageTitle = await driver.getTitle();
    console.log(`Page title is: ${pageTitle}`);
    assert.strictEqual(pageTitle, "Welcomepage");

    console.log('Waiting for the correct page title...');
    await driver.wait(until.titleIs('Welcomepage'), 4000);

    console.log('Test completed successfully');
  } catch (error) {
    console.error('Error encountered:', error);
    throw error; // Rethrow after logging
  } finally {
    if (driver) {
      console.log('Closing the browser...');
      await driver.quit();
    }
  }
}

loginTest().catch(error => {
  console.error('Failed to execute test:', error);
});
