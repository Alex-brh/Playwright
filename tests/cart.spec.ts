import { test, expect } from "@playwright/test";
import { StoreHomePage } from "./POM/home-page";
import config from "../playwright.config";

// Determine the base URL from the Playwright configuration or use a fallback URL.
const baseURL = config.use?.baseURL ?? "https://free-5288352.webadorsite.com/";

test.describe(`Test 'Cart' page by`, () => {
    let storeHomePage: StoreHomePage;

    test.beforeEach(async ({ page, request }) => {
        storeHomePage = new StoreHomePage(page);

        // Navigate to the store's home page using a POM method.
        await storeHomePage.gotoStoreHomePage(page, request);

        // Click the 'Basket' (cart) menu item to navigate to the cart page.
        await storeHomePage.clickMenuItem(page, storeHomePage.basketMenuItem, `${baseURL}`);

        // Assert that the navigation to the cart page was successful by checking the URL.
        await expect(page).toHaveURL(`${baseURL}`);
    });

    test("validating the Cart page title and empty cart message", async ({ page }) => {
        // Validate the page title for the cart.
        const expectedTitle = "Online store";
        await expect(page).toHaveTitle(expectedTitle);

        // Validate that the cart is initially empty and shows appropriate messaging.
        const emptyCartHeading = page.locator('div[class="inline-cart-no-content-message"]');
        await expect(emptyCartHeading.first()).toBeVisible();

        const emptyCartMessage = page.locator('div[class="inline-cart-no-content-message"]').filter({ hasText: /Your cart is empty./i });
        await expect(emptyCartMessage.first()).toBeVisible();
    });
});

