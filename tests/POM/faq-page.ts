import { type Page, type Locator, expect } from "@playwright/test";

interface QuestionAnswerAndDisclaimer {
    questionAndAnswer?: string;
    bottomDisclaimer?: string;
}

export class FaqPage {
    private readonly topQuestionAndAnswer: Locator;
    private readonly bottomDisclaimer: Locator;

    constructor(public readonly page: Page) {
        this.topQuestionAndAnswer = this.page.locator('div[class="jw-element-imagetext-text"] > p').nth(0);
        this.bottomDisclaimer = this.page.locator('div[class="jw-element-imagetext-text"] > p').nth(1);
    }

    async validateTopQuestionAnswer(questionAnswerAndDisclaimer: QuestionAnswerAndDisclaimer) {
        const { questionAndAnswer, bottomDisclaimer } = questionAnswerAndDisclaimer;
        if (questionAndAnswer) {
            await expect(this.topQuestionAndAnswer).toHaveText(questionAndAnswer);
        }
        if (bottomDisclaimer) {
            await expect(this.bottomDisclaimer).toHaveText(bottomDisclaimer);
        }
    }
}
