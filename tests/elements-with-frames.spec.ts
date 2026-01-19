import { test, expect } from '@playwright/test';
import { StoreHomePage } from './POM/home-page';
import { ElementsWithFramesPage } from './POM/elements-with-frames';
import config from '../playwright.config';

const baseURL = config.use?.baseURL ?? 'https://free-5288352.webadorsite.com/';

test.describe(`Test 'Elements with frames' page by`, () => {
  let storeHomePage: StoreHomePage, elementsWithFramesPage: ElementsWithFramesPage;

  test.beforeEach(async ({ page, request }) => {
    storeHomePage = new StoreHomePage(page);
    elementsWithFramesPage = new ElementsWithFramesPage(page);
    await storeHomePage.gotoStoreHomePage(page, request);
    await storeHomePage.clickMenuItem(page, storeHomePage.elementsWithFramesMenuItem, `${baseURL}elements-with-frames`);
  });

  test('validating overall appearance and frames content', async ({ page }) => {
    await elementsWithFramesPage.validateIframeCount(6);
    await elementsWithFramesPage.validateFirstFrameHasContent();
    await expect(elementsWithFramesPage.buttonTypeHere.nth(0)).toBeAttached();
    await expect(elementsWithFramesPage.buttonTypeHere.nth(0)).toContainText('Type here');
  });

  test('validating the page title', async ({ page }) => {
    const expectedTitle = 'Elements with frames | Online store';
    await expect(page).toHaveTitle(expectedTitle);
  });
});
