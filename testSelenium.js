const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
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
  }, 10000);

  afterAll(async () => {
    console.log('Test finished')
    if (driver) {
      try{
        console.log('Closing the browser...');
        await driver.quit();
      } catch (error) {
        console.error('Failed to close the driver:', error);
      } 
    }
  });

  test('Fill form with input & dropdowns', async () => {
    await driver.get('https://demoqa.com/automation-practice-form');

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

    await driver.findElement(By.id('submit')).click();
    // Wait for the modal to appear
    await driver.wait(until.elementLocated(By.className('modal-content')), 10000);

    // Get today's date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[today.getMonth()];
    const year = today.getFullYear();
    const formattedDate = `${day} ${month},${year}`;

    // Assert the table entries
    const tableRows = await driver.findElements(By.css('.table tbody tr'));
    const expectedResults = [
      ['Student Name', 'John Doe'],
      ['Student Email', 'john.doe@example.com'],
      ['Gender', 'Male'],
      ['Mobile', '1234567890'],
      ['Date of Birth', formattedDate],
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
      console.log("Value:", value, "Expected results:", expectedResults[i][1]);
      
    }    
  }, 90000);

  test('Verify values in the web table', async () => {
    await driver.get('https://demoqa.com/webtables');
    const tableRows = await driver.findElements(By.css('.rt-tbody .rt-tr-group'));
    assert(tableRows.length > 0, "No rows found in the table");
    const expectedResults = [
      'Cierra', // First name
      'Vega',  // Last name
      '39',    // Age
      'cierra@example.com', // Email
      '10000', // Salary
      'Insurance' // Department
    ];

    const cells = await tableRows[0].findElements(By.css('.rt-td'));
    for (let i = 0; i < expectedResults.length; i++) {
      const text = await cells[i].getText();
      assert.strictEqual(text, expectedResults[i], `Mismatch in column ${i}: expected ${expectedResults[i]} but found ${text}`);
      console.log(`Column ${i}: ${text}`);
    }
  }, 90000);

  test('Edit & verify in the web table', async () => {
    await driver.get('https://demoqa.com/webtables');

    var firstNameInTable = await driver.findElement(By.xpath("//div[@class='rt-td'][text()='Cierra']"));
    var displayedFirstName = await firstNameInTable.getText();
    console.log('The first name was:', displayedFirstName);
    
    const editButtons = await driver.findElements(By.xpath("//span[@title='Edit']"));
    assert(editButtons.length > 0, 'No edit buttons found');
    await driver.executeScript("arguments[0].scrollIntoView(true);", editButtons[0]);
    await driver.executeScript("arguments[0].click();", editButtons[0]);

    await driver.wait(until.elementLocated(By.id('firstName')), 5000);
    const firstNameField = await driver.findElement(By.id('firstName'));
    await firstNameField.clear();
    await firstNameField.sendKeys('John');

    // Submit form
    const submitButton = await driver.findElement(By.id('submit'));
    await submitButton.click();

    // Verify the changes were made in the web table
    firstNameInTable = await driver.findElement(By.xpath("//div[@class='rt-td'][text()='John']"));
    displayedFirstName = await firstNameInTable.getText();
    assert.strictEqual(displayedFirstName, 'John', 'The first name in the table was not updated correctly.');

    console.log('The first name was updated to:', displayedFirstName);
  }, 90000);  

  test('Delete & verify in the web table', async () => {
    await driver.get('https://demoqa.com/webtables');

    // To count rows where all cells have non-empty values
    async function countFullyPopulatedRows() {
        const rows = await driver.findElements(By.css('.rt-tbody .rt-tr-group'));
        let validCount = 0;

        for (const row of rows) {
            const cells = await row.findElements(By.css('.rt-td'));
            const texts = await Promise.all(cells.slice(0, -1).map(cell => cell.getText()));
            // Check if all cells in the row except last cell have non-empty values
            if (texts.every(text => text.trim() !== '')) {
                validCount++;
            }
        }
        return validCount;
    }
    
    let initialValidRowCount = await countFullyPopulatedRows();
    console.log('Number of rows before deletion:', initialValidRowCount);

    var firstNameInTable = await driver.findElement(By.xpath("//div[@class='rt-td'][1]")).getText();
    console.log('The first name in first column was:', firstNameInTable);
    const deleteButtons = await driver.findElements(By.xpath("//span[@title='Delete']"));
    assert(deleteButtons.length > 0, 'No delete buttons found');
    await driver.executeScript("arguments[0].scrollIntoView(true);", deleteButtons[0]);
    await deleteButtons[0].click(); // Click the first delete button

    await driver.wait(until.elementsLocated(By.css('.rt-tbody .rt-tr-group')), 5000);

    let remainingValidRowCount = await countFullyPopulatedRows();
    console.log('Number of rows after deletion:', remainingValidRowCount);

    assert.strictEqual(remainingValidRowCount, initialValidRowCount - 1, 'The row count did not decrease by one after deletion');

    firstNameInTable = await driver.findElement(By.xpath("//div[@class='rt-td'][1]")).getText();
    console.log('The first name in first column after deletion was:', firstNameInTable);

    console.log('Row deletion test passed.');
  }, 90000);  
  

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
