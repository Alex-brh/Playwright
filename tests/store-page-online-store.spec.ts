import { test, expect } from '@playwright/test';
import { StoreHomePage } from './POM/home-page';
import config from '../playwright.config';

const baseURL = config.use?.baseURL ?? 'https://free-5288352.webadorsite.com/';

test.describe(`Test online store 'Store' page by`, () => {
  let storeHomePage: StoreHomePage;

  // Request both `page` and `request` fixtures here
  test.beforeEach(async ({ page, request }) => {
    storeHomePage = new StoreHomePage(page);
    await storeHomePage.gotoStoreHomePage(page, request);
  });

  test(`navigating to the 'Store' page`, async ({ page }) => {
    await storeHomePage.clickMenuItem(page, storeHomePage.storemenuItem, `${baseURL}store`);
  });
});