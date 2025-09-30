import { test, expect } from '@playwright/test';

const tasks = [
  { task: "Create a task #", index: "1" },
  { task: "Create a task #", index: "2" },
  { task: "Create a task #", index: "3" }
]

test('Populate tasks using an array of objects', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/#/');
  await expect(page.getByRole('heading', { name: 'todos' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'What needs to be done?' })).toBeVisible();
  await expect(page.getByText('This is just a demo of TodoMVC for testing, not the real TodoMVC app. todos')).toBeVisible();
  await expect(page.getByRole('heading')).toContainText('todos');
  for (const record of tasks) {
    page.getByRole('textbox', { name: 'What needs to be done?' }).click();
    page.getByRole('textbox', { name: 'What needs to be done?' }).fill(`${record.task} ${record.index}`);
    page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

  }

  await page.getByRole('link', { name: 'Active' }).click();
  await page.getByRole('link', { name: 'Completed' }).click();
  await page.getByRole('link', { name: 'Active' }).click();
  await page.getByRole('link', { name: 'Completed' }).click();
  await page.getByRole('textbox', { name: 'What needs to be done?' }).click({
    button: 'right'
  });
  await expect(page.getByRole('textbox', { name: 'What needs to be done?' })).toBeVisible();
  await expect(page.locator('body')).toContainText('Completed');
  for (const record of tasks) {
    await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(`${record.index} ${record.task}`);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  }

  await page.getByRole('link', { name: 'Active' }).click();
});