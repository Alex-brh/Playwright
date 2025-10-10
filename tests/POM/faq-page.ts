import { type Page, type Locator, expect } from "@playwright/test";

interface QuestionAnswerAndDisclaimer {
    questionAndAnswer?: string;
    bottomDisclaimer?: string;
}
interface H3Text {
    index: number;
    text: string;
}

export class FaqPage {
    private readonly topQuestionAndAnswer: Locator;
    private readonly bottomDisclaimer: Locator;
    private readonly h3Text: Locator;

    constructor(public readonly page: Page) {
        this.topQuestionAndAnswer = this.page.locator('div[class="jw-element-imagetext-text"] > p').nth(0);
        this.bottomDisclaimer = this.page.locator('div[class="jw-element-imagetext-text"] > p').nth(1);
        this.h3Text = this.page.locator('summary > h3');
    }

    async validateTopQuestionAnswer(questionAnswerAndDisclaimer: QuestionAnswerAndDisclaimer) {
        const { questionAndAnswer, bottomDisclaimer } = questionAnswerAndDisclaimer;
        if (questionAndAnswer !== undefined && questionAndAnswer !== null) {
            await expect(this.topQuestionAndAnswer).toHaveText(questionAndAnswer);
        }
        if (bottomDisclaimer !== undefined && bottomDisclaimer !== null) {
            await expect(this.bottomDisclaimer).toHaveText(bottomDisclaimer);
        }
    }

    async validateH3Text(h3Text: H3Text) {
        const { index, text } = h3Text;
        if (text !== undefined && text !== null) {
            await expect(this.h3Text.nth(index)).toBeAttached();
            await expect(this.h3Text.nth(index)).toHaveText(text);
        }
    }
}
