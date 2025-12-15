import { type Page, type Locator, expect } from "@playwright/test";

interface TestimonialDetails {
    expectedTestimonialsCount: number;
    index: number;
    expectedTestimonialsText: string;
}

export class CustomerTestimonials {
    private readonly testimonials: Locator;

    // Initialize the CustomerTestimonials with the provided Page object.
    constructor(public readonly page: Page) {

        // Locator for customer testimonials paragraphs.
        this.testimonials = this.page.locator('div[class="jw-element-imagetext-text"] > p');

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


}