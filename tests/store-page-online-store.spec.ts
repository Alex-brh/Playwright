import { test, expect } from '@playwright/test';
import { StoreHomePage } from './POM/home-page';
import { StorePage } from './POM/store-page';
import config from '../playwright.config';
import { url } from 'inspector';

const baseURL = config.use?.baseURL ?? 'https://free-5288352.webadorsite.com/';

test.describe(`Test online store 'Store' page by`, () => {
    let storeHomePage: StoreHomePage, storePage: StorePage;

    // Request both `page` and `request` fixtures here
    test.beforeEach(async ({ page, request }) => {
        storeHomePage = new StoreHomePage(page);
        storePage = new StorePage(page);
        await storeHomePage.gotoStoreHomePage(page, request);
    });

    test(`navigating to the 'Store' page and validating product headers`, async ({ page }) => {
        await storeHomePage.clickMenuItem(page, storeHomePage.storMenuItem, `${baseURL}store`);
        await expect(page).toHaveURL(`${baseURL}store`);
        const productDetails = [
            {
                productIndex: 0,
                productHref: "/product/15277987/best-test-script-a", // Optional.
                headerText: "Best test script A" // Optional.
            },
            {
                productIndex: 1,
                productHref: "/product/15278051/best-test-script-b", // Optional.
                headerText: "Best test script B" // Optional.
            },
            {
                productIndex: 2,
                productHref: "/product/15278052/best-test-script-c", // Optional.
                headerText: "Best test script C" // Optional.
            },];
        for (const product of productDetails) {
            await storePage.validateProductHeader(page, product)
        }
    });

    test(`opening a product and validating product details`, async ({ page }) => {
        let i = 0;
        await storeHomePage.clickMenuItem(page, storeHomePage.storMenuItem, `${baseURL}store`);
        await expect(page).toHaveURL(`${baseURL}store`);
        const validateProductDetails = [
            {
                image: "Best test script A",
                header: "Best test script A",
                status: "Unavailable",
                price: "CA$0.99",
                labelAdditionalOptions: "Additional options",
                // productList: "",
                labelAddToCart: "Disabled",
                addToWishlistButton: "Add to wishlist",
                itemDescription: "\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\"",
            },
            {
                image: "Best test script B",
                header: "Best test script B",
                status: "Unavailable",
                price: "CA$0.89",
                // productList: "",
                labelAddToCart: "Disabled",
                addToWishlistButton: "Add to wishlist",
                itemDescription: "\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\"",
            },
            {
                image: "Best test script C",
                header: "Best test script C",
                status: "Unavailable",
                price: "CA$0.79",
                // productList: "",
                labelAddToCart: "Disabled",
                addToWishlistButton: "Add to wishlist",
                itemDescription: "\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\"",
            }
        ]
        const productDetails = [
            {
                productIndex: 0,
            },
            {
                productIndex: 1,
                productHref: "/product/15278051/best-test-script-b",
            },
            {
                headerText: "Best test script C"
            },];

        for (const product of productDetails) {
            await storePage.openProductByHeaderOrIndexOrHref(page, product);
            // Validate product details.
            await storePage.validateProductDetails(page, validateProductDetails[i]);
            // Go back to the 'Store' page and validate URL.
            await storeHomePage.clickMenuItem(page, storeHomePage.storMenuItem, `${baseURL}store`);
            await expect(page).toHaveURL(`${baseURL}store`);
            i++; // This is used to iterate through the validateProductDetails array.
        }
    });
});