import {type Page,type Locator, expect, APIRequestContext} from "@playwright/test";

interface ProductDetails {
    productIndex: number;
    productHref?: string; // Optional.
    headerText?: string; // Optional.
  }

export class StorePage {
  readonly pageDisclaimer: Locator;
  readonly productHeader: Locator;

  constructor(public readonly page: Page) {
    this.pageDisclaimer = this.page.locator('div[class="jw-tree-node jw-element jw-image-text jw-node-is-first-child"]');
    this.productHeader = this.page.locator('div[class="product__top"] > h3 > a');
  }

  async validateProductHeader(page: Page, productDetails: ProductDetails) {
    const { productIndex, productHref, headerText } = productDetails; // Interface defined above.
    await expect(this.productHeader.nth(productIndex)).toBeAttached();
    if(productHref) {
        await expect(this.productHeader.nth(productIndex)).toHaveAttribute("href", productHref);
    }
    if(headerText) {
    await expect(this.productHeader.nth(productIndex)).toHaveText(headerText);
    }
  }
}