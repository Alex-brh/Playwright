import { test, expect } from '@playwright/test';
import { StoreHomePage } from './POM/home-page';
import { FaqPage } from './POM/faq-page';
import config from '../playwright.config';

// Determine the base URL from the Playwright configuration or use a fallback URL.
const baseURL = config.use?.baseURL ?? 'https://free-5288352.webadorsite.com/';

// Use `test.describe` to group related test cases for the "Store" page.
test.describe(`Test online store 'FAQ' page by`, () => {
    // Declare variables for the Page Object Model (POM) classes to be used in the tests.
    let storeHomePage: StoreHomePage;

    // The `beforeEach` hook runs before every test in this `test.describe` block.
    test.beforeEach(async ({ page, request }) => {
        // Initialize the POM classes with the Playwright `page` fixture.
        storeHomePage = new StoreHomePage(page);

        // Navigate to the store's home page using a POM method.
        await storeHomePage.gotoStoreHomePage(page, request);

        // Click the 'FAQ' menu item to navigate to the 'FAQ' page.
        // The POM method `clickMenuItem` also waits for navigation to complete.
        await storeHomePage.clickMenuItem(page, storeHomePage.faqMenuItem, `${baseURL}faq`);

        // Assert that the navigation to the 'FAQ' page was successful by checking the URL.
        await expect(page).toHaveURL(`${baseURL}faq`);
    });

    test(`validating its overall appearance`, async ({ page }) => {
        console.log(`First test block`);
    });
});