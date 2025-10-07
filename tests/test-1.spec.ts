import { test, expect } from '@playwright/test';
import { TodoPage } from '../tests/POM/to-do-page';

const tasks = [
  { task: "Create a task #", index: "1" },
  { task: "Create a task #", index: "2" },
  { task: "Create a task #", index: "3" }
]

test.describe(`Describe block # 1`, () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    // Navigate to the main page
    todoPage.gotoMainPage();
  });

  test('Populate tasks using an array of objects', async ({ page }) => {
    // Different ways to pinpoint a header
    await expect(page.getByRole('heading', { name: 'todos' })).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('header')).toContainText('todos');

    // Different ways to pinpoint a textbox
    await expect(todoPage.textBox).toHaveAttribute('placeholder', 'What needs to be done?'); // POM
    await expect(page.getByRole('textbox', { name: 'What needs to be done?' })).toBeVisible();

    //
    await expect(page.getByText('This is just a demo of TodoMVC for testing, not the real TodoMVC app. todos')).toBeVisible();
    await expect(page.getByRole('heading')).toContainText('todos');
    for (const record of tasks) {
      page.getByRole('textbox', { name: 'What needs to be done?' }).click();
      page.getByRole('textbox', { name: 'What needs to be done?' }).fill(`${record.task} ${record.index}`);
      page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    }

    // Click various buttons directly and by using POM methods
    todoPage.clickActiveButton();
    todoPage.clickCompletedButton();
    await page.getByRole('link', { name: 'Active' }).click();
    await page.getByRole('link', { name: 'Completed' }).click();
    await page.getByRole('textbox', { name: 'What needs to be done?' }).click({
      button: 'right'
    });

    //
    await expect(page.getByRole('textbox', { name: 'What needs to be done?' })).toBeVisible();
    await expect(page.locator('body')).toContainText('Completed');
    for (const record of tasks) {
      await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
      await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(`${record.index} ${record.task}`);
      await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    }

    await page.getByRole('link', { name: 'Active' }).click();
    await page.getByRole('link', { name: 'All' }).click();
    todoPage.verifyItemCount({ count: '6' });
    todoPage.completeAllItems();
  });


  test(`Ensure zero items count`, async ({ page }) => {
    for (const record of tasks) {
      await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
      await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(`${record.index} ${record.task}`);
      await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    }
    await page.getByRole('link', { name: 'All' }).click();
    todoPage.verifyItemCount({ count: '3' });
    todoPage.completeAllItems();

    // Click 'Clear completed'
    todoPage.clearCompletedButton.click();

    // Make sure the 'All' button no longer shows up
    await expect(page.getByRole('link', { name: 'All' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'All' })).toBeHidden();
  });

});

test.describe.skip(`Describe block # 2`, () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    // Navigate to the main page
    todoPage.gotoMainPage();
  });

  test('Populate tasks and delete them', async ({ page }) => {
    await expect(page.getByRole('heading')).toContainText('todos');
    for (const record of tasks) {
      page.getByRole('textbox', { name: 'What needs to be done?' }).click();
      page.getByRole('textbox', { name: 'What needs to be done?' }).fill(`${record.task} ${record.index}`);
      page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    }
    // Count the number of 'Delete record' buttons (X)
    const buttonXLocator = page.locator('button[aria-label="Delete"]');
    while (await buttonXLocator.count() > 0) {
      await buttonXLocator.first().click();
    }
    await expect(buttonXLocator.nth(0)).not.toBeVisible();

  })
});