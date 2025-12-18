import { test, expect, type Page } from '@playwright/test';
import { StoreHomePage } from './POM/home-page';
import config from '../playwright.config';

let page: Page;

const baseUrl = config.use?.baseURL ?? 'https://free-5288352.webadorsite.com/';

test.describe(`Test 'Home' page by`, () => {
  let storeHomePage: StoreHomePage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

    test.afterAll(async () => {
    // Close the page.
    await page.close();
  });

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
    await storeHomePage.clickMenuItem(page, storeHomePage.storMenuItem, `${baseUrl}store`);
    await storeHomePage.clickMenuItem(page, storeHomePage.homeMenuItem, `${baseUrl}`);
    await storeHomePage.clickMenuItem(page, storeHomePage.faqMenuItem, `${baseUrl}faq`);
    await storeHomePage.clickMenuItem(page, storeHomePage.customerTestimonialsMenuItem, `${baseUrl}customer-testimonials`);
    await storeHomePage.clickMenuItem(page, storeHomePage.contactMenuItem, `${baseUrl}contact`);
    await storeHomePage.clickMenuItem(page, storeHomePage.elementsWithFramesMenuItem, `${baseUrl}elements-with-frames`);
    await storeHomePage.clickMenuItem(page, storeHomePage.showCaseMenuItem, `${baseUrl}showcase`);
    await storeHomePage.clickMenuItem(page, storeHomePage.clearanceMenuItem, `${baseUrl}clearance`);
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

  test(`validating the 'Home' page header and all sub-header contents`, async ({ page }) => {
    const homePageHeader = "Discover Unique Ways To Create Test Scripts";
    await expect(storeHomePage.pageHeader).toHaveText(homePageHeader);
    const homePageSubHeaders = [
      { index: 0, text: "Welcome to Alex's test automation site for practice" },
      { index: 1, text: "Verify New Collection" },
      { index: 2, text: "Discover Our Exclusive Collection" },
      { index: 3, text: "More stuff" }
    ];
    for (const subHeader of homePageSubHeaders) {
      console.log(`Verifying the following sub-header at index ${subHeader.index} with text: ${subHeader.text}`);
      await expect.soft(storeHomePage.pageSubHeader.nth(subHeader.index)).toHaveText(subHeader.text);

    }
  });

  test(`validating the 'Home' page header and all sub-header colors`, async ({ page }) => {
    const homePageHeaderColor = "rgb(255, 255, 255)"; // White
    await expect.soft(storeHomePage.pageHeader).toHaveCSS("color", homePageHeaderColor);
    const homePageSubHeadersColors = [
      { index: 0, color: "rgb(78, 58, 196)", colorEng: "black" },
      { index: 1, color: "rgb(78, 58, 196)", colorEng: "black" },
      { index: 2, color: "rgb(78, 58, 196)", colorEng: "black" },
      { index: 3, color: "rgb(78, 58, 196)", colorEng: "black" }
    ];
    for (const subHeaderColor of homePageSubHeadersColors) {
      console.log(`Validating the following sub-header at [index: ${subHeaderColor.index}] with [color: ${subHeaderColor.colorEng}] | [color number: ${subHeaderColor.color}]`);
      await expect.soft(storeHomePage.pageSubHeader.nth(subHeaderColor.index)).toHaveCSS("color", subHeaderColor.color);
    }
  });

  test(`validating the presence of 5 pictures on the 'Home' page`, async () => {
    await expect(storeHomePage.picsInCarousel).toHaveCount(5);
    // Validate each image attributes.
    await expect.soft(storeHomePage.picsInCarousel.nth(0)).toHaveAttribute('srcset');
    await expect.soft(storeHomePage.picsInCarousel.nth(1)).toHaveAttribute('srcset');
    await expect.soft(storeHomePage.picsInCarousel.nth(2)).toHaveAttribute('srcset');
    await expect.soft(storeHomePage.picsInCarousel.nth(3)).toHaveAttribute('srcset');
    await expect.soft(storeHomePage.picsInCarousel.nth(4)).toHaveAttribute('srcset');
  });

});