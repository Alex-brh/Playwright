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

  test('navigating using menu items survives reload and browser history navigation', async ({ page }) => {
    // Navigate to the Store page from Home.
    await storeHomePage.clickMenuItem(page, storeHomePage.storMenuItem, `${baseUrl}store`);
    await expect(page).toHaveURL(`${baseUrl}store`);

    // Reload the Store page and ensure the menu is still usable.
    await page.reload();
    await expect(storeHomePage.storMenuItem).toBeVisible();

    // Use browser back/forward to return to Home and back to Store.
    await page.goBack();
    await expect(page).toHaveURL(baseUrl);
    await expect(storeHomePage.homeMenuItem).toBeVisible();

    await page.goForward();
    await expect(page).toHaveURL(`${baseUrl}store`);
    await expect(storeHomePage.storMenuItem).toBeVisible();
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
    for (let i = 1; i < 4; i++) {
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
    for (let i = 0; i < 5; i++) {
      const image = storeHomePage.picsInCarousel.nth(i);
      await expect.soft(image).toHaveAttribute('srcset');
      // Robustness check: each image should have a non-empty width and height attributes.
      await expect.soft(image).toHaveAttribute('width', /.+/);
      await expect.soft(image).toHaveAttribute('height', /.+/);
    }
  });

  test('validating primary API navigation links respond successfully', async ({ request }) => {
    const navUrls = [
      `${baseUrl}`,
      `${baseUrl}store`,
      `${baseUrl}faq`,
      `${baseUrl}customer-testimonials`,
      `${baseUrl}contact`,
      `${baseUrl}elements-with-frames`,
      `${baseUrl}showcase`,
      `${baseUrl}clearance`,
      `${baseUrl}cart`,
    ];

    for (const url of navUrls) {
      const response = await request.get(url);
      await expect(response, `Expected successful response for ${url}`).toBeOK();
    }
  });

});