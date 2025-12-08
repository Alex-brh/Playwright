import { test, expect } from "@playwright/test";
import { StoreHomePage } from "./POM/home-page";
import { ClearancePage } from "./POM/clearance-page";
import config from "../playwright.config";

// Determine the base URL from the Playwright configuration or use a fallback URL.
const baseURL = config.use?.baseURL ?? "https://free-5288352.webadorsite.com/";

test.describe(`Test online store's 'Clearance' page by`, () => {
    // Declare variables for the Page Object Model (POM) classes to be used in the tests.
    let storeHomePage: StoreHomePage, clearancePage: ClearancePage;

    // The `beforeEach` hook runs before every test in this `test.describe` block.
    test.beforeEach(async ({ page, request }) => {
        // Initialize the POM classes with the Playwright `page` fixture.
        storeHomePage = new StoreHomePage(page);
        clearancePage = new ClearancePage(page);

        // Navigate to the store's home page using a POM method.
        await storeHomePage.gotoStoreHomePage(page, request);

        // Click the 'Clearance' menu item to navigate to the contact page.
        await storeHomePage.clickMenuItem(page, storeHomePage.clearanceMenuItem, `${baseURL}clearance`);

        // Assert that the navigation to the contact page was successful by checking the URL.
        await expect(page).toHaveURL(`${baseURL}clearance`);
    });

    test("validating the header and paragraph texts on the 'Clearance' page", async () => {
        // Validate that there are 2 headers on the Clearance page.
        await expect(clearancePage.pageHeader).toHaveCount(2);
        // Validate that there are 4 paragraph texts on the Clearance page.
        await expect(clearancePage.paragraphTexts).toHaveCount(4);
        // Validate the header and paragraph texts on the 'Clearance' page.
         let elementDetails = [
            {
                elementLocator: clearancePage.pageHeader, elementIndex: 0, elementText: "Clearance items"
            },
            {
                elementLocator: clearancePage.pageHeader, elementIndex: 1, elementText: "Information",
            },
            {
                elementLocator: clearancePage.paragraphTexts, elementIndex: 0, elementText: "Behind every service we provide is a dedicated team of professionals, each bringing their unique expertise and enthusiasm to our business.",
            },
            {
                elementLocator: clearancePage.paragraphTexts, elementIndex: 1, elementText: "We pride ourselves on our adaptability and commitment to excellence in every aspect of our service. Explore what we have to offer and how we can contribute to your success.",
            },
              {
                elementLocator: clearancePage.paragraphTexts, elementIndex: 2, elementText: "This is where our journey begins. Get to know our business and what we do, and how we're committed to quality and great service. Join us as we grow and succeed together. We're glad you're here to be a part of our story.",
            },
            {
                elementLocator: clearancePage.paragraphTexts, elementIndex: 3, elementText: "DISCLAIMER: This is NOT a real e-comm website. It's being used for educational purposes ONLY. No items can be purchased and/or delivered through this website.",
            }
        ];
        for (let i = 0; i < elementDetails.length; i++) { 
            await clearancePage.validateHeaderOrParagraphText(elementDetails[i]);
        }
    });

});