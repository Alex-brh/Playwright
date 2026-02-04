import { type Page, type Locator, expect } from "@playwright/test";

interface TestimonialDetails {
    expectedTestimonialsCount: number;
    index: number;
    expectedTestimonialsText: string;
}

export class CustomerTestimonials {
    private readonly testimonials: Locator;
    readonly nameInputField: Locator;
    readonly emailAddressInputField: Locator;
    readonly messageInputField: Locator;
    readonly submitCommentButton: Locator;
    readonly errorSayingSomethingWentWrong: Locator;
    readonly errorMessages: Locator;
    readonly customerComment: Locator;

    // Initialize the CustomerTestimonials with the provided Page object.
    constructor(public readonly page: Page) {

        // Locator for customer testimonials paragraphs.
        this.testimonials = this.page.locator('div[class="jw-element-imagetext-text"] > p');
        // Locator for the 'Name' input field in the testimonial submission form.
        this.nameInputField = this.page.locator('input[id="name"]');
        // Locator for the 'Email Address' input field in the testimonial submission form.
        this.emailAddressInputField = this.page.locator('input[id="email"]');
        // Locator for the 'Message' textarea in the testimonial submission form.
        this.messageInputField = this.page.locator('textarea[id="body"]');
        // Locator for the 'Submit comment' button in the testimonial submission form.
        this.submitCommentButton = this.page.locator('button[name="submit"]');
        // Locator for the 'Oops! Something went wrong.' error message.
        this.errorSayingSomethingWentWrong = this.page.locator('div[class="jw-element-form-error jw-comment-error"]')
        // A set of error messages differring by element index
        this.errorMessages = this.page.locator('div[class="jw-element-form-error jw-comment-error"] > ul > li');
        // Locator for the customer comment
        this.customerComment = this.page.locator('div[class="jw-comment "] > p');
    }

    // **************************************************************************************************************
    /**
     * @description Validate that the customer testimonials section(s) is(are) visible on the page.
     * @param testimonialDetails 
     * @example
     * const testimonialDetails = {
     *   expectedTestimonialsCount: 5,
     *   index: 0,
     *   expectedTestimonialsText: 'This is the content of the first testimonial.'
     * };
     */
    async validateCustomerTestimonialsVisible(testimonialDetails: TestimonialDetails): Promise<void> {
        const { expectedTestimonialsCount, index, expectedTestimonialsText } = testimonialDetails;
        await expect(this.testimonials).toHaveCount(expectedTestimonialsCount);
        await expect(this.testimonials.nth(index)).toBeAttached();
        // Ensure the element is scrolled into view before visibility/assertions
        await this.testimonials.nth(index).scrollIntoViewIfNeeded();
        await this.testimonials.nth(index).waitFor({ state: 'visible', timeout: 5000 })
        await expect(this.testimonials.nth(index)).toBeVisible();
        // Validate that the testimonial text is not empty.
        const testimonialText = await this.testimonials.nth(index).innerText();
        expect(testimonialText.trim().length).toBeGreaterThan(0);
        await expect(this.testimonials.nth(index)).toHaveText(expectedTestimonialsText);
    }

    // **************************************************************************************************************
    /**
     * @description Validate error messages when submitting a comment without filling the form.
     * @example
     * await customerTestimonials.validateSubmitCommentErrors();
     */
    async validateSubmitCommentErrors(): Promise<void> {
        // Make sure the 'Name' input field is empty.
        await expect(this.nameInputField).toBeEmpty();
        await expect(this.nameInputField).toBeEditable();
        // Make sure the 'Email Address' field is empty.
        await expect(this.emailAddressInputField).toBeEmpty();
        await expect(this.nameInputField).toBeEditable();
        // Make sure the 'Message' text area is empty.
        await expect(this.messageInputField).toBeEmpty();
        await expect(this.messageInputField).toBeEnabled();
        // Make sure the 'Submit comment' button exists and is clickable
        await expect(this.submitCommentButton).toBeAttached();
        await expect(this.submitCommentButton).toBeEnabled();
        await this.submitCommentButton.click();
        // Ensure error messages show up
        await expect(this.errorSayingSomethingWentWrong.locator('strong')).toBeAttached(); // Child element
        await this.errorSayingSomethingWentWrong.locator('strong').scrollIntoViewIfNeeded();
        // Validate error messages
        await expect(this.errorSayingSomethingWentWrong.locator('strong')).toBeVisible(); // Child element
        await expect(this.errorSayingSomethingWentWrong.locator('strong')).toHaveText('Oops! Something went wrong.');
        await expect(this.errorSayingSomethingWentWrong).toBeAttached();
        await expect(this.errorSayingSomethingWentWrong).toContainText('Check the following fields and try again:');
        const errors = [
            `Name is a required field.`,
            `Email address is a required field.`,
            `Message is a required field.`,
            `Field is required`
        ];
        for (const [i, expected] of errors.entries()) {
            console.log(`Validating error ${i}: ${expected}`);
            const msg = this.errorMessages.nth(i);
            await msg.scrollIntoViewIfNeeded();
            await expect(msg).toBeVisible();
            await expect(msg).toHaveText(expected);
        }
    }
    // **************************************************************************************************************
    /**
    * @description Validate that the customer comment is visible on the page.
    * @example
    * await customerTestimonials.validateCustomerCommentVisible({ comment, index });
    */
    async validateCustomerCommentVisible({ comment, index }: { comment: string; index: number }): Promise<void> {
        console.log(`Validating customer comment: ${comment} at index ${index}`);
        await expect(this.customerComment.nth(index)).toBeAttached();
        await this.customerComment.nth(index).scrollIntoViewIfNeeded();
        await expect(this.customerComment.nth(index)).toBeVisible();
        await expect(this.customerComment.nth(index)).toHaveText(comment);
    }

}