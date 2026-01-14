import { type Page, type Locator, expect, APIRequestContext } from "@playwright/test";
import config from '../../playwright.config';
const baseURL = config.use?.baseURL ?? 'https://free-5288352.webadorsite.com/';

export class ElementsWithFramesPage {
  readonly buttonTypeHere: Locator;
  readonly allFrames: Locator;
  readonly firstFrameBody: Locator;

  constructor(public readonly page: Page) {
    this.buttonTypeHere = this.page.locator('div[class="jw-btn-caption"]');
    this.allFrames = this.page.locator('div[class="iframely-embed"] > div');
    this.firstFrameBody = this.page.locator('div[class="iframely-embed"]').nth(0).locator('div > div[class="body"]').nth(0);
  }
  async validateIframeCount(expectedCount = 0) {
    const count = await this.allFrames.count();
    expect(count).toEqual(expectedCount);
  }

  async validateFirstFrameHasContent() {
    await expect(this.firstFrameBody).toBeAttached();
    const bodyText = await this.firstFrameBody.innerText();
    expect(bodyText.length).toBeGreaterThan(0);
  }
}
