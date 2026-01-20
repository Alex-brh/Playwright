---
applyTo: '**tests\home.spec.ts, **tests\POM\home-page.ts'
---
# Detailed Guide to `home.spec.ts` and `home-page.ts`

## Overview

The **Home page tests** validate the core functionality and appearance of your e-commerce store's home page. These tests use the **Page Object Model (POM)** pattern, which separates test logic from page interaction code for better maintainability.

---

## File Structure

### 1. **`tests/POM/home-page.ts`** — The Page Object Model Class

This file encapsulates all interactions with the home page. Think of it as a "blueprint" that defines:
- Where elements are located (locators)
- How to interact with them (methods)
- Common validations specific to the home page

### 2. **`tests/home.spec.ts`** — The Test Specifications

This file contains the actual tests that use the `StoreHomePage` class. Tests describe what should happen on the home page and use the POM methods to interact with it.

---

## Deep Dive: `home-page.ts`

### Purpose
The `StoreHomePage` class acts as an intermediary between your tests and the actual webpage. Instead of tests directly interacting with the DOM, they use methods from this class.

### Class Structure

```typescript
export class StoreHomePage {
  // Property declarations
  readonly homeMenuItem: Locator;
  readonly storMenuItem: Locator;
  // ... more properties
}
```

#### **Key Concept: `readonly Locator` Properties**

**What is a Locator?**
A `Locator` is a Playwright object that represents a way to find an element on the page. It doesn't immediately find the element—it just describes where to look.

```typescript
this.storMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/store"] > span');
```

**Breaking down the selector:**
- `a[class^="jw-menu-link"]` — Find an `<a>` tag with a class starting with `"jw-menu-link"`
- `[href="/store"]` — That also has an `href` attribute equal to `"/store"`
- `> span` — Get the direct `<span>` child of that link

**Why `readonly`?**
Once set in the constructor, these locators shouldn't change during the test. `readonly` prevents accidental modification.

---

### Constructor

```typescript
constructor(public readonly page: Page) {
  this.homeMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/"]');
  this.storMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/store"] > span');
  // ... initialize all locators
}
```

**What happens here:**
1. The constructor receives the Playwright `Page` object
2. All page locators are initialized using CSS selectors
3. These locators are now available for use in test methods

**Why initialize in the constructor?**
- Centralizes all locator definitions in one place
- Makes them reusable across multiple tests
- Easier to update selectors if the page HTML changes

---

### Navigation Method: `gotoStoreHomePage()`

```typescript
async gotoStoreHomePage(page: Page, request: APIRequestContext) {
  const url = "https://free-5288352.webadorsite.com/";
  const response = await request.get(url);
  await expect(response).toBeOK();
  await page.goto(url, { waitUntil: "commit" });
  await page.waitForURL(url, { timeout: 15000 });
  await expect(this.homeMenuItem).toBeVisible();
  await expect(this.homeMenuItem).toHaveText(" Home ");
}
```

**Step-by-step breakdown:**

| Step |                  Code                                  |                         Why?                                          |
|------|--------------------------------------------------------|-----------------------------------------------------------------------|
| 1    | `const response = await request.get(url)`              | Use the **API** to check if the URL is reachable before visiting it   |
| 2    | `await expect(response).toBeOK()`                      | Verify the API returned a **200-299 status code** (success)           |
| 3    | `await page.goto(url, { waitUntil: "commit" })`        | Navigate to the URL and wait until the browser commits the navigation |
| 4    | `await page.waitForURL(url, { timeout: 15000 })`       | **Explicitly wait** up to 15 seconds for the URL to match             |
| 5    | `await expect(this.homeMenuItem).toBeVisible()`        | Verify the Home menu item is visible                                  |
| 6    | `await expect(this.homeMenuItem).toHaveText(" Home ")` | Verify the Home menu item displays the correct text                   |

**Why this approach?**
- **API validation first** catches server issues before the browser even tries to load
- **Explicit waits** prevent flaky tests by giving the page time to load
- **Visual verification** ensures the page rendered correctly

---

### Validation Method: `validateAllMenuItemsPresence()`

```typescript
async validateAllMenuItemsPresence() {
  await expect(this.homeMenuItem).toBeVisible();
  await expect(this.storMenuItem).toBeVisible();
  // ... all menu items
}
```

**What it does:**
Checks that all navigation menu items are visible. This is a simple but important check—if the menu isn't showing, the entire site is inaccessible.

**Why separate this into its own method?**
- **Reusability**: Multiple tests might need to verify the menu is present
- **Clarity**: The test code reads like English: `validateAllMenuItemsPresence()` is self-documenting
- **Maintainability**: If the number of menu items changes, you only update this method, not multiple tests

---

### Click Method: `clickMenuItem()`

```typescript
async clickMenuItem(page: Page, locator: Locator, url: string) {
  await expect(locator).toBeVisible();
  locator.click();
  await expect(page).toHaveURL(url);
}
```

**Step-by-step:**

| Step |             Code                      |                       Why?                               |
|------|---------------------------------------|----------------------------------------------------------|
| 1    | `await expect(locator).toBeVisible()` | Don't click invisible elements—verify it's visible first |
| 2    | `locator.click()`                     | Click the element                                        |
| 3    | `await expect(page).toHaveURL(url)`   | **Verify navigation worked** by checking the URL changed |

**Why this pattern is important:**
- **Safety**: Prevents errors from clicking hidden or disabled elements
- **Reliability**: URL verification ensures the navigation actually completed, not just that the click happened
- **Debugging**: If this fails, you know exactly what went wrong (visibility, click, or navigation)

---

### Click Button Method: `clickShopNowButton()`

```typescript
async clickShopNowButton(page: Page, buttonIndex: number) {
  const locator = this.shopNowButton.nth(buttonIndex);
  await expect(locator).toBeAttached();
  locator.click();
}
```

**What `.nth(buttonIndex)` does:**
If there are multiple "Shop now" buttons on the page (e.g., in different sections), `.nth()` lets you select a specific one:
- `.nth(0)` — First button
- `.nth(1)` — Second button
- `.nth(2)` — Third button

**What `.toBeAttached()` checks:**
Verifies the element exists in the DOM (but doesn't require it to be visible, since it might be scrolled off-screen).

---

### Validation Method: `validatePicsInCarouselByIndex()`

```typescript
async validatePicsInCarouselByIndex(page: Page, picIndex: number) {
  console.log(`Validating picture with index: ${picIndex} in the carousel`)
  await expect(this.picsInCarousel.nth(picIndex)).toBeAttached();
  await expect(this.picsInCarousel.nth(picIndex)).toBeVisible();
}
```

**What it validates:**
- The carousel image at a specific index **exists** in the DOM
- The carousel image at that index **is visible** to the user

**The console.log():**
Logs which picture is being validated—helpful when reading test output to understand what passed/failed.

---

## Deep Dive: `home.spec.ts`

### File Setup

```typescript
import { test, expect, type Page } from '@playwright/test';
import { StoreHomePage } from './POM/home-page';
import config from '../playwright.config';

let page: Page;
const baseUrl = config.use?.baseURL ?? 'https://free-5288352.webadorsite.com/';
```

**Key imports:**
- `test` — The Playwright test runner
- `expect` — Assertion function (used in `expect(element).toBeVisible()`)
- `Page` — TypeScript type for a browser page
- `StoreHomePage` — The POM class we just reviewed

**`baseUrl` variable:**
Reads the base URL from the Playwright config, with a fallback to the hardcoded URL. This allows tests to run against different environments easily.

---

### Test Suite Setup: `test.describe()`

```typescript
test.describe(`Test 'Home' page by`, () => {
  let storeHomePage: StoreHomePage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.beforeEach(async ({ page, request }) => {
    storeHomePage = new StoreHomePage(page);
    await storeHomePage.gotoStoreHomePage(page, request);
  });

  // Tests go here...
});
```

**Understanding the hooks:**

|        Hook         |            When it runs                 |                    Purpose                       |
|---------------------|-----------------------------------------|--------------------------------------------------|
| `test.beforeAll()`  | **Once** before all tests in this block | Create a single browser page for all tests       |
| `test.beforeEach()` | **Before each individual test**         | Initialize the POM and navigate to the home page |
| `test.afterAll()`   | **Once** after all tests finish         | Close the browser page                           |

**Why this structure?**
- **Efficiency**: Create the page once with `beforeAll`, reuse it across all tests
- **Isolation**: `beforeEach` ensures each test starts with a fresh navigation to home
- **Cleanup**: `afterAll` closes the page to free resources

---

## Individual Tests

### Test 1: `ensuring that all menu items show up`

```typescript
test('ensuring that all menu items show up', async ({ page }) => {
  await storeHomePage.validateAllMenuItemsPresence();
});
```

**What it does:**
Calls the POM method that checks all navigation menu items are visible.

**Why this test exists:**
- **Smoke test**: If the menu is broken, the entire site is broken
- **Quick check**: Takes seconds to run, catches obvious layout issues
- **Baseline**: Ensures the page loaded successfully before other tests run

**Example failure scenario:**
If CSS breaks and hides all menu items, this test fails immediately, alerting you to a critical issue.

---

### Test 2: `switching over between menus and verifying page URL`

```typescript
test('switching over between menus and verifying page URL', async ({ page }) => {
  await storeHomePage.clickMenuItem(page, storeHomePage.storMenuItem, `${baseUrl}store`);
  await storeHomePage.clickMenuItem(page, storeHomePage.homeMenuItem, `${baseUrl}`);
  await storeHomePage.clickMenuItem(page, storeHomePage.faqMenuItem, `${baseUrl}faq`);
  // ... and so on
});
```

**What it does:**
1. Clicks each menu item
2. Verifies the URL changed correctly
3. Returns to home between clicks

**Why this pattern?**
- **Navigation validation**: Ensures all menu links work
- **URL correctness**: Confirms backend routing is correct
- **Navigation flow**: Tests realistic user behavior (click, navigate, click again)

**Example failure scenario:**
If the Store menu item links to `/stor` (typo) instead of `/store`, this test catches it.

---

### Test 3: `clicking each one of 'Shop now' buttons and verifying page url it leads to`

```typescript
test(`clicking each one of 'Shop now' buttons and verifying page url it leads to`, async ({ page }) => {
  for (let i = 1; i < 4; i++) {
    await storeHomePage.clickShopNowButton(page, i);
    await expect(page).toHaveURL(`${baseUrl}store`);
    await page.goBack();
    await expect(page).toHaveURL(baseUrl, { timeout: 15000 });
  }
});
```

**What it does:**
1. Loop through 3 "Shop now" buttons (indices 1, 2, 3)
2. Click each button
3. Verify it navigates to `/store`
4. Go back to home page
5. Verify we're back on the home page

**Why use a loop?**
Instead of repeating the same code 3 times:
```typescript
// Bad: Repetitive
await storeHomePage.clickShopNowButton(page, 1);
await expect(page).toHaveURL(`${baseUrl}store`);
await page.goBack();

await storeHomePage.clickShopNowButton(page, 2);
await expect(page).toHaveURL(`${baseUrl}store`);
await page.goBack();
```

Use a loop:
```typescript
// Good: Data-driven
for (let i = 1; i < 4; i++) {
  await storeHomePage.clickShopNowButton(page, i);
  await expect(page).toHaveURL(`${baseUrl}store`);
  await page.goBack();
}
```

**Benefits of data-driven approach:**
- **DRY** (Don't Repeat Yourself): Less code to maintain
- **Scalable**: If you add a 4th button, just change `i < 4` to `i < 5`
- **Readable**: Intent is clear

**Why `await page.goBack()`?**
Returns to the home page between clicks, simulating real user navigation behavior and ensuring the menu remains functional after each click.

---

### Test 4: `validating the 'Home' page header and all sub-header contents`

```typescript
test(`validating the 'Home' page header and all sub-header contents`, async ({ page }) => {
  const homePageHeader = "Discover Unique Ways To Create Test Scripts";
  await expect(storeHomePage.pageHeader).toHaveText(homePageHeader);
  
  const homePageSubHeaders = [
    { index: 0, text: "Welcome to Alex's test automation site for practice" },
    { index: 1, text: "Verify New Collection" },
    { index: 2, text: "Discover Our Exclusive Collection" },
    { index: 3, text: "More stuff" }
  ];
  
  for (const subHeader of homePageSubHeaders) {
    console.log(`Verifying the following sub-header at index ${subHeader.index} with text: ${subHeader.text}`);
    await expect.soft(storeHomePage.pageSubHeader.nth(subHeader.index)).toHaveText(subHeader.text);
  }
});
```

**What it does:**
1. Validates the main page header text
2. Validates all sub-header texts using a data-driven loop

**Key concept: `expect.soft()`**

```typescript
await expect.soft(element).toHaveText(text);
```

- **`expect()` (hard assertion)**: Test fails immediately if assertion fails
- **`expect.soft()` (soft assertion)**: Test continues even if assertion fails, collects all failures, and reports them at the end

**When to use which?**
- Use `hard assertions` for critical checks (e.g., page loaded, button exists)
- Use `soft assertions` for content validation (multiple sub-headers, optional fields)

**Why soft assertions here?**
If sub-header #1 has wrong text, you still want to check sub-headers #2 and #3. This gives you a complete picture of what failed, rather than stopping at the first failure.

**Data-driven approach:**
```typescript
const homePageSubHeaders = [
  { index: 0, text: "Welcome..." },
  { index: 1, text: "Verify..." },
  // ...
];

for (const subHeader of homePageSubHeaders) {
  await expect.soft(storeHomePage.pageSubHeader.nth(subHeader.index)).toHaveText(subHeader.text);
}
```

This is **scalable**: If you add a new sub-header, just add another object to the array. The loop handles it automatically.

---

### Test 5: `validating the 'Home' page header and all sub-header colors`

```typescript
test(`validating the 'Home' page header and all sub-header colors`, async ({ page }) => {
  const homePageHeaderColor = "rgb(255, 255, 255)"; // White
  await expect.soft(storeHomePage.pageHeader).toHaveCSS("color", homePageHeaderColor);
  
  const homePageSubHeadersColors = [
    { index: 0, color: "rgb(78, 58, 196)", colorEng: "black" },
    // ...
  ];
  
  for (const subHeaderColor of homePageSubHeadersColors) {
    console.log(`Validating the following sub-header at [index: ${subHeaderColor.index}] with [color: ${subHeaderColor.colorEng}]`);
    await expect.soft(storeHomePage.pageSubHeader.nth(subHeaderColor.index)).toHaveCSS("color", subHeaderColor.color);
  }
});
```

**What it does:**
Validates that headers have the correct text color.

**Key concept: `toHaveCSS()`**

```typescript
await expect(element).toHaveCSS("property", "value");
```

Checks the **computed CSS** of an element. For example:
- `.toHaveCSS("color", "rgb(255, 255, 255)")` — Text is white
- `.toHaveCSS("background-color", "rgb(0, 0, 0)")` — Background is black
- `.toHaveCSS("font-size", "16px")` — Font size is 16px

**Why validate CSS?**
- **Visual correctness**: Ensures the page looks right, not just that text exists
- **Branding**: Confirms brand colors are applied correctly
- **Accessibility**: Validates sufficient color contrast

**Why include both RGB and English names?**
```typescript
{ index: 0, color: "rgb(78, 58, 196)", colorEng: "black" }
```

The `color` is what Playwright expects (RGB format), and `colorEng` is a human-readable label for test output (`console.log`). This makes logs easier to understand.

---

### Test 6: `validating the presence of 5 pictures on the 'Home' page`

```typescript
test(`validating the presence of 5 pictures on the 'Home' page`, async () => {
  await expect(storeHomePage.picsInCarousel).toHaveCount(5);
  
  await expect.soft(storeHomePage.picsInCarousel.nth(0)).toHaveAttribute('srcset');
  await expect.soft(storeHomePage.picsInCarousel.nth(1)).toHaveAttribute('srcset');
  // ... for all 5 images
});
```

**What it does:**
1. Verifies exactly 5 carousel images exist
2. Verifies each image has a `srcset` attribute

**Key concept: `toHaveCount()`**

```typescript
await expect(elements).toHaveCount(5);
```

Verifies a locator matches exactly 5 elements. Useful for:
- Ensuring all carousel images are present
- Verifying all products loaded
- Confirming the correct number of menu items

**Key concept: `toHaveAttribute()`**

```typescript
await expect(element).toHaveAttribute("attribute-name");
```

Verifies an HTML attribute exists. In this case, `srcset` indicates responsive images (images optimized for different screen sizes).

**Why this test matters:**
- **Responsive images**: Without `srcset`, images might not display correctly on mobile
- **Visual completeness**: Confirms all 5 carousel slides are present
- **Performance**: `srcset` ensures the right image size is loaded

---

## Summary: Why This Structure?

### Page Object Model Benefits

|       Benefit       |                               Example                                         |
|---------------------|-------------------------------------------------------------------------------|
| **Maintainability** | If home page HTML changes, update only `home-page.ts`, not 6 different tests  |
| **Reusability**     | Multiple tests use `validateAllMenuItemsPresence()` without duplication       |
| **Readability**     | Tests read like English: `validateAllMenuItemsPresence()` is self-documenting |
| **Scalability**     | Add a new sub-header? Just add one line to a data array                       |

### Data-Driven Testing Benefits

|      Benefit       |                          Example                                  |
|--------------------|-------------------------------------------------------------------|
| **Less code**      | Loop through array instead of copying test 3 times                |
| **Easier updates** | Add test case by adding one array item, not rewriting entire test |
| **Comprehensive**  | Soft assertions show all failures at once, not stopping at first  |

### Why These Specific Tests?

|       Test       |           Importance                    |
|------------------|-----------------------------------------|
| Menu visibility  | **Critical**: Broken menu = broken site |
| Menu navigation  | **High**: Core functionality            |
| Shop now buttons | **High**: Conversion funnel             |
| Headers & text   | **Medium**: Content correctness         |
| CSS colors       | **Medium**: Visual correctness          |
| Carousel images  | **Medium**: Visual completeness         |

---

## Running These Tests

```bash
# Run only home page tests
npx playwright test tests/home.spec.ts

# Run with UI (interactive debugging)
npx playwright test tests/home.spec.ts --ui

# Run and generate report
npx playwright test tests/home.spec.ts
npx playwright show-report
```

---

## Key Takeaways for New Users

1. **Page Object Model separates concerns**: Page interaction code lives in POM classes, test logic lives in `.spec.ts` files
2. **Locators are reusable**: Define once in constructor, use across multiple tests
3. **Methods are descriptive**: `validateAllMenuItemsPresence()` tells you exactly what it does
4. **Data-driven tests scale**: Add test cases by extending arrays, not copying code
5. **Soft assertions show all issues**: Use `expect.soft()` to collect all failures in one test run
6. **Explicit waits prevent flakiness**: Always wait for elements and URLs, don't assume instant loading
7. **Each test has a purpose**: Smoke tests, navigation tests, content tests, visual tests—each validates a different aspect