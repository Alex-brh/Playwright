import {type Page,type Locator, expect, APIRequestContext} from "@playwright/test";
import { url } from "inspector";

export class StoreHomePage {
  readonly homeMenuItem: Locator;
  readonly storemenuItem: Locator;
  readonly faqMenuItem: Locator;
  readonly customerTestimonialsMenuItem: Locator;
  readonly contactMenuItem: Locator;
  elementsWithFramesMenuItem: Locator;
  readonly basketMenuItem: Locator;
  readonly aboutUsMenuItem: Locator;
  readonly pageHeader: Locator;
  readonly shopNowButton: Locator;
  readonly pageSubHeader: Locator;
  readonly picsInCarousel: Locator;

  constructor(public readonly page: Page) {
    this.homeMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/"]');
    this.storemenuItem = this.page.locator('a[class^="jw-menu-link"][href="/store"] > span');
    this.faqMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/faq"] > span');
    this.customerTestimonialsMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/customer-testimonials"] > span');
    this.contactMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/contact"] > span');
    this.elementsWithFramesMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/elements-with-frames"] > span');
    this.basketMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/cart"] > span').nth(0);
    this.aboutUsMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/contact"] > span');
    this.pageHeader = this.page.locator('div[class="jw-slideshow-title"]');
    this.shopNowButton = this.page.locator('a[href="/store"] > div');
    this.pageSubHeader = this.page.locator('h1[class^="jw-heading"]'); //.filter({hasText: `Welcome to Alex's test automation site for practice`});
    this.picsInCarousel = this.page.locator('div[class^="jw-intent jw-element-image jw-element-child"]');
  }

  /**
   * Navigates to the store's home page, validates the initial API call,
   * and asserts the presence of the Home menu item.
   * This method handles common navigation and initial page state checks.
   *
   * @param {Page} page The Playwright Page object.
   * @param {APIRequestContext} request The Playwright APIRequestContext fixture.
   */
  async gotoStoreHomePage(page: Page, request: APIRequestContext) {
    const url = "https://free-5288352.webadorsite.com/";
    const response = await request.get(url);
    await expect(response).toBeOK();
    await page.goto(url, { waitUntil: "commit" });
    await page.waitForURL(url, { timeout: 15000 });
    await expect(this.homeMenuItem).toBeVisible();
    await expect(this.homeMenuItem).toHaveText(" Home ");
  }
  /**
   * Validates the visibility of all menu items on the navigation bar.
   * This method contains a series of assertions to ensure each menu item is present
   * and visible to the user.
   *
   * @param {void} - No parameters are required as the method uses class properties.
   */
  async validateAllMenuItemsPresence() {
    await expect(this.homeMenuItem).toBeVisible();
    await expect(this.storemenuItem).toBeVisible();
    await expect(this.faqMenuItem).toBeVisible();
    await expect(this.customerTestimonialsMenuItem).toBeVisible();
    await expect(this.contactMenuItem).toBeVisible();
    await expect(this.elementsWithFramesMenuItem).toBeVisible();
    await expect(this.basketMenuItem).toBeVisible();
    await expect(this.aboutUsMenuItem).toBeVisible();
  }

  /**
   * Clicks a specified locator and waits for the page URL to change.
   * This method handles the common pattern of clicking a link that triggers a navigation.
   *
   * @param {Page} page The Playwright Page object.
   * @param {Locator} locator The Locator for the element to be clicked.
   * @param {string} url The expected URL string or URL pattern after the click.
   */
  async clickMenuItem(page: Page, locator: Locator, url: string) {
    await expect(locator).toBeVisible();
    locator.click();
    await expect(page).toHaveURL(url);
  }

  /**
   * Clicks a "Shop now" button at a specified index.
   * The method uses the locator's nth() method to target a specific button
   * from a list of elements with the same selector.
   *
   * @param {Page} page The Playwright Page object.
   * @param {number} buttonIndex The zero-based index of the button to click.
   */
  async clickShopNowButton(page: Page, buttonIndex: number) {
    const locator = this.shopNowButton.nth(buttonIndex);
    await expect(locator).toBeVisible();
    locator.click();
  }

  async validatePicsInCarouselByIndex(page: Page, picIndex: number) {
    console.log(`Validating picture with index: ${picIndex} in the carousel`)
    await expect(this.picsInCarousel.nth(picIndex)).toBeAttached();
    await expect(this.picsInCarousel.nth(picIndex)).toBeVisible();
  }
}
