import { type Page, type Locator, expect, APIRequestContext } from "@playwright/test";
import { url } from "inspector";

export class StoreHomePage {
  readonly homeMenuItem: Locator;
  readonly storMenuItem: Locator;
  readonly faqMenuItem: Locator;
  readonly customerTestimonialsMenuItem: Locator;
  readonly contactMenuItem: Locator;
  readonly showCaseMenuItem: Locator;
  readonly clearanceMenuItem: Locator;
  elementsWithFramesMenuItem: Locator;
  readonly basketMenuItem: Locator;
  readonly aboutUsMenuItem: Locator;
  readonly pageHeader: Locator;
  readonly shopNowButton: Locator;
  readonly pageSubHeader: Locator;
  readonly picsInCarousel: Locator;

  constructor(public readonly page: Page) {
    this.homeMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/"]');
    this.storMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/store"] > span');
    this.faqMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/faq"] > span');
    this.customerTestimonialsMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/customer-testimonials"] > span');
    this.contactMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/contact"] > span');
    this.showCaseMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/showcase"] > span');
    this.clearanceMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/clearance"] > span');
    this.elementsWithFramesMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/elements-with-frames"] > span');
    this.basketMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/cart"] > span').nth(0);
    this.aboutUsMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/contact"] > span');
    this.pageHeader = this.page.locator('div[class="jw-slideshow-title"]');
    this.shopNowButton = this.page.locator('a[href="/store"] > span');
    this.pageSubHeader = this.page.locator('h1[class^="jw-heading"]'); //.filter({hasText: `Welcome to Alex's test automation site for practice`});
    this.picsInCarousel = this.page.locator('img[class="jw-element-image__image jw-intrinsic__item"]');
  }

  /**
   * @description Navigates to the store's home page, validates the initial API call,
   * and asserts the presence of the Home menu item.
   * This method handles common navigation and initial page state checks.
   * @param {Page} page The Playwright Page object.
   * @param {APIRequestContext} request The Playwright APIRequestContext fixture.
   * @return {Promise<void>} A promise that resolves when navigation and validation are complete.
   * @throws {Error} If the API response is not OK.
   * @example
   * await storeHomePage.gotoStoreHomePage(page, request);
   */
  async gotoStoreHomePage(page: Page, request: APIRequestContext): Promise<void> {
    const url = "https://free-5288352.webadorsite.com/";
    const response = await request.get(url);
    await expect(response).toBeOK();
    // Wait until the page is fully loaded.
    await page.goto(url, { waitUntil: "commit" });
    await page.waitForURL(url, { timeout: 15000 });
    await expect(this.homeMenuItem).toBeVisible();
    await expect(this.homeMenuItem).toHaveText(" Home ");
  }
  /**
   * @description Validates the visibility of all menu items on the navigation bar.
   * This method contains a series of assertions to ensure each menu item is present
   * and visible to the user.
   * @param None
   * @return {Promise<void>} A promise that resolves when all menu items are validated.
   * @throws {Error} If any menu item is not visible.
   * @example
   * await storeHomePage.validateAllMenuItemsPresence();
   */
  async validateAllMenuItemsPresence(): Promise<void> {
    await expect(this.homeMenuItem).toBeVisible();
    await expect(this.storMenuItem).toBeVisible();
    await expect(this.faqMenuItem).toBeVisible();
    await expect(this.customerTestimonialsMenuItem).toBeVisible();
    await expect(this.contactMenuItem).toBeVisible();
    await expect(this.elementsWithFramesMenuItem).toBeVisible();
    await expect(this.basketMenuItem).toBeVisible();
    await expect(this.aboutUsMenuItem).toBeVisible();
  }

  /**
   * @description Clicks a specified locator and waits for the page URL to change.
   * This method handles the common pattern of clicking a link that triggers a navigation.
   * @param {Page} page The Playwright Page object.
   * @param {Locator} locator The Locator for the element to be clicked.
   * @param {string} url The expected URL string or URL pattern after the click.
   * @return {Promise<void>} A promise that resolves when the click and navigation are complete.
   * @throws {Error} If the locator is not visible or the URL does not match.
   * @example
   * await storeHomePage.clickMenuItem(page, locator, url);
   */
  async clickMenuItem(page: Page, locator: Locator, url: string): Promise<void> {
    await expect(locator).toBeVisible();
    locator.click();
    await expect(page).toHaveURL(url);
  }

  /**
   * @description Clicks a "Shop now" button at a specified index.
   * The method uses the locator's nth() method to target a specific button
   * from a list of elements with the same selector.
   * @param {number} buttonIndex The zero-based index of the button to click.
   * @param {Page} page The Playwright Page object.
   * @return {Promise<void>} A promise that resolves when the button is clicked.
   * @throws {Error} If the button at the specified index is not attached to the DOM.
   * @example
   * await storeHomePage.clickShopNowButton(page, 0); // Clicks the first "Shop now" button
   */
  async clickShopNowButton(page: Page, buttonIndex: number): Promise<void> {
    const locator = this.shopNowButton.nth(buttonIndex);
    await expect(locator).toBeAttached();
    locator.click();
  }

  /**
   * @description Validates the presence and visibility of a specific picture in the carousel.
   * The method uses the locator's nth() method to target a specific picture
   * from a list of elements with the same selector.
   * @param {number} picIndex The zero-based index of the picture to validate.
   * @return {Promise<void>} A promise that resolves when the picture is validated.
   * @throws {Error} If the picture at the specified index is not attached or visible.
   * @example
   * await storeHomePage.validatePicsInCarouselByIndex(page, 0); // Validates the first picture in the carousel
   */
  async validatePicsInCarouselByIndex(picIndex: number): Promise<void> {
    console.log(`Validating picture with index: ${picIndex} in the carousel`)
    await expect(this.picsInCarousel.nth(picIndex)).toBeAttached();
    await expect(this.picsInCarousel.nth(picIndex)).toBeVisible();
  }
}
