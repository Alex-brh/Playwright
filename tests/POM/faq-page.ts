import { type Page, type Locator, expect } from "@playwright/test";

/**
 * Interface for validating the top question/answer text and the bottom disclaimer text.
 * @interface
 * @property {string} [questionAndAnswer] - Optional text for the top question and answer.
 * @property {string} [bottomDisclaimer] - Optional text for the bottom disclaimer.
 */
interface QuestionAnswerAndDisclaimer {
    questionAndAnswer?: string;
    bottomDisclaimer?: string;
}

/**
 * Interface for validating a specific H3 text element.
 * @interface
 * @property {number} index - The index of the h3 text element to validate.
 * @property {string} text - The expected text of the h3 element.
 */
interface H3Text {
    index: number;
    text: string;
}

/**
 * Interface for expanding a section and validating its text.
 * @interface
 * @property {number} index - The index of the section to expand.
 * @property {string} text - The expected text content of the expanded section.
 */
interface Section {
    index: number;
    text: string;
}

/**
 * Represents the FAQ page, providing methods for interacting with and validating its elements.
 */
export class FaqPage {
    private readonly topQuestionAndAnswer: Locator;
    private readonly bottomDisclaimer: Locator;
    private readonly h3Text: Locator;
    private readonly caretToExpandSection: Locator;
    private readonly sectionText: Locator;
    private readonly sectionDetails: Locator; // To validate if a section is open or close.

    /**
     * Creates an instance of FaqPage.
     * @param {Page} page - The Playwright Page object.
     */
    constructor(public readonly page: Page) {
        this.topQuestionAndAnswer = this.page.locator('div[class="jw-element-imagetext-text"] > p').nth(0);
        this.bottomDisclaimer = this.page.locator('div[class="jw-element-imagetext-text"] > p').nth(1);
        this.h3Text = this.page.locator('summary > h3');
        this.caretToExpandSection = this.page.locator('i[class="jw-element-accordion__icon website-rendering-icon-right-open"]');
        this.sectionText = this.page.locator('div[class="jw-element-accordion__content-wrap"] > p > span');
        this.sectionDetails = this.page.locator('details[class="jw-element-accordion__item"]');
    }

    /**
     * Validates the text content of the top question and answer block and the bottom disclaimer.
     * @param {QuestionAnswerAndDisclaimer} questionAnswerAndDisclaimer - An object containing the expected text for the question/answer and disclaimer.
     * @returns {Promise<void>}
     * @example
     * await faqPage.validateTopQuestionAnswer({ questionAndAnswer: 'How can I get started?', bottomDisclaimer: 'Additional information.' });
     */
    async validateTopQuestionAnswer(questionAnswerAndDisclaimer: QuestionAnswerAndDisclaimer): Promise<void> {
        const { questionAndAnswer, bottomDisclaimer } = questionAnswerAndDisclaimer;
        if (questionAndAnswer !== undefined && questionAndAnswer !== null) {
            await expect(this.topQuestionAndAnswer).toHaveText(questionAndAnswer);
        }
        if (bottomDisclaimer !== undefined && bottomDisclaimer !== null) {
            await expect(this.bottomDisclaimer).toHaveText(bottomDisclaimer);
        }
    }

    /**
     * Validates the text content of a specific h3 element in an accordion section.
     * @param {H3Text} h3Text - An object specifying the index and expected text of the h3 element.
     * @returns {Promise<void>}
     * @example
     * await faqPage.validateH3Text({ index: 0, text: 'Accordion Section 1' });
     */
    async validateH3Text(h3Text: H3Text): Promise<void> {
        const { index, text } = h3Text;
        if (text !== undefined && text !== null) {
            await expect(this.h3Text.nth(index)).toBeAttached();
            await expect(this.h3Text.nth(index)).toHaveText(text);
        }
    }

    /**
     * Expands an accordion section and validates its displayed text content.
     * @param {Section} section - An object specifying the index of the section to expand and the expected text content.
     * @returns {Promise<void>}
     * @example
     * await faqPage.expandSectionAndValidateText({ index: 0, text: 'This is the content of the first section.' });
     */
    async expandSectionAndValidateText(section: Section): Promise<void> {
        const { index, text } = section;
        if (index !== undefined && index !== null && text !== undefined && text !== null) {
            await this.caretToExpandSection.nth(index).isEnabled();
            await this.caretToExpandSection.nth(index).click();
            await expect(this.sectionDetails.nth(index)).toHaveAttribute('open'); // Validate that section is open.
            await expect(this.sectionText.nth(index)).toBeAttached();
            await expect(this.sectionText.nth(index)).toHaveText(text);
        }
        else {
            throw new Error("The index and text expected values must be provided");
        }
    }
}
