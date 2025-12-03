# Playwright E2E Test Automation

This repository contains end-to-end test automation for a practice e-commerce store using **Playwright** and **TypeScript**. Tests are organized using the **Page Object Model (POM)** pattern to ensure maintainability and scalability.

## 🎯 Project Overview

- **Test Target**: [Practice E-commerce Store](https://free-5288352.webadorsite.com/)
- **Framework**: Playwright Test (`@playwright/test@^1.57.0`)
- **Language**: TypeScript
- **Pattern**: Page Object Model (POM)
- **CI/CD Support**: Configured for parallel execution with retries

## 📁 Project Structure

```
tests/
  ├── *.spec.ts                 # Test files (home, store, contact, FAQ, etc.)
  └── POM/                      # Page Object Model classes
      ├── home-page.ts          # Home page interactions & validations
      ├── store-page.ts         # Product listing & cart operations
      ├── contact-page.ts       # Contact form interactions
      ├── faq-page.ts           # FAQ accordion interactions
      ├── customer-testimonials.ts
      ├── showcase-page.ts      # Showcase page validations
      ├── to-do-page.ts         # TodoMVC app interactions
      └── commonly-used-methods.ts # Shared utility methods
```

## 🚀 Running Tests

### Interactive UI Mode (Recommended for Development)
```bash
npx playwright test --ui
```
Opens an interactive browser where you can step through tests, view DOM, and debug in real-time.

### Headless Mode (CI/CD)
```bash
npx playwright test
```
Runs all tests in headless mode across Chromium, Firefox, and WebKit browsers.

### Run Specific Test File
```bash
npx playwright test tests/home.spec.ts
```

### Run Tests with Debugging
```bash
npx playwright test --debug
```
Launches the Playwright Inspector for step-by-step debugging.

### Generate HTML Report
```bash
npx playwright show-report
```
Opens the HTML test report with screenshots and traces.

## 📝 Test Coverage

- **Home Page**: Navigation menu, carousel, headers, and page layout
- **Store Page**: Product listing, product details, cart operations
- **Contact Page**: Contact form filling and submission
- **FAQ Page**: Accordion sections, question/answer content
- **Customer Testimonials**: Testimonial content and layout
- **Showcase Page**: Headers and paragraph text validation
- **TodoMVC**: Task management (from To-Do Page)

## 🏗️ Architecture & Patterns

### Page Object Model (POM)
Each page has a dedicated class that:
- Encapsulates UI locators as readonly properties
- Groups related test methods (validation, interaction, navigation)
- Accepts Playwright fixtures (page, request) as parameters
- Uses TypeScript interfaces for type-safe test data

**Example POM Structure:**
```typescript
export class HomePage {
  readonly menuItem: Locator;
  readonly header: Locator;

  constructor(public readonly page: Page) {
    this.menuItem = this.page.locator('a[class^="jw-menu"]');
    this.header = this.page.locator('h1');
  }

  async gotoPage(page: Page, request: APIRequestContext) {
    const response = await request.get(url);
    await expect(response).toBeOK();
    await page.goto(url, { waitUntil: "commit" });
  }
}
```

### Data-Driven Testing
Tests use interface-defined objects for scalable test data:
```typescript
const testCases = [
  { name: "John", email: "john@example.com" },
  { name: "Jane", email: "jane@example.com" }
];

for (const testCase of testCases) {
  await form.fill(testCase);
  await form.submit();
}
```

### Navigation & Validation Strategy
- API validation before UI navigation (using `request.get()`)
- Explicit URL waiting with timeouts (`waitForURL()`)
- Visibility assertions before interactions
- Soft assertions for non-blocking validations

## ⚙️ Configuration

**Key Settings** (in `playwright.config.ts`):
- **Base URL**: `https://free-5288352.webadorsite.com/`
- **Parallel Execution**: Enabled by default (`fullyParallel: true`)
- **CI Behavior**: 2 retries, single worker
- **Browsers**: Chromium, Firefox, WebKit
- **Traces**: Collected on first retry for debugging

## 🛠️ Development Guide

### Adding a New Test
1. Create a POM class in `tests/POM/new-page.ts`
2. Define page locators and methods
3. Create test file `tests/new-page.spec.ts`
4. Use `test.describe()` and `test.beforeEach()` for setup
5. Implement data-driven tests where applicable

### Common Assertions
```typescript
// Soft assertions (non-blocking)
await expect.soft(element).toHaveText("Expected");

// Element count validation
await expect(elements).toHaveCount(5);

// Attribute validation
await expect(element).toHaveAttribute("href", "/expected-url");

// CSS property validation
await expect(element).toHaveCSS("color", "rgb(255, 255, 255)");
```

## 📚 Useful Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Best Practices](https://playwright.dev/docs/best-practices)
- Test Reports: `playwright-report/index.html`

## 📋 Known Quirks

- **Dynamic Class Names**: Site uses `[class^="jw-*"]` prefixes; use attribute selectors instead of exact class matches
- **Mobile Tests**: Currently commented out in config (can be enabled as needed)
- **To-Do Tests**: Reference implementation in `test-1.spec.ts` (skipped with `.describe.skip()`)
- **Common Methods**: `commonly-used-methods.ts` provides reusable validation utilities

## 🤝 Contributing

When working on this project:
- Follow the POM pattern for new pages
- Use TypeScript interfaces for test data
- Add JSDoc comments to public methods
- Keep tests isolated and data-driven
- Use meaningful test descriptions

---
