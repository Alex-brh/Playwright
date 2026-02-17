import { test, expect } from '@playwright/test';
import { StoreHomePage } from './POM/home-page';
import { CustomerTestimonials } from './POM/customer-testimonials';
import config from '../playwright.config';

// Determine the base URL from the Playwright configuration or use a fallback URL.
const baseURL = config.use?.baseURL ?? 'https://free-5288352.webadorsite.com/';

// Group related test cases for the "Store" page.
test.describe(`Test 'Customer Testimonials' page by`, () => {
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

    test(`validating the customer testimonials content`, async () => {
        const testimonials = [
            { expectedTestimonialsCount: 7, index: 0, expectedTestimonialsText: `"I can't say enough about the outstanding service I received from your company. Their team went above and beyond to meet our needs and exceeded our expectations."` },
            { expectedTestimonialsCount: 7, index: 1, expectedTestimonialsText: `Benjamin Thistlewood` },
            { expectedTestimonialsCount: 7, index: 2, expectedTestimonialsText: `"I can't say enough about the outstanding service I received from your company. Their team went above and beyond to meet our needs and exceeded our expectations."` },
            { expectedTestimonialsCount: 7, index: 3, expectedTestimonialsText: `Emma Thompson` },
            { expectedTestimonialsCount: 7, index: 4, expectedTestimonialsText: `"I can't say enough about the outstanding service I received from your company. Their team went above and beyond to meet our needs and exceeded our expectations."` },
            { expectedTestimonialsCount: 7, index: 5, expectedTestimonialsText: `Oliver Hartman` },
            { expectedTestimonialsCount: 7, index: 6, expectedTestimonialsText: `DISCLAIMER: This is NOT a real e-comm website. It's being used for educational purposes ONLY. No items can be purchased and/or delivered through this website.` },
        ];
        for (const testimonial of testimonials) {
            await customerTestimonials.validateCustomerTestimonialsVisible(testimonial);
        }

    });

    test('validating errors on "Submit comment" without filling the form', async ({ page }) => {
        // Click the 'Submit comment' button without filling the form.
        await customerTestimonials.validateSubmitCommentErrors();
    });

    test('validating comments are present', async () => {
        const comments = [
            { comment: `Great service! Grat products! Great prices!`, index: 0 },
            { comment: `Great service overall`, index: 1 },
        ];
        for (const comment of comments) {
            await customerTestimonials.validateCustomerCommentVisible(comment);
        }
    });

    test('validating the Customer Testimonials page title', async ({ page }) => {
        const expectedTitle = 'Customer testimonials | Online store';
        await expect(page).toHaveTitle(expectedTitle);
    });

});