import { test, expect } from "@playwright/test";
import { StoreHomePage } from "./POM/home-page";
import { ShowcasePage } from "./POM/showcase-page";
import config from "../playwright.config";

// Determine the base URL from the Playwright configuration or use a fallback URL.
const baseURL = config.use?.baseURL ?? "https://free-5288352.webadorsite.com/";

test.describe(`Test online store's 'Showcase' page by`, () => {
    // Declare variables for the Page Object Model (POM) classes to be used in the tests.
    let storeHomePage: StoreHomePage, showcasePage: ShowcasePage;

    // The `beforeEach` hook runs before every test in this `test.describe` block.
    test.beforeEach(async ({ page, request }) => {
        // Initialize the POM classes with the Playwright `page` fixture.
        storeHomePage = new StoreHomePage(page);
        showcasePage = new ShowcasePage(page);

        // Navigate to the store's home page using a POM method.
        await storeHomePage.gotoStoreHomePage(page, request);

        // Click the 'Showcase' menu item to navigate to the contact page.
        await storeHomePage.clickMenuItem(page, storeHomePage.showCaseMenuItem, `${baseURL}showcase`);

        // Assert that the navigation to the contact page was successful by checking the URL.
        await expect(page).toHaveURL(`${baseURL}showcase`);
    });

    test("verifying all paragraph text contents", async ({ page }) => {
        let elementDetails = { 
            elementLocator: showcasePage.paragraphTexts, elementIndex: 0, elementText: "This is where our journey begins. Get to know our business and what we do, and how we're committed to quality and great service. Join us as we grow and succeed together. We're glad you're here to be a part of our story." };
        // Validate the presence and visibility of all form elements.
        await showcasePage.validateHeaderText(elementDetails);
    });

});