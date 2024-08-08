const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options();

// Configure options for Chrome
// options.addArguments('--disable-dev-shm-usage');
// options.addArguments('--no-sandbox');
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

  test('Fill form with input & dropdowns', async () => {
    await driver.get('https://demoqa.com/automation-practice-form');
    console.log("Finished accessing")

    await driver.findElement(By.id('firstName')).sendKeys('John');
    await driver.findElement(By.id('lastName')).sendKeys('Doe');
    await driver.findElement(By.id('userEmail')).sendKeys('john.doe@example.com');
    await driver.findElement(By.xpath("//label[contains(text(), 'Male')]")).click();
    await driver.findElement(By.id('userNumber')).sendKeys('1234567890');

    let stateDropdown = driver.findElement(By.id('state'));
    await driver.executeScript("arguments[0].scrollIntoView(true);", stateDropdown);
    await stateDropdown.click();
    await driver.findElement(By.xpath("//div[contains(text(),'NCR')]")).click();

    let cityDropdown = driver.findElement(By.id('city'));
    await cityDropdown.click();
    await driver.findElement(By.xpath("//div[contains(text(),'Delhi')]")).click();
    console.log("Finished fill")


    await driver.findElement(By.id('submit')).click();
    // Wait for the modal to appear
    await driver.wait(until.elementLocated(By.className('modal-content')), 10000);
    console.log("Finished submit")

    // Assert the table entries
    const tableRows = await driver.findElements(By.css('.table tbody tr'));
    const expectedResults = [
      ['Student Name', 'John Doe'],
      ['Student Email', 'john.doe@example.com'],
      ['Gender', 'Male'],
      ['Mobile', '1234567890'],
      ['Date of Birth', '08 August,2024'],
      ['Subjects', ''], // Fill accordingly if needed
      ['Hobbies', ''], // Fill accordingly if needed
      ['Picture', ''], // Fill accordingly if needed
      ['Address', ''], // Fill accordingly if needed
      ['State and City', 'NCR Delhi']
    ];

    for (let i = 0; i < expectedResults.length; i++) {
      const cells = await tableRows[i].findElements(By.tagName('td'));
      const label = await cells[0].getText();
      const value = await cells[1].getText();
      assert.strictEqual(label, expectedResults[i][0]);
      assert.strictEqual(value, expectedResults[i][1]);
    }    
  }, 60000);

  // test('Valid search should return correct title', async () => {
  //   await driver.get('http://www.google.com/');
  //   await driver.findElement(By.name('q')).sendKeys('Webdriver selenium test', Key.RETURN);
  //   await driver.wait(until.titleContains('Webdriver selenium test'), 4000);
  //   let pageTitle = await driver.getTitle();
  //   pageTitle = pageTitle.split(' - ')[0];
  //   console.log("pageTitle:", pageTitle);
  //   expect(pageTitle).toBe('Webdriver selenium test');
  // }, 20000);

  // test('Invalid search that will fail pipeline', async () => {
  //   await driver.get('http://www.google.com/');
  //   await driver.findElement(By.name('q')).sendKeys('Invalid test', Key.RETURN);
  //   await driver.wait(until.titleContains('Invalid test'), 4000);
  //   let pageTitle2 = await driver.getTitle();
  //   pageTitle2 = pageTitle2.split(' - ')[0];
  //   console.log("pageTitle2:", pageTitle2);
  //   expect(pageTitle2).not.toBe('Webdriver selenium test');
  // });
});
