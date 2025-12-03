import { type Page, type Locator, expect, APIRequestContext } from "@playwright/test";

interface ElementDetails {
    elementIndex?: number; // Optional.
    elementHref?: string; // Optional.
    elementText?: string; // Optional.
    elementLocator: Locator; // Required.
}

export class CommonlyUsedMethods {

    /**
     * Validates element properties including href attribute, and text content.
     * This utility method scrolls the element into view and performs multiple assertions
     * based on the provided element details.
     *
     * @param {Page} page - The Playwright Page object.
     * @param {ElementDetails} elementDetails - An object containing element validation details.
     * @param {number} [elementDetails.elementIndex] - Optional index of the element to validate (uses nth selector).
     * @param {string} [elementDetails.elementHref] - Optional href attribute value to validate.
     * @param {string} [elementDetails.elementText] - Optional text content to validate.
     * @param {Locator} elementDetails.elementLocator - Required Locator pointing to the element(s) to validate.
     *
     * @returns {Promise<void>}
     *
     * @example
     * // Example 1: Validate element exists and has specific text
     * await commonMethods.validateElementText(page, {
     *   elementIndex: 0,
     *   elementText: "Welcome to our site",
     *   elementLocator: showcasePage.paragraphTexts
     * });
     *
     * @example
     * // Example 2: Validate link with href and text
     * await commonMethods.validateElementText(page, {
     *   elementIndex: 2,
     *   elementHref: "/products/item-a",
     *   elementText: "Product A",
     *   elementLocator: page.locator('a[class="product-link"]')
     * });
     */
    async validateElementText(elementDetails: ElementDetails): Promise<void> {
        const { elementIndex, elementHref, elementText, elementLocator } = elementDetails;

        if (elementIndex !== undefined && elementIndex !== null) {
            console.log(`Validating element: [${elementLocator}] at index: ${elementIndex}`);
            // Scroll the element into view, but only if it's not already visible.
            await elementLocator.nth(elementIndex).scrollIntoViewIfNeeded();
            await expect(elementLocator.nth(elementIndex)).toBeAttached();

            if (elementHref !== undefined && elementHref !== null) {
                console.log(`Validating href attribute: ${elementHref}`);
                // Scroll the element into view, but only if it's not already visible.
                await elementLocator.nth(elementIndex).scrollIntoViewIfNeeded();
                await expect(elementLocator.nth(elementIndex)).toHaveAttribute("href", elementHref);
            }

            if (elementText !== undefined && elementText !== null) {
                console.log(`Validating text content: ${elementText}`);
                // Scroll the element into view, but only if it's not already visible.
                await elementLocator.nth(elementIndex).scrollIntoViewIfNeeded();
                await expect(elementLocator.nth(elementIndex)).toHaveText(elementText);
            }
        }
    }

}