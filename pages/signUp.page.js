export class SignUpPage {
    async selectIndustry(value) {
        await this.chooseIndustry.click();
        await this.page.getByRole('listbox').getByText(value, { exact: true }).click();    }

    async selectPosition(value) {
        await this.choosePosition.click();
        await this.page.getByRole('listbox').getByText(value, { exact: true }).click();    }
    constructor(page) {
        this.page = page;
        this.emailInput = page.getByLabel(/Email/i);
        this.passwordInput = page.locator('#auth-element-register-password');
        this.confirmPasswordInput = page.locator('#auth-element-register-password-again');
        this.phoneNumInput = page.locator("//input[@type='tel']");
        this.chooseIndustry = page.getByRole('combobox', { name: /Industry/i });
        this.choosePosition = page.getByRole('combobox', { name: /Position/i });
        this.termsCheckbox = page.locator('#register-is-term-check');
        this.submitButton = page.locator('button[type="submit"]');

    }

    async fillFormVoluntary(user) {
        await this.emailInput.fill(user.email);
        await this.passwordInput.fill(user.password);
        await this.confirmPasswordInput.fill(user.password);
        await this.phoneNumInput.fill(user.phoneNumber);
        await this.selectIndustry('IT');
        await this.selectPosition('Manager');
    }
    async fillFormMandatory(user) {
        await this.emailInput.fill(user.email);
        await this.passwordInput.fill(user.password);
        await this.confirmPasswordInput.fill(user.password);
    }
    async submit() {
        await this.submitButton.click();
    }
}