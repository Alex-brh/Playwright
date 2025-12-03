import { type Page, type Locator, expect, APIRequestContext } from "@playwright/test";
import { error } from "console";

interface ElementDetails {
    elementLocator: Locator; // Required.
    elementIndex?: number; // Optional.
    elementHref?: string; // Optional.
    elementText?: string; // Optional.
    attributeName?: string; // Optional.
    attributeValue?: string; // Optional.
}

export class CommonlyUsedMethods {
// **************************************************************************************************************
    /**
     * Validates element properties including href attribute, and text content.
     * This utility method scrolls the element into view and performs multiple assertions
     * based on the provided element details.
     *
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
                await expect(elementLocator.nth(elementIndex)).toHaveAttribute("href", elementHref);
            }

            if (elementText !== undefined && elementText !== null) {
                console.log(`Validating text content: ${elementText}`);
                await expect(elementLocator.nth(elementIndex)).toHaveText(elementText);
            }
        }
    }
    // **************************************************************************************************************
    /**
     * Validates element attributes by scrolling into view and verifying attribute values.
     * This utility method requires elementLocator, elementIndex, attributeName, and attributeValue
     * to be provided. It will log an error if any required parameters are missing.
     *
     * @param {ElementDetails} elementDetails - An object containing element validation details.
     * @param {Locator} elementDetails.elementLocator - Required Locator pointing to the element(s) to validate.
     * @param {number} elementDetails.elementIndex - Required index of the element to validate (uses nth selector).
     * @param {string} elementDetails.attributeName - Required name of the attribute to validate.
     * @param {string} elementDetails.attributeValue - Required expected value of the attribute.
     *
     * @returns {Promise<void>}
     *
     * @example
     * // Example 1: Validate data-testid attribute on an image element
     * await commonMethods.validateElementAttribute({
     *   elementLocator: showcasePage.images,
     *   elementIndex: 0,
     *   attributeName: "data-testid",
     *   attributeValue: "showcase-image-1"
     * });
     *
     * @example
     * // Example 2: Validate src attribute on a link element
     * await commonMethods.validateElementAttribute({
     *   elementLocator: page.locator('img[class="product-image"]'),
     *   elementIndex: 2,
     *   attributeName: "src",
     *   attributeValue: "https://example.com/images/product.jpg"
     * });
     */
    async validateElementAttribute(elementDetails: ElementDetails): Promise<void> {
        const { elementIndex, elementLocator, attributeName, attributeValue } = elementDetails;
        if (elementLocator !== undefined && elementLocator !== null &&
            elementIndex !== undefined && elementIndex !== null &&
            attributeName !== undefined && attributeName !== null &&
            attributeValue !== undefined && attributeValue !== null) {
            console.log(`Validating element: [${elementLocator}] at index: ${elementIndex} for attribute: ${attributeName} with value: ${attributeValue}`);
            // Scroll the element into view, but only if it's not already visible.
            await elementLocator.nth(elementIndex).scrollIntoViewIfNeeded();
            await expect(elementLocator.nth(elementIndex)).toBeAttached();
            console.log(`Validating attribute: ${attributeName} with attribute value: ${attributeValue}`);
            await expect(elementLocator.nth(elementIndex)).toHaveAttribute(attributeName, attributeValue);
        }
        else {
            console.error(`Missing required parameters. Please provide: elementLocator, elementIndex, attributeName, and attributeValue.`);
        }
    }
    // **************************************************************************************************************

}