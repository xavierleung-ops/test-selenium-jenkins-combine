const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options();

// Configure options for Chrome
options.addArguments('--disable-dev-shm-usage');
options.addArguments('--no-sandbox');
options.addArguments('--headless');

describe('Google Search Tests', () => {
  let driver;

  beforeAll(async () => {
    console.log('Starting the browser...');
    const builder = new Builder().forBrowser('chrome').setChromeOptions(options);
    driver = await builder.build();
  });

  afterAll(async () => {
    console.log('Test finished')
    if (driver) {
      console.log('Closing the browser...');
      await driver.quit();
    }
  });

  test('Valid search should return correct title', async () => {
    await driver.get('http://www.google.com/');
    await driver.findElement(By.name('q')).sendKeys('Webdriver selenium test', Key.RETURN);
    await driver.wait(until.titleContains('Webdriver selenium test'), 4000);
    let pageTitle = await driver.getTitle();
    pageTitle = pageTitle.split(' - ')[0];
    console.log("pageTitle:", pageTitle);
    expect(pageTitle).toBe('Webdriver selenium test');
  }, 10000);

  // test('Invalid search should not return correct title', async () => {
  //   await driver.get('http://www.google.com/');
  //   await driver.findElement(By.name('q')).sendKeys('Invalid test', Key.RETURN);
  //   await driver.wait(until.titleContains('Invalid test'), 4000);
  //   let pageTitle2 = await driver.getTitle();
  //   pageTitle2 = pageTitle2.split(' - ')[0];
  //   console.log("pageTitle2:", pageTitle2);
  //   expect(pageTitle2).not.toBe('Webdriver selenium test');
  // });
});
