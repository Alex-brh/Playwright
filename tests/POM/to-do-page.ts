// Import Playwright test types for Page, Locator, and expect assertion function
import { type Page, type Locator, expect } from '@playwright/test';
// Import url from inspector module (currently unused)
import { url } from 'inspector';

// Define TodoPage class as a Page Object Model for the TodoMVC application
export class TodoPage {
  // Public read-only property for the text input field where users type new tasks
  readonly textBox: Locator;
  // Private read-only property for the page header element displaying "todos"
  private readonly header: Locator;
  // Private read-only property for the "Active" button/link to filter active items
  private readonly buttonActive: Locator;
  // Private read-only property for the "Completed" button/link to filter completed items
  private readonly buttonCompleted: Locator;
  // Private read-only property for the element displaying the count of active items
  private readonly itemCount: Locator;
  // Private read-only property for the checkbox to mark all items as complete
  private readonly markAllAsCompleteCheckbox: Locator;
  // Public read-only property for the "Clear completed" button
  readonly clearCompletedButton: Locator;

  // Constructor accepts a Playwright Page object and initializes all locators
  constructor(public readonly page: Page) {
    // Initialize textBox locator by finding the textbox with label "What needs to be done?"
    this.textBox = this.page.getByRole('textbox', { name: 'What needs to be done?' });
    // Initialize header locator by finding the header element
    this.header = this.page.locator('header');
    // Initialize buttonActive locator by finding the element with text "Active"
    this.buttonActive = this.page.getByText('Active');
    // Initialize buttonCompleted locator by finding the link element with text "Completed"
    this.buttonCompleted = this.page.getByRole('link', { name: 'Completed' });
    // Initialize itemCount locator by finding the strong element inside span with data-testid "todo-count"
    this.itemCount = this.page.locator('span[data-testid="todo-count"] > strong');
    // Initialize markAllAsCompleteCheckbox locator by finding the element with label "Mark all as complete"
    this.markAllAsCompleteCheckbox = this.page.getByLabel('Mark all as complete');
    // Initialize clearCompletedButton locator by finding the button with text "Clear completed"
    this.clearCompletedButton = this.page.getByRole('button', { name: 'Clear completed' });
  }

  // Navigate to the TodoMVC application main page and verify header is visible
  async gotoMainPage() {
    // Navigate to the TodoMVC application URL and wait until page commit is complete
    await this.page.goto('https://demo.playwright.dev/todomvc/#/', { waitUntil: 'commit' });
    // Assert that the header element is visible on the page
    await expect(this.header).toBeVisible();
    // Assert that the header contains the exact text "todos"
    await expect(this.header).toHaveText('todos');
  }

  /**
   * @description Clicks the "Active" button to filter and display only active items.
   * This method ensures the button is enabled before clicking.
   * @returns {Promise<void>} A promise that resolves when the button is clicked.
   * @throws {Error} If the button is not enabled before clicking.
   * @example
   * await todoPage.clickActiveButton();
   */
  async clickActiveButton(): Promise<void> {
    // Assert that the buttonActive element is enabled before clicking
    await expect(this.buttonActive).toBeEnabled();
    // Click the buttonActive element
    await this.buttonActive.click();
  }

  /**
   * @description Clicks the "Completed" button to filter and display only completed items.
   * This method ensures the button is enabled before clicking.
   * @returns {Promise<void>} A promise that resolves when the button is clicked.
   * @throws {Error} If the button is not enabled before clicking.
   * @example
   * await todoPage.clickCompletedButton();
   */
  async clickCompletedButton(): Promise<void> {
    // Assert that the buttonCompleted element is enabled before clicking
    await expect(this.buttonCompleted).toBeEnabled();
    // Click the buttonCompleted element
    await this.buttonCompleted.click();
  }

  /**
   * @description Verify the item count displays the expected value. This method only accepts strings and RegExp as the count parameter
   * @param {Object} params - The parameters object.
   * @param {string | RegExp} params.count - The expected count value.
   * @returns {Promise<void>} A promise that resolves when the verification is complete.
   * @example
   * await todoPage.verifyItemCount({ count: '3' });
   */
  async verifyItemCount({ count }: { count: string | RegExp }): Promise<void> {
    // Assert that the itemCount element is visible on the page
    await expect(this.itemCount).toBeVisible();
    // Assert that the itemCount element text matches the provided count value
    await expect(this.itemCount).toHaveText(count);
  }

  /**
   * @description Marks all to-do items as complete by checking the "Mark all as complete" checkbox.
   * This method only accepts strings and RegExp (destructured param)
   * This method uses the `force: true` option to bypass visibility checks.
   * @returns {Promise<void>} A promise that resolves when all items are marked as complete.  
   * @example
   * await todoPage.completeAllItems();
   */
  async completeAllItems(): Promise<void> {
    // Check the markAllAsCompleteCheckbox element, using force: true to bypass visibility checks
    await this.markAllAsCompleteCheckbox.check({ force: true });
  }
}