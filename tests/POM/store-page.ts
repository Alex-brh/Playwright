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
/**
 * Validates the header of a product element on the page, asserting its existence,
 * and optionally its `href` and text content.
 *
 * @async
 * @param {Page} page The Playwright `page` object.
 * @param {ProductDetails} productDetails An object containing the details for validation.
 * @param {number} productDetails.productIndex The index of the product element to validate.
 * @param {string} [productDetails.productHref] The expected `href` attribute value of the header. Optional.
 * @param {string} [productDetails.headerText] The expected text content of the header. Optional.
 *
 * @example
 * // Example with optional href and text content validation
 * await this.validateProductHeader(page, {
 *   productIndex: 0,
 *   productHref: '/products/item-a',
 *   headerText: 'Product A'
 * });
 *
 * @example
 * // Example with only header existence and index validation
 * await this.validateProductHeader(page, {
 *   productIndex: 1
 * });
 */
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