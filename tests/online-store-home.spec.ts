import { test, expect } from '@playwright/test';
import { StoreHomePage } from './POM/online-store-home';

const baseUrl = "https://free-5288352.webadorsite.com/";

test.describe(`Test online store 'Home' page by`, () => {
  let storeHomePage: StoreHomePage;

  // Request both `page` and `request` fixtures here
  test.beforeEach(async ({ page, request }) => {
    storeHomePage = new StoreHomePage(page);
    await storeHomePage.gotoStoreHomePage(page, request);
  });

  test('ensuring that all menu items show up', async ({ page }) => {
    // Validate the presence of all menu items on the 'Home' page.
    await storeHomePage.validateAllMenuItemsPresence();
  });

  test('switching over between menus and verifying page URL', async ({ page }) => {
    // Click each one of the menu items on the 'Home' page and validate the page URL each time.
    await storeHomePage.clickMenuItem(page, storeHomePage.storemenuItem, `${baseUrl}store`);
    await storeHomePage.clickMenuItem(page, storeHomePage.homeMenuItem, `${baseUrl}`);
    await storeHomePage.clickMenuItem(page, storeHomePage.faqMenuItem, `${baseUrl}faq`);
    await storeHomePage.clickMenuItem(page, storeHomePage.customerTestimonialsMenuItem, `${baseUrl}customer-testimonials`);
    await storeHomePage.clickMenuItem(page, storeHomePage.contactMenuItem, `${baseUrl}contact`);
    await storeHomePage.clickMenuItem(page, storeHomePage.elementsWithFramesMenuItem, `${baseUrl}elements-with-frames`);
    await storeHomePage.clickMenuItem(page, storeHomePage.aboutUsMenuItem, `${baseUrl}contact`);
  });

  test(`clicking each one of 'Shop now' buttons and verifying page url it leads to`, async ({ page }) => {
    // Click each one of the 3 'Shop now' buttons on the 'Home' page and validate the page URL.
    for (let i = 0; i < 3; i++) {
      await storeHomePage.clickShopNowButton(page, i);
      await expect(page).toHaveURL(`${baseUrl}store`);
      await page.goBack();
      await expect(page).toHaveURL(baseUrl, { timeout: 15000 });
    }
  });
});