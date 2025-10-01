import { type Page, type Locator, expect } from '@playwright/test';
import { url } from 'inspector';

// Construct locators to use in methods
export class TodoPage {
readonly textBox: Locator;
private readonly header: Locator;
private readonly buttonActive: Locator;
private readonly buttonCompleted: Locator;
private readonly itemCount: Locator;

constructor(public readonly page: Page) {
    this.textBox = this.page.getByRole('textbox', {name: 'What needs to be done?'});
    this.header = this.page.locator('header');
    this.buttonActive = this.page.getByText('Active');
    this.buttonCompleted = this.page.getByRole('link', {name: 'Completed'});
    this.itemCount = this.page.locator('span[data-testid="todo-count"] > strong');
}

async gotoMainPage() {
    await this.page.goto('https://demo.playwright.dev/todomvc/#/');
    await expect(this.header).toBeVisible();
    await expect(this.header).toHaveText("todos")
}

async clickActiveButton() {
    await expect(this.buttonActive).toBeEnabled();
    await this.buttonActive.click();
}

async clickCompletedButton() {
    await expect(this.buttonCompleted).toBeEnabled();
    await this.buttonCompleted.click();
}

// This method only accepts strings and RegExp (destructured param)
async verifyItemCount({count}: {count: string | RegExp}) {
    await expect(this.itemCount).toBeVisible();
    await expect(this.itemCount).toHaveText(count);
}



    
}