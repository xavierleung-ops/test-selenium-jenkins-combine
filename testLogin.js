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

    console.log('Navigating to the google page...');
    await driver.get('http://www.google.com/');


    console.log('Waiting for the correct page title...');
    await driver.wait(until.titleIs('Google'), 4000);

    console.log('Waiting for search...');
    await driver.findElement(By.name('q')).sendKeys('webdriver-selenium-test', Key.RETURN);
    await driver.wait(until.titleIs('webdriver-selenium-test - Google Search'), 4000);
    

    console.log('Test completed successfully');
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
