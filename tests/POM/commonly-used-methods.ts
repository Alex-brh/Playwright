import {type Page,type Locator, expect, APIRequestContext} from "@playwright/test";

interface ElementDetails {
    elementIndex?: number; // Optional.
    elementHref?: string; // Optional.
    elementText?: string; // Optional.
    elementLocator: Locator; // Required.
}

export class CommonlyUsedMethods {


async validateElementText(page: Page, elementDetails: ElementDetails) {
    const { elementIndex, elementHref, elementText, elementLocator } = elementDetails;
    
    if (elementIndex !== undefined && elementIndex !== null) {
        console.log(`Validating element: [${elementLocator}] at index: ${elementIndex}`);
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

}