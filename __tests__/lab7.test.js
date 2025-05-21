describe('Basic user flow for Website', () => {
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  beforeEach(async () => {
    console.log('Resetting state...');
    await page.evaluate(() => localStorage.clear());
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/', { waitUntil: 'domcontentloaded' });
    console.log('State reset complete.');
  });

  it('Initial Home Page - Check for 20 product items', async () => {
    const numProducts = await page.$$eval('product-item', (prodItems) => prodItems.length);
    expect(numProducts).toBe(20);
  });

  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');
    const allArePopulated = await page.$$eval('product-item', (prodItems) => {
      return prodItems.every((item) => {
        const data = item.data;
        return data.title && data.price && data.image;
      });
    });
    expect(allArePopulated).toBe(true);
  }, 10000);

  it('Clicking the "Add to Cart" button should change button text', async () => {
    const product = await page.$('product-item');
    const shadowRoot = await product.getProperty('shadowRoot');
    const buttonHandle = await shadowRoot.$('button');

    await buttonHandle.click();
    const innerTextProp = await buttonHandle.getProperty('innerText');
    const innerText = await innerTextProp.jsonValue();

    expect(innerText).toBe("Remove from Cart");
  }, 2500);

  it('Checking number of items in cart on screen', async () => {
    const prodItems = await page.$$('product-item');
    for (let i = 0; i < prodItems.length; i++) {
      const item = prodItems[i];
      const shadow = await item.getProperty('shadowRoot');
      const button = await shadow.$('button');
      await button.click();
      await page.waitForFunction((selector, expectedCount) => document.querySelector(selector).innerText === expectedCount.toString(), {}, '#cart-count', i + 1);
    }
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('20');
  }, 30000);

  it('Checking number of items in cart on screen after reload', async () => {
    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadow = await item.getProperty('shadowRoot');
      const button = await shadow.$('button');
      await button.click();
    }
    await page.reload({ waitUntil: 'domcontentloaded' });
    const prodItemsAfterReload = await page.$$('product-item');
    let allButtonsCorrect = true;
    const cartCountAfterReload = await page.$eval('#cart-count', el => el.innerText);

    for (const item of prodItemsAfterReload) {
      const shadow = await item.getProperty('shadowRoot');
      const button = await shadow.$('button');
      const text = await (await button.getProperty('innerText')).jsonValue();
      if (text !== 'Remove from Cart') allButtonsCorrect = false;
    }

    expect(allButtonsCorrect).toBe(true);
    expect(cartCountAfterReload).toBe('20');
  }, 30000);

  it('Checking the localStorage to make sure cart is correct', async () => {
    const prodItems = await page.$$('product-item');
    for (let i = 0; i < prodItems.length; i++) {
      const item = prodItems[i];
      const shadow = await item.getProperty('shadowRoot');
      const button = await shadow.$('button');
      await button.click();
    }
    await page.waitForFunction(() => {
      const cartString = localStorage.getItem('cart');
      if (!cartString) return false;
      const cartArray = JSON.parse(cartString);
      return cartArray.length === 20;
    }, {}, { timeout: 10000 });
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
  }, 40000);

  it('Checking number of items in cart on screen after removing from cart', async () => {
    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadow = await item.getProperty('shadowRoot');
      const button = await shadow.$('button');
      await button.click(); // Add to cart
    }
    for (let i = 0; i < prodItems.length; i++) {
      const item = prodItems[i];
      const shadow = await item.getProperty('shadowRoot');
      const button = await shadow.$('button');
      await button.click(); // Remove from cart
      await page.waitForFunction((selector, expectedCount) => document.querySelector(selector).innerText === expectedCount.toString(), {}, '#cart-count', 20 - (i + 1));
    }
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('0');
  }, 40000);

  it('Checking number of items in cart on screen after reload', async () => {
    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadow = await item.getProperty('shadowRoot');
      const button = await shadow.$('button');
      await button.click(); // Add to cart
    }
    for (const item of prodItems) {
      const shadow = await item.getProperty('shadowRoot');
      const button = await shadow.$('button');
      await button.click(); // Remove from cart
    }
    await page.reload({ waitUntil: 'domcontentloaded' });
    const prodItemsAfterReload = await page.$$('product-item');
    let allButtonsCorrect = true;
    const cartCountAfterReload = await page.$eval('#cart-count', el => el.innerText);

    for (const item of prodItemsAfterReload) {
      const shadow = await item.getProperty('shadowRoot');
      const button = await shadow.$('button');
      const text = await (await button.getProperty('innerText')).jsonValue();
      if (text !== 'Add to Cart') allButtonsCorrect = false;
    }
    expect(allButtonsCorrect).toBe(true);
    expect(cartCountAfterReload).toBe('0');
  }, 40000);

  it('Checking the localStorage to make sure cart is correct', async () => {
    // Ensure cart is empty by this point (no adding done in this test)
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart === null || cart === '[]').toBe(true);
  });
});