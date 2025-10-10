import { test, expect } from '@playwright/test';
import { StoreHomePage } from './POM/home-page';
import { FaqPage } from './POM/faq-page';
import config from '../playwright.config';

// Determine the base URL from the Playwright configuration or use a fallback URL.
const baseURL = config.use?.baseURL ?? 'https://free-5288352.webadorsite.com/';

// Use `test.describe` to group related test cases for the "Store" page.
test.describe(`Test online store 'FAQ' page by`, () => {
    // Declare variables for the Page Object Model (POM) classes to be used in the tests.
    let storeHomePage: StoreHomePage, faqPage: FaqPage;

    // The `beforeEach` hook runs before every test in this `test.describe` block.
    test.beforeEach(async ({ page, request }) => {
        // Initialize the POM classes with the Playwright `page` fixture.
        storeHomePage = new StoreHomePage(page);
        faqPage = new FaqPage(page);

        // Navigate to the store's home page using a POM method.
        await storeHomePage.gotoStoreHomePage(page, request);

        // Click the 'FAQ' menu item to navigate to the 'FAQ' page.
        // The POM method `clickMenuItem` also waits for navigation to complete.
        await storeHomePage.clickMenuItem(page, storeHomePage.faqMenuItem, `${baseURL}faq`);

        // Assert that the navigation to the 'FAQ' page was successful by checking the URL.
        await expect(page).toHaveURL(`${baseURL}faq`);
    });

    test(`validating its overall appearance`, async ({ page }) => {
        const questionAnswerAndDisclaimer = {
            questionAndAnswer: "Q: What is this website all about?A: It's not a real e-comm website. It's a demo site for educational purposes ONLY! No real items can be purchased or/and delivered here.",
            bottomDisclaimer: "DISCLAIMER: This is NOT a real e-comm website. It's being used for educational purposes ONLY. No items can be purchased and/or delivered through this website."
        }
        await faqPage.validateTopQuestionAnswer(questionAnswerAndDisclaimer);

        // Validate the image presence.
        await expect(faqPage.image).toBeVisible();

        // Validate all h3 headers text.
        const h3Labels = [
            { index: 0, text: "Frequently asked question" },
            { index: 1, text: "Service example" },
            { index: 2, text: "Overview" }
        ];
        for (const h3Label of h3Labels) {
            console.log(`Validating h3 label: ${h3Label.text}`);
            await faqPage.validateH3Text(h3Label);
            console.log(`Successful validation of h3 label: ${h3Label.text}`);
        }
    });

    test(`expanding h3 sections and validating text content inside`, async ({ page }) => {
        // Validate each expanded section text.
        const sectionsText = [
            { index: 0, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
            { index: 1, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
            { index: 2, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." }
        ];
        for (const sectionText of sectionsText) {
            console.log(`Validating section with index: ${sectionText.index} and text: ${sectionText.text}`);
        await faqPage.expandSectionAndValidateText(sectionText);
        }

    });


});