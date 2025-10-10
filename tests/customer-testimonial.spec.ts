import { test, expect } from '@playwright/test';
import { StoreHomePage } from './POM/home-page';
import { CustomerTestimonials } from './POM/customer-testimonials';
import config from '../playwright.config';

// Determine the base URL from the Playwright configuration or use a fallback URL.
const baseURL = config.use?.baseURL ?? 'https://free-5288352.webadorsite.com/';

// Group related test cases for the "Store" page.
test.describe(`Test online store 'Customer Testimonials' page by`, () => {
    // Declare variables for the Page Object Model (POM) classes to be used in the tests.
    let storeHomePage: StoreHomePage, customerTestimonials: CustomerTestimonials;

    // Run before every test in this `test.describe` block.
    test.beforeEach(async ({ page, request }) => {
        // Initialize the POM classes with the Playwright `page` fixture.
        storeHomePage = new StoreHomePage(page);
        customerTestimonials = new CustomerTestimonials(page);

        // Navigate to the store's home page using a POM method.
        await storeHomePage.gotoStoreHomePage(page, request);

        // Click the 'Customer Testimonials' menu item to navigate to the 'Customer Testimonials' page.
        await storeHomePage.clickMenuItem(page, storeHomePage.customerTestimonialsMenuItem, `${baseURL}customer-testimonials`);

        // Assert that the navigation to the 'Customer Testimonials' page was successful by checking the URL.
        await expect(page).toHaveURL(`${baseURL}customer-testimonials`);
    });

    test(`validating its overall appearance`, async ({ page }) => {
        console.log(`Reached the first test block.`);
    });
});