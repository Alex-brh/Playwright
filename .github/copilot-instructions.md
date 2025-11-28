# AI Coding Agent Instructions for Playwright Test Automation

## Project Overview
This is a **Playwright end-to-end testing project** targeting a practice e-commerce store at `https://free-5288352.webadorsite.com/`. Tests are organized using the **Page Object Model (POM)** pattern with TypeScript. The project focuses on UI automation across multiple store pages: home, store, FAQ, customer testimonials, and contact sections.

---

## Architecture & Structure

### Directory Layout
```
tests/
  ├── *.spec.ts              # Test files using Playwright test fixtures
  └── POM/                   # Page Object Model classes
      ├── home-page.ts       # Navigation menu, carousel, headers
      ├── store-page.ts      # Product listing, product details, cart
      ├── faq-page.ts        # Accordion sections, disclaimer text
      ├── customer-testimonials.ts
      ├── to-do-page.ts
      └── common-methods.ts  # (Currently empty, ready for shared utilities)
```

### Page Object Model Pattern
Each page has a dedicated class that:
- **Encapsulates locators** as readonly properties (e.g., `this.shopNowButton`)
- **Uses CSS attribute selectors** with class prefixes (`[class^="jw-*"]`) for dynamic elements
- **Groups related methods** together (validation, interaction, navigation)
- **Accepts Playwright fixtures** (page, request) as method parameters

**Example locator pattern** (from `home-page.ts`):
```typescript
this.storMenuItem = this.page.locator('a[class^="jw-menu-link"][href="/store"] > span');
```

---

## Test Structure & Conventions

### Test File Organization
Tests use `test.describe()` blocks with `beforeEach()` hooks for setup:

```typescript
test.describe(`Test online store 'Page Name' page by`, () => {
  let pageObject: PageClass;

  test.beforeEach(async ({ page, request }) => {
    pageObject = new PageClass(page);
    await pageObject.gotoPage(page, request);  // Navigation + API validation
  });

  test('test case description', async ({ page }) => {
    // Test logic
  });
});
```

### Data-Driven Testing Pattern
Tests pass **interface-defined objects** containing test data:

```typescript
const productDetails = [
  { productIndex: 0, productHref: "/product/...", headerText: "Best test script A" },
  { productIndex: 1, productHref: "/product/...", headerText: "Best test script B" }
];
```

This enables easy expansion—add array items instead of duplicating test code.

### Navigation & Waiting Strategy
- Always use `request.get()` to validate API response before page navigation
- Call `page.goto()` with `{ waitUntil: "commit" }` for complex pages
- Use `page.waitForURL()` with explicit timeouts (typically 15000ms)
- Click methods validate locator visibility before interaction

---

## Critical Developer Workflows

### Running Tests
```bash
# Interactive UI mode (best for debugging)
npx playwright test --ui

# Run all tests headlessly
npx playwright test

# Run specific test file
npx playwright test tests/home.spec.ts
```

### Configuration
- **Base URL**: `https://free-5288352.webadorsite.com/` (in `playwright.config.ts`)
- **Parallel execution**: Enabled by default (`fullyParallel: true`)
- **CI behavior**: Retries tests 2x, uses single worker
- **Reports**: HTML report generated in `playwright-report/`
- **Browser coverage**: Chromium, Firefox, WebKit (mobile testing commented out)

### Trace Collection
Traces are collected on first retry (`trace: 'on-first-retry'`) for debugging failed tests.

---

## Project-Specific Patterns

### Common Validation Patterns
1. **Soft assertions** for multiple checks that shouldn't halt test:
   ```typescript
   await expect.soft(element).toHaveText(expectedText);
   ```

2. **Element count validation**:
   ```typescript
   await expect.soft(this.picsInCarousel).toHaveCount(5);
   ```

3. **Attribute validation** (useful for data-driven content):
   ```typescript
   await expect(element).toHaveAttribute('data-high-res-path', 'https://...');
   ```

4. **CSS property validation**:
   ```typescript
   await expect(element).toHaveCSS("color", "rgb(255, 255, 255)");
   ```

### Navigation Pattern with URL Verification
The `clickMenuItem()` helper demonstrates the standard navigation flow:
```typescript
async clickMenuItem(page: Page, locator: Locator, url: string) {
  await expect(locator).toBeVisible();
  locator.click();
  await expect(page).toHaveURL(url);  // Verify navigation completed
}
```

### Product Details Validation Interface
`StorePage` uses typed interfaces for product validation (`ProductDetails`, `productDetailsToValidate`) with optional fields to support partial validation—add fields only when needed.

---

## External Dependencies & Integration Points

### Dependencies
- `@playwright/test@^1.57.0` - Test runner and assertions
- `@types/node@^24.5.2` - TypeScript support

### Test Target
- **Single external site**: Practice e-commerce store (no backend setup required)
- **Network requests**: Uses `APIRequestContext` fixture to validate API responses before UI tests

---

## When Adding New Tests

1. **Create corresponding POM class** in `tests/POM/` if testing a new page
2. **Define interfaces** for test data structures (see `ProductDetails` example)
3. **Use existing helpers** in page objects (e.g., `validateAllMenuItemsPresence()`)
4. **Group tests by page** using `test.describe()` matching page name
5. **Populate test data as arrays** for scalability
6. **Validate navigation** via both URL assertions and visible element checks

---

## Known Quirks & Edge Cases

- **`common-methods.ts` is empty**—reserved for future shared utilities (currently not needed)
- **Mobile viewport tests are commented out** in config
- **`test-1.spec.ts` contains skipped tests** (`.describe.skip()`)—useful reference for To-Do app patterns but not running
- **CSS selectors use `[class^="jw-*"]`** because the site uses dynamic class naming; rely on these prefixes rather than exact class matches

---

## References for Debugging
- Check `playwright-report/` after test runs for HTML reports with screenshots
- Enable `--debug` flag to step through tests: `npx playwright test --debug`
- Traces collected on failure help identify timing or locator issues
