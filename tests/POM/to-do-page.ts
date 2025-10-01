import { type Page, type Locator, expect } from '@playwright/test';

// Construct locators to use in methods
export class TodoPage {
readonly textBox: Locator;
private readonly header: Locator;
private readonly buttonActive: Locator;
private readonly buttonCompleted: Locator;

constructor(public readonly page: Page) {
    this.textBox = this.page.getByRole('textbox', {name: 'What needs to be done?'});
    this.header = this.page.locator('header');
}

async gotoMainPage() {
    await this.page.goto('https://demo.playwright.dev/todomvc/#/');
    await expect(this.header).toBeVisible();
    await expect(this.header).toHaveText("todos")
}



    
}