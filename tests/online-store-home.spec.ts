import { test, expect } from '@playwright/test';
import { StoreHomePage } from '../tests/POM/online-store-home';

const baseUrl = "https://free-5288352.webadorsite.com/";

test.describe(`Validate online store Home page by`, () => {
  let storeHomePage: StoreHomePage;

  // Request both `page` and `request` fixtures here
  test.beforeEach(async ({ page, request }) => {
    storeHomePage = new StoreHomePage(page);
    // You now have access to both `page` and `request`
    // and can pass them to the Page Object method.
    await storeHomePage.gotoStoreHomePage(page, request);
  });

  test('ensuring that all menu items show up', async ({ page }) => {
    await storeHomePage.validateAllMenuItemsPresence();
  });

  test('switching over between menus and verifying page URL', async ({ page }) => {
    await storeHomePage.clickMenuItem(page, storeHomePage.storemenuItem, `${baseUrl}store`);
    await storeHomePage.clickMenuItem(page, storeHomePage.homeMenuItem, `${baseUrl}`);
    await storeHomePage.clickMenuItem(page, storeHomePage.faqMenuItem, `${baseUrl}faq`);
    await storeHomePage.clickMenuItem(page, storeHomePage.customerTestimonialsMenuItem, `${baseUrl}customer-testimonials`);
    await storeHomePage.clickMenuItem(page, storeHomePage.contactMenuItem, `${baseUrl}contact`);
    await storeHomePage.clickMenuItem(page, storeHomePage.elementsWithFramesMenuItem, `${baseUrl}elements-with-frames`);
    await storeHomePage.clickMenuItem(page, storeHomePage.aboutUsMenuItem, `${baseUrl}contact`);
  });
});