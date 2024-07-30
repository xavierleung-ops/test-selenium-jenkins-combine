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
    
    console.log("Test results:-----------------------------------")
    await driver.get('http://www.google.com/');

    await driver.wait(until.titleIs('Google'), 4000);

    await driver.findElement(By.name('q')).sendKeys('Webdriver selenium test', Key.RETURN);
    await driver.wait(until.titleContains('Webdriver selenium test'), 4000);
    console.log('Test completed successfully');

    console.log("Invalid test results:-----------------------------------")
    await driver.findElement(By.name('q')).sendKeys('Invalid test', Key.RETURN);
    await driver.wait(until.titleContains('Webdriver selenium test'), 4000);
    
    
  } catch (error) {
    console.error('Error encountered:', error);
    throw error; // Rethrow
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
