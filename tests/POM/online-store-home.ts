import { type Page, type Locator, expect, APIRequestContext } from '@playwright/test';
import { url } from 'inspector';

export class StoreHomePage {
readonly homeMenuItem: Locator;
readonly storemenuItem: Locator;
readonly faqMenuItem: Locator;
readonly customerTestimonialsMenuItem: Locator;
readonly contactMenuItem: Locator;
elementsWithFramesMenuItem: Locator;
readonly basketMenuItem: Locator;
readonly aboutUsMenuItem: Locator;
private readonly pageHeader: Locator;
readonly shopNowButton: Locator;
private readonly welcomeSubHeader: Locator;

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
    this.welcomeSubHeader = this.page.locator('h1[class^="jw-heading"]').filter({ hasText: `Welcome to Alex's test automation site for practice` });;
}

    async gotoStoreHomePage(page: Page, request: APIRequestContext) {
        const url = 'https://free-5288352.webadorsite.com/';
        const response = await request.get(url);
        await expect(response).toBeOK();
        await page.goto(url, { waitUntil: 'commit' });
        await page.waitForURL(url, { timeout: 15000 });
        await expect(this.homeMenuItem).toBeVisible();
        await expect(this.homeMenuItem).toHaveText(" Home ");
    }

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

  async clickMenuItem(page: Page, locator: Locator, url: string) {
    await expect(locator).toBeVisible();
    locator.click();
    await expect(page).toHaveURL(url);
}

}