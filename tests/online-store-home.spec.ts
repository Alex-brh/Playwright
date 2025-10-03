import { test, expect } from '@playwright/test';
import { StoreHomePage } from '../tests/POM/online-store-home';

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
});