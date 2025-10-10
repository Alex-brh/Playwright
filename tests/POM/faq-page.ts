import { type Page, type Locator, expect } from "@playwright/test";

interface QuestionAnswerAndDisclaimer {
    questionAndAnswer?: string;
    bottomDisclaimer?: string;
}
interface H3Text {
    index: number;
    text: string;
}
interface Section {
    index: number;
    text: string;
}

export class FaqPage {
    private readonly topQuestionAndAnswer: Locator;
    private readonly bottomDisclaimer: Locator;
    private readonly h3Text: Locator;
    private readonly caretToExpandSection: Locator;
    private readonly sectionText: Locator;
    private readonly sectionDetails: Locator; // To validate if a section is open or close.

    constructor(public readonly page: Page) {
        this.topQuestionAndAnswer = this.page.locator('div[class="jw-element-imagetext-text"] > p').nth(0);
        this.bottomDisclaimer = this.page.locator('div[class="jw-element-imagetext-text"] > p').nth(1);
        this.h3Text = this.page.locator('summary > h3');
        this.caretToExpandSection = this.page.locator('i[class="jw-element-accordion__icon website-rendering-icon-right-open"]');
        this.sectionText = this.page.locator('div[class="jw-element-accordion__content-wrap"] > p > span');
        this.sectionDetails = this.page.locator('details[class="jw-element-accordion__item"]');

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

    async expandSectionAndValidateText(section: Section) {
        const { index, text } = section;
        if (text !== undefined && text !== null) {
            await this.caretToExpandSection.nth(index).isEnabled();
            await this.caretToExpandSection.nth(index).click();
            await expect(this.sectionDetails.nth(index)).toHaveAttribute('open'); // Validate that section is open.
            await expect(this.sectionText.nth(index)).toBeAttached();
            await expect(this.sectionText.nth(index)).toHaveText(text);
        }

    }
}
