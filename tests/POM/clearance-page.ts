import { type Page, type Locator, expect, APIRequestContext } from "@playwright/test";
import { CommonlyUsedMethods } from "./commonly-used-methods";


export class ClearancePage {
    private commonMethods: CommonlyUsedMethods;
    readonly pageHeader: Locator;
    readonly paragraphTexts: Locator;
    readonly sortByDropdown: Locator;

    /**
     * Creates an instance of ShowcasePage.
     * @param {Page} page - The Playwright Page object.
     */
    constructor(public readonly page: Page) {
        this.commonMethods = new CommonlyUsedMethods(this.page); // Initialize it here.
        // Page h2 headers (should be 2 in total on the Showcase page).
        this.pageHeader = this.page.locator('h2[class^="jw-heading"]');
        // Paragraph texts under each header (should be 12 in total right now).
        this.paragraphTexts = this.page.locator('div[class^="jw-element-imagetext-text"] > p');
        // Sort By dropdown locator
        this.sortByDropdown = this.page.locator('select[class="jw-select__input jw-element-form-input-text"]');
    }

    // **************************************************************************************************************
    /**
     * Validate the header or paragraph text on the Showcase page.
     * @param elementDetails 
     */
    async validateHeaderOrParagraphText(elementDetails: { elementLocator: Locator; elementIndex: number; elementText: string; }) {
        await this.commonMethods.validateElementText({
            elementLocator: elementDetails.elementLocator,
            elementIndex: elementDetails.elementIndex,
            elementText: elementDetails.elementText,
        });
    }
    // **************************************************************************************************************
    async selectOptionByValueLabelOrIndex(elementDetails: { elementLocator: Locator; elementIndex: number; optionValue?: string; optionLabel?: string; optionIndex?: number; }) {
        await this.commonMethods.selectOptionByValueLabelOrIndex({
            elementLocator: elementDetails.elementLocator,
            elementIndex: elementDetails.elementIndex,
            optionValue: elementDetails.optionValue,
            optionLabel: elementDetails.optionLabel,
            optionIndex: elementDetails.optionIndex,
        });
    }
    // **************************************************************************************************************

}