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

async gotoElementsWithFramesPage(page: Page, request: APIRequestContext) {
  const url = `${baseURL}elements-with-frames`;
  // Perform and verify API setup immediately
  const response = await request.post("https://plausible.io/api/event");
  await expect(response).toBeOK(); 
  // Navigate with standard 'load' or 'domcontentloaded' (safer than 'commit')
  await page.goto(url, { waitUntil: "domcontentloaded" });
  // Use a resilient locator instead of .nth(1)
  const targetButton = this.buttonTypeHere.nth(1); 
  await expect(targetButton).toBeVisible();
}


  async validateIframeCount(expectedCount = 0) {
    const count = await this.allFrames.count();
    await expect(count).toEqual(expectedCount);
  }

  async validateFirstFrameHasContent() {
    await expect(this.firstFrameBody).toBeAttached();
    const bodyText = await this.firstFrameBody.innerText();
    await expect(bodyText.length).toBeGreaterThan(0);
  }
}
