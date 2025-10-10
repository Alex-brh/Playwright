import { type Page, type Locator, expect } from "@playwright/test";

export class CustomerTestimonials {
    private readonly topQuestionAndAnswer: Locator;


    constructor(public readonly page: Page) {
        this.topQuestionAndAnswer = this.page.locator('div[class="jw-element-imagetext-text"] > p').nth(0);

    }
}