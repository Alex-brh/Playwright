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
        this.errorSayingSomethingWentWrong = this.page.locator('div[class="jw-element-form-error jw-comment-error"] > strong')
    }

    // **************************************************************************************************************
    // Validate that the customer testimonials section(s) is(are) visible on the page.
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
    // Validate error messages when submitting a comment without filling the form.
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
        await expect(this.errorSayingSomethingWentWrong).toBeAttached();
        await this.errorSayingSomethingWentWrong.scrollIntoViewIfNeeded();


    }


}