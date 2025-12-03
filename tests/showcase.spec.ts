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

    test("verifying all paragraph text contents", async () => {
        // Validate that there are 12 paragraph texts on the Showcase page.
        await expect(showcasePage.paragraphTexts).toHaveCount(12);
        let elementDetails = [
            {
                elementLocator: showcasePage.paragraphTexts, elementIndex: 0, elementText: "This is where our journey begins. Get to know our business and what we do, and how we're committed to quality and great service. Join us as we grow and succeed together. We're glad you're here to be a part of our story."
            },
            {
                elementLocator: showcasePage.paragraphTexts, elementIndex: 1, elementText: "Driven by passion",
            },
            {
                elementLocator: showcasePage.paragraphTexts, elementIndex: 2, elementText: "This is where our journey begins. Get to know our business and what we do, and how we're committed to quality and great service. Join us as we grow and succeed together. We're glad you're here to be a part of our story.",
            },
            {
                elementLocator: showcasePage.paragraphTexts, elementIndex: 3, elementText: "Focused on clients",
            },
            {
                elementLocator: showcasePage.paragraphTexts, elementIndex: 4, elementText: "This is where our journey begins. Get to know our business and what we do, and how we're committed to quality and great service. Join us as we grow and succeed together. We're glad you're here to be a part of our story.",
            },
            {
                elementLocator: showcasePage.paragraphTexts, elementIndex: 5, elementText: "Quality and speed",
            },
            {
                elementLocator: showcasePage.paragraphTexts, elementIndex: 6, elementText: "This is where our journey begins. Get to know our business and what we do, and how we're committed to quality and great service. Join us as we grow and succeed together. We're glad you're here to be a part of our story.",
            },
            {
                elementLocator: showcasePage.paragraphTexts, elementIndex: 7, elementText: "We pride ourselves on our adaptability and commitment to excellence in every aspect of our service. Explore what we have to offer and how we can contribute to your success.",
            },
            {
                elementLocator: showcasePage.paragraphTexts, elementIndex: 8, elementText: "Discover our collection of creative work and visual projects. Each piece showcases our attention to detail and commitment to delivering results that exceed expectations.",
            },
            {
                elementLocator: showcasePage.paragraphTexts, elementIndex: 9, elementText: "Don't miss out on the chance to save while enjoying the quality and service you love. Keep an eye on this space for the latest updates and grab these amazing deals while they last!",
            },
            {
                elementLocator: showcasePage.paragraphTexts, elementIndex: 10, elementText: "Our carefully curated selection of products is designed to cater to your specific needs and preferences. Each item in our collection represents our commitment to quality, functionality, and style. Browse through our offerings to find detailed descriptions, features, and specifications that help you make informed choices. Whether you're looking for everyday essentials, specialized items, or something unique, we have something to suit every taste and requirement.",
            },
            {
                elementLocator: showcasePage.paragraphTexts, elementIndex: 11, elementText: "DISCLAIMER: This is NOT a real e-comm website. It's being used for educational purposes ONLY. No items can be purchased and/or delivered through this website.",
            },
        ]
        // Validate the presence and correctness of all paragraphs on the page.
        for (let i = 0; i < elementDetails.length; i++) {
            await showcasePage.validateHeaderText(elementDetails[i]);
        }
    });

});