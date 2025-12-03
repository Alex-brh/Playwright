import { type Page, type Locator, expect, APIRequestContext } from "@playwright/test";
import { CommonlyUsedMethods } from "./commonly-used-methods";


export class ShowcasePage {
    private commonMethods: CommonlyUsedMethods;
    readonly pageHeader: Locator;
    readonly paragraphTexts: Locator;

    /**
     * Creates an instance of ShowcasePage.
     * @param {Page} page - The Playwright Page object.
     */
    constructor(public readonly page: Page) {
        // Page h2 headers (should be 5 in total on the Showcase page).
        this.pageHeader = this.page.locator('h2[class^="jw-heading"]');
        // Paragraph texts under each header (should be 12 in total right now).
        this.paragraphTexts = this.page.locator('div[class^="jw-element-imagetext-text"] > p');
        this.commonMethods = new CommonlyUsedMethods(); // Initialize it here.
    }


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

}