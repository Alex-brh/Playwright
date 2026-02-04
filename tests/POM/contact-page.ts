import { type Page, type Locator, expect, APIRequestContext } from "@playwright/test";
import config from "../../playwright.config";

// Determine the base URL from the Playwright configuration or use a fallback URL.
const baseURL = config.use?.baseURL ?? "https://free-5288352.webadorsite.com/";

/**
 * Interface for contact form input data.
 * @interface
 * @property {string} [name] - Optional name field value
 * @property {string} [email] - Optional email field value
 * @property {string} [message] - Optional message field value
 */
interface ContactFormData {
    name?: string;
    email?: string;
    message?: string;
}

/**
 * Represents the Contact page, providing methods for interacting with and validating page elements.
 */
export class ContactPage {
    // Header and page structure elements
    readonly pageHeader: Locator;

    // Form input fields
    readonly nameField: Locator;
    readonly emailField: Locator;
    readonly messageField: Locator;

    // Form buttons and validation elements
    private readonly submitButton: Locator;
    private readonly errorMessage: Locator;
    readonly contactUsButton: Locator;

    // Map
    readonly enlargeMapButton: Locator;
    private readonly zoomInButton: Locator;
    private readonly zoomOutButton: Locator;

    /**
     * Creates an instance of ContactPage.
     * @param {Page} page - The Playwright Page object.
     */
    constructor(public readonly page: Page) {
        // Page header element
        this.pageHeader = this.page.locator('h2[class^="jw-heading"]');

        // Form input fields - using getByLabel for accessibility
        this.nameField = this.page.getByLabel("Name *");
        this.emailField = this.page.getByLabel("Email address *");
        this.messageField = this.page.getByLabel("Message *");

        // Submit button and error message
        this.submitButton = this.page.locator('button[name="submit"]');
        this.errorMessage = this.page.locator('div[class="jw-element-form-error"] > strong');
        this.contactUsButton = this.page.locator('a[href="/contact"][title="Contact"]');

        // Map elements
        this.enlargeMapButton = this.page.locator('button[aria-label="Toggle fullscreen"][class^="mapboxgl"]');
        this.zoomInButton = this.page.locator('button[aria-label="Zoom In"]');
        this.zoomOutButton = this.page.locator('button[aria-label="Zoom Out"]');
    }

    /**
     * Navigates to the Contact page, validates the API response, and asserts page elements are visible.
     * @param {Page} page - The Playwright Page object.
     * @param {APIRequestContext} request - The Playwright APIRequestContext fixture.
     * @returns {Promise<void>} // Resolves when navigation and validation are complete.
     * @throws {Error} - If the API response is not OK.
     * @example
     * await contactPage.gotoContactPage(page, request);
     */
    async gotoContactPage(page: Page, request: APIRequestContext): Promise<void> {
        const url = `${baseURL}contact`;
        // Validate API response before navigation
        const response = await request.get(url);
        await expect(response).toBeOK();
        // Navigate to the contact page with commit wait strategy
        await page.goto(url, { waitUntil: "commit" }); // 'commit' ensures the navigation is fully committed
        // Wait for URL to match and verify page header is visible
        await page.waitForURL(url, { timeout: 15000 });
        // Wait for page header to be visible
        await this.pageHeader.waitFor({
            state: 'visible',
            timeout: 10000 // Timeout is in milliseconds
        });
        await expect(this.pageHeader).toBeVisible();
    }

    /**
     * Validates the presence and visibility of all form elements on the Contact page.
     * @returns {Promise<void>}
     * @example
     * await contactPage.validateAllFormElementsPresence();
     */
    async validateAllFormElementsPresence(): Promise<void> {
        // Verify all form fields are visible
        await expect(this.nameField).toBeVisible();
        await expect(this.emailField).toBeVisible();
        await expect(this.messageField).toBeVisible();
        // Verify submit button is visible
        await expect(this.submitButton).toBeVisible();
    }

    /**
     * Fills the contact form with the provided data.
     * Only fills fields that are provided in the data object.
     * @param {ContactFormData} formData - Object containing form field values
     * @returns {Promise<void>}
     * @example
     * await contactPage.fillContactForm({
     *   name: 'John Doe',
     *   email: 'john@example.com',
     *   message: 'This is a test message'
     * });
     */
    async fillContactForm(formData: ContactFormData): Promise<void> {
        const { name, email, message } = formData;

        // Fill name field if provided
        if (name !== undefined && name !== null) {
            await expect(this.nameField).toBeVisible();
            await this.nameField.fill(name);
        }

        // Fill email field if provided
        if (email !== undefined && email !== null) {
            await expect(this.emailField).toBeVisible();
            await this.emailField.fill(email);
        }

        // Fill message field if provided
        if (message !== undefined && message !== null) {
            await expect(this.messageField).toBeVisible();
            await this.messageField.fill(message);
        }
    }

    /**
     * Submits the contact form by clicking the submit button.
     * @returns {Promise<void>}
     * @example
     * await contactPage.submitContactForm();
     */
    async submitContactForm(): Promise<void> {
        // Verify submit button is enabled before clicking
        await expect(this.submitButton).toBeEnabled();
        // Click the submit button
        await this.submitButton.click();
    }

    /**
     * Validates that an error message is displayed after form submission due to unresolved Captcha pattern.
     * @returns {Promise<void>}
     * @example
     * await contactPage.validateErrorMessage();
     */
    async validateErrorMessage(): Promise<void> {
        // Wait a short time for error message to appear
        await this.errorMessage.waitFor({
            state: 'visible',
            timeout: 5000 // Timeout is in milliseconds
        });
        // Verify error message is visible
        await expect(this.errorMessage).toBeVisible();
    }

    /**
     * Validates the values in the form fields match the expected data.
     * @param {ContactFormData} expectedData - Object containing expected field values
     * @returns {Promise<void>}
     * @example
     * await contactPage.validateFormFieldValues({
     *   name: 'John Doe',
     *   email: 'john@example.com'
     * });
     */
    async validateFormFieldValues(expectedData: ContactFormData): Promise<void> {
        const { name, email, message } = expectedData;

        // Validate name field if expected value is provided
        if (name !== undefined && name !== null) {
            await expect(this.nameField).toHaveValue(name);
        }

        // Validate email field if expected value is provided
        if (email !== undefined && email !== null) {
            await expect(this.emailField).toHaveValue(email);
        }

        // Validate message field if expected value is provided
        if (message !== undefined && message !== null) {
            await expect(this.messageField).toHaveValue(message);
        }
    }

    /**
     * Clears all form fields by selecting and deleting their content.
     * @returns {Promise<void>}
     * @example
     * await contactPage.clearContactForm();
     */
    async clearContactForm(): Promise<void> {
        // Clear each form field
        await this.nameField.clear();
        await this.emailField.clear();
        await this.messageField.clear();
    }

    /**
     * Click the 'Contact Us' button and then validate navigation to the Contact page.
     * @param None
     * @returns {Promise<void>}
     * @example
     * await contactPage.clickContactUsButtonAndValidateNavigation();
     */
    async clickContactUsButtonAndValidateNavigation(): Promise<void> {
        // Click the 'Contact Us' button
        await expect(this.contactUsButton).toBeAttached();
        await this.contactUsButton.scrollIntoViewIfNeeded();
        await expect(this.contactUsButton).toBeVisible();
        await expect(this.contactUsButton).toBeEnabled();
        await this.contactUsButton.click();
        // Validate navigation to the Contact page
        await this.page.waitForURL("**/contact", { timeout: 15000 });
        // Verify the current URL matches the expected pattern by using a regular expression,
        // which checks if the URL ends with "/contact".
        await expect(this.page).toHaveURL(/\/contact$/);
    }

    /**
     * Click the 'Zoom In' button a specified number of times.
     * @param {number} times - The number of times to click the 'Zoom In' button.
     * @returns {Promise<void>}
     * @example
     * await contactPage.clickZoomInButton(3);
     */
    async clickZoomInButton(times: number): Promise<void> {
        for (let i = 0; i < times; i++) {
            // Wait for the 'Zoom In' button to be visible.
            await expect(this.zoomInButton).toBeAttached({ timeout: 10000 });
            await this.zoomInButton.scrollIntoViewIfNeeded();
            await expect(this.zoomInButton).toBeVisible();
            // Click the 'Zoom In' button
            await expect(this.zoomInButton).toBeEnabled();
            await this.zoomInButton.click();
            // Wait for the process to complete by pausing for 300 ms after each click.
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

    /**
     * Click the 'Zoom Out' button a specified number of times.
     * @param {number} times - The number of times to click the 'Zoom Out' button.
     * @returns {Promise<void>} 
     * @example
     * await contactPage.clickZoomOutButton(3);
     */
    async clickZoomOutButton(times: number): Promise<void> {
        for (let i = 0; i < times; i++) {
            // Wait for the 'Zoom Out' button to be visible.
            await expect(this.zoomOutButton).toBeAttached({ timeout: 10000 });
            await this.zoomOutButton.scrollIntoViewIfNeeded();
            await expect(this.zoomOutButton).toBeVisible();
            // Click the 'Zoom Out' button
            await expect(this.zoomOutButton).toBeEnabled();
            await this.zoomOutButton.click();
            // Wait for the process to complete by pausing for 300 ms after each click.
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

    /**
     * Enlarge or minimize the map by clicking the 'Enlarge Map' button.
     * @returns {Promise<void>}
     * @example
     * await contactPage.enlargeOrMinimizeMap();
     */
    async enlargeOrMinimizeMap(): Promise<void> {
        // Wait for the 'Enlarge Map' button to be visible.
        await expect(this.enlargeMapButton).toBeAttached({ timeout: 10000 });
        await this.enlargeMapButton.scrollIntoViewIfNeeded();
        await expect(this.enlargeMapButton).toBeVisible();
        // Click the 'Enlarge Map' button after ensuring it is enabled.
        await expect(this.enlargeMapButton).toBeEnabled();
        await this.enlargeMapButton.click();
    }

}
