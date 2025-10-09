import { type Page, type Locator, expect, APIRequestContext } from "@playwright/test";

interface ProductDetails {
    productIndex?: number; // Optional.
    productHref?: string; // Optional.
    headerText?: string; // Optional.
}

// Define an interface for a single option object.
interface ProductOption {
    optionValue: string;
    optionText: string;
}
interface productDetailsToValidate {
    image?: string,
    header?: string;
    status?: string;
    price?: string;
    labelAdditionalOptions?: string;
    productList?: ProductOption[];
    labelAddToCart?: string;
    addToWishlistButton?: string;
    itemDescription?: string;
}

export class StorePage {
    readonly pageDisclaimer: Locator;
    readonly productHeader: Locator;

    // Product Details.
    private readonly imageUnderProductDetails: Locator;
    private readonly headerUnderProductDetails: Locator; // Best test script A.
    private readonly statusUnderProductDetails: Locator; // Available | Unavailable.
    private readonly priceUnderProductDetails: Locator; // CA$0.99.
    private readonly labelAdditionalOptionsUnderProductDetails: Locator; // Label "Additional options".
    private readonly productListUnderProductDetails: Locator; // A list of product options.
    private readonly labelAddToCartUnderProductDetails: Locator; // Label 'Add to cart' | Disabled.
    private readonly addToWishlistButtonUnderProductDetails: Locator; // Button heart to add item to cart.
    private readonly itemDescriptionUnderProductDetails: Locator; // Text representing item description.

    constructor(public readonly page: Page) {
        this.pageDisclaimer = this.page.locator('div[class="jw-tree-node jw-element jw-image-text jw-node-is-first-child"]');
        this.productHeader = this.page.locator('div[class="product__top"] > h3 > a');

        // Product Details.
        this.imageUnderProductDetails = this.page.locator('img[itemprop="image"]');
        this.headerUnderProductDetails = this.page.locator('h1[class="product-page__heading"][itemprop="name"]');
        this.statusUnderProductDetails = this.page.locator('div[class="product-sticker"]');
        this.priceUnderProductDetails = this.page.locator('span[class="product__price__price"]');
        this.labelAdditionalOptionsUnderProductDetails = this.page.locator('div[class="product__property product__property--selectbox"] > label');
        this.productListUnderProductDetails = this.page.locator('select[data-field-type="select"] > option');
        this.labelAddToCartUnderProductDetails = this.page.locator('span[class="product__add-to-cart__label"]');
        this.addToWishlistButtonUnderProductDetails = this.page.locator('button[title="Add to wishlist"]');
        this.itemDescriptionUnderProductDetails = this.page.locator('div[class="product-page__description"] > p > span');
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
        if (productIndex) {
            await expect(this.productHeader.nth(productIndex)).toBeAttached();
        }
        if (productHref && productIndex) {
            await expect(this.productHeader.nth(productIndex)).toHaveAttribute("href", productHref);
        }
        if (headerText && productIndex) {
            await expect(this.productHeader.nth(productIndex)).toHaveText(headerText);
        }
    }

    /**
     * Opens a product by clicking on its header, identified by index, header text, or href.
     * It first determines the most specific locator based on the provided `productDetails`.
     * If `productIndex` is given, it finds the element by index. If `productHref` is also
     * provided, it verifies the href attribute for that element. Otherwise, it uses `headerText`
     * as the primary identifier. An error is thrown if neither `productIndex` nor `headerText`
     * is specified.
     *
     * @param {Page} page The Playwright Page object.
     * @param {ProductDetails} productDetails An object containing optional properties to identify the product.
     * @param {number} [productDetails.productIndex] The zero-based index of the product header.
     * @param {string} [productDetails.productHref] The expected href attribute value of the product header. Used for validation when `productIndex` is provided.
     * @param {string} [productDetails.headerText] The text content of the product header.
     * @example
     * // Open the product with the header text "Featured Product"
     * await openProductByHeaderOrIndexOrHref(page, { headerText: "Featured Product" });
     *
     * @example
     * // Open the second product in the list (index 1)
     * await openProductByHeaderOrIndexOrHref(page, { productIndex: 1 });
     *
     * @example
     * // Open the third product (index 2) and validate its href
     * await openProductByHeaderOrIndexOrHref(page, { productIndex: 2, productHref: "/products/item-three" });
     */
    async openProductByHeaderOrIndexOrHref(page: Page, productDetails: ProductDetails) {
        const { productIndex, productHref, headerText } = productDetails;

        let productLocator = this.productHeader;

        if (productIndex !== undefined) {
            // Find by index.
            productLocator = productLocator.nth(productIndex);

            if (productHref) {
                // Validate href when provided.
                await expect(productLocator).toHaveAttribute("href", productHref);
            }
        } else if (headerText) {
            // Find by header text.
            productLocator = productLocator.filter({ hasText: headerText });
        } else {
            throw new Error("Make sure productIndex or headerText is provided for each peoduct.");
        }
        // Assert that exactly one element matches the final locator before clicking.
        await expect(productLocator).toHaveCount(1);
        await productLocator.click();
    }

    async validateProductDetails(page: Page, validateProductDetails: productDetailsToValidate) {
        const {
            image,
            header,
            status,
            price,
            labelAdditionalOptions,
            productList,
            labelAddToCart,
            addToWishlistButton,
            itemDescription,
        } = validateProductDetails;


        if (image !== undefined && image !== null) {
            await expect(this.imageUnderProductDetails).toHaveAttribute("alt", image);
        }
        if (header !== undefined && header !== null) {
            await expect(this.headerUnderProductDetails).toHaveText(header);
        }
        if (status !== undefined && status !== null) {
            await expect(this.statusUnderProductDetails).toHaveText(status);
        }
        if (price !== undefined && price !== null) {
            await expect(this.priceUnderProductDetails).toHaveText(price);
        }
        if (labelAdditionalOptions !== undefined && labelAdditionalOptions !== null) {
            await expect(this.labelAdditionalOptionsUnderProductDetails).toHaveText(labelAdditionalOptions);
        }
        if (productList !== undefined && productList !== null) {
            for(let i=0; i<productList.length; i++) {
                await expect(this.productListUnderProductDetails.nth(i)).toHaveText(productList[i].optionText);
            }
        }
        if (labelAddToCart !== undefined && labelAddToCart !== null) {
            await expect(this.labelAddToCartUnderProductDetails).toHaveText(labelAddToCart);
        }
        if (addToWishlistButton !== undefined && addToWishlistButton !== null) {
            await expect(this.addToWishlistButtonUnderProductDetails).toHaveAttribute("title", addToWishlistButton);
        }
        if (itemDescription !== undefined && itemDescription !== null) {
            await expect(this.itemDescriptionUnderProductDetails).toHaveText(itemDescription);
        }


    }
}