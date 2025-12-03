import { type Page, type Locator, expect, APIRequestContext } from "@playwright/test";
import { CommonlyUsedMethods } from "./commonly-used-methods";


export class ShowcasePage {
    private commonMethods: CommonlyUsedMethods;
    readonly pageHeader: Locator;
    readonly paragraphTexts: Locator;
    readonly showcasePageImage: Locator;
    readonly exploreProductsButton: Locator;

    /**
     * Creates an instance of ShowcasePage.
     * @param {Page} page - The Playwright Page object.
     */
    constructor(public readonly page: Page) {
        // Page h2 headers (should be 5 in total on the Showcase page).
        this.pageHeader = this.page.locator('h2[class^="jw-heading"]');
        // Paragraph texts under each header (should be 12 in total right now).
        this.paragraphTexts = this.page.locator('div[class^="jw-element-imagetext-text"] > p');
        // Showcase page images.
        this.showcasePageImage = this.page.locator('picture[class^="jw-element-image__image-wrapper"] > img');
        // 'Explore products' button on the Showcase page.
        this.exploreProductsButton = this.page.locator('a[class^="jw-element-content"][title="Store"]', { hasText: 'Explore products' });
        this.commonMethods = new CommonlyUsedMethods(); // Initialize it here.
    }

    // **************************************************************************************************************
    /**
     * Validate the header and paragraph text on the Showcase page.
     * @param elementDetails 
     */
    async validateHeaderText(elementDetails: { elementLocator: Locator; elementIndex: number; elementText: string; }) {
        await this.commonMethods.validateElementText({
            elementLocator: elementDetails.elementLocator,
            elementIndex: elementDetails.elementIndex,
            elementText: elementDetails.elementText,
        });
    }
    // **************************************************************************************************************
    /**
     * Validate an element attribute base on elementLocator, elementIndex, attributeName, and attributeValue
     * @param elementDetails: elementLocator, elementIndex, attributeName, and attributeValue
     */
    async validateElemAttribute(elementDetails: { elementLocator: Locator; elementIndex: number; attributeName: string; attributeValue: string; }) {
        await this.commonMethods.validateElementAttribute({
            elementLocator: elementDetails.elementLocator,
            elementIndex: elementDetails.elementIndex,
            attributeName: elementDetails.attributeName,
            attributeValue: elementDetails.attributeValue,
        });
    }
    // **************************************************************************************************************
}