import { test, expect } from '@playwright/test';
import { StoreHomePage } from './POM/home-page';
import { StorePage } from './POM/store-page';
import config from '../playwright.config';
import { url } from 'inspector';

const baseURL = config.use?.baseURL ?? 'https://free-5288352.webadorsite.com/';

test.describe(`Test online store 'Store' page by`, () => {
  let storeHomePage: StoreHomePage, storePage: StorePage;

  // Request both `page` and `request` fixtures here
  test.beforeEach(async ({ page, request }) => {
    storeHomePage = new StoreHomePage(page);
    storePage = new StorePage(page);
    await storeHomePage.gotoStoreHomePage(page, request);
  });

  test(`navigating to the 'Store' page and validating product headers`, async ({ page }) => {
    await storeHomePage.clickMenuItem(page, storeHomePage.storMenuItem, `${baseURL}store`);
    await expect(page).toHaveURL(`${baseURL}store`);
    const productDetails = [{
    productIndex: 1,
    productHref: "/product/15278051/best-test-script-b", // Optional.
    headerText: "Best test script B" // Optional.
    }];
    for (const product of productDetails) {
        await storePage.validateProductHeader(page, product )
    }
  });
});