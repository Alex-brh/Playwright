import { test, expect } from '@playwright/test';
import { StoreHomePage } from './POM/home-page';
import { StorePage } from './POM/store-page';
import config from '../playwright.config';

// Import the `url` module to ensure it is not redundantly imported in the code.
// Note: This import is not used in the spec, so it could be removed if unnecessary.
import { url } from 'inspector';

// Determine the base URL from the Playwright configuration or use a fallback URL.
const baseURL = config.use?.baseURL ?? 'https://free-5288352.webadorsite.com/';

// Use `test.describe` to group related test cases for the "Store" page.
test.describe(`Test 'Store' page by`, () => {
    // Declare variables for the Page Object Model (POM) classes to be used in the tests.
    let storeHomePage: StoreHomePage, storePage: StorePage;

    // The `beforeEach` hook runs before every test in this `test.describe` block.
    // It's used for setting up the test environment.
    test.beforeEach(async ({ page, request }) => {
        // Initialize the POM classes with the Playwright `page` fixture.
        storeHomePage = new StoreHomePage(page);
        storePage = new StorePage(page);

        // Navigate to the store's home page using a POM method.
        await storeHomePage.gotoStoreHomePage(page, request);

        // Click the 'Store' menu item to navigate to the store page.
        // The POM method `clickMenuItem` also waits for navigation to complete.
        await storeHomePage.clickMenuItem(page, storeHomePage.storMenuItem, `${baseURL}store`);

        // Assert that the navigation to the store page was successful by checking the URL.
        await expect(page).toHaveURL(`${baseURL}store`);
    });

    // Test case for navigating to the 'Store' page and validating product headers.
    test(`validating each product header`, async ({ page }) => {
        // Define an array of test data for different products.
        // This makes the test data-driven, allowing for easy expansion and maintenance.
        const productDetails = [
            {
                // `productIndex` is used to find the product by its position in the list.
                productIndex: 0,
                // `productHref` is an optional field to find the product by its link.
                productHref: "/product/15277987/best-test-script-a",
                // `headerText` is an optional field to validate the product's header text.
                headerText: "Best test script A"
            },
            {
                productIndex: 1,
                productHref: "/product/15278051/best-test-script-b",
                headerText: "Best test script B"
            },
            {
                productIndex: 2,
                productHref: "/product/15278052/best-test-script-c",
                headerText: "Best test script C"
            },
        ];

        // Loop through each product in the `productDetails` array.
        for (const product of productDetails) {
            // Call the POM method `validateProductHeader` for each product.
            await storePage.validateProductHeader(page, product);
        }
    });

    // Test case for opening each product and validating its details on the product page.
    test(`opening a product and validating product details`, async ({ page }) => {
        // Define an array of test data for different products, including details to validate.
        const productDetails = [
            {
                productIndex: 0,
                validateProductDetails: {
                    image: "Best test script A",
                    header: "Best test script A",
                    status: "Unavailable",
                    price: "CA$0.99",
                    labelAdditionalOptions: "Additional options",
                    productList: [
                        { optionValue: 'Option A', optionText: 'Option A (+ CA$0.50)' },
                        { optionValue: 'Option B', optionText: 'Option B (+ CA$0.70)' },
                        { optionValue: 'Option C', optionText: 'Option C (+ CA$0.90)' },
                    ],
                    labelAddToCart: "Disabled",
                    addToWishlistButton: "Add to wishlist",
                    itemDescription: "\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\"",
                }
            },
            {
                productIndex: 1,
                productHref: "/product/15278051/best-test-script-b",
                validateProductDetails: {
                    image: "Best test script B",
                    header: "Best test script B",
                    status: "Unavailable",
                    price: "CA$0.89",
                    labelAddToCart: "Disabled",
                    addToWishlistButton: "Add to wishlist",
                    itemDescription: "\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\"",
                }
            },
            {
                headerText: "Best test script C",
                validateProductDetails: {
                    image: "Best test script C",
                    header: "Best test script C",
                    status: "Unavailable",
                    price: "CA$0.79",
                    labelAddToCart: "Disabled",
                    addToWishlistButton: "Add to wishlist",
                    itemDescription: "\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\"",
                }
            },
        ];

        // Loop through each product test data.
        for (const product of productDetails) {
            // Open the product page using one of the available locators (header, index, or href).
            await storePage.openProductByHeaderOrIndexOrHref(page, product);

            // Validate the product details on the opened page.
            await storePage.validateProductDetails(page, product.validateProductDetails);

            // Navigate back to the main 'Store' page.
            await storeHomePage.clickMenuItem(page, storeHomePage.storMenuItem, `${baseURL}store`);

            // Assert that the URL is correct after navigating back.
            await expect(page).toHaveURL(`${baseURL}store`);
        }
    });

    test.afterAll(async ({ page }) => {
        // Close the page after each test to ensure a clean state for the next test.
        await page.close();
    });
});
