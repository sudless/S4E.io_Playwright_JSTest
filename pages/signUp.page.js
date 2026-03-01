export class SignUpPage {
    constructor(page) {
        this.page = page;

        this.firstNameInput = page.getByLabel('First Name');
        this.lastNameInput = page.getByLabel('Last Name');
        this.emailInput = page.getByLabel('Email');
        this.passwordInput = page.getByLabel('Password');
        this.confirmPasswordInput = page.getByLabel('Confirm Password');
        this.termsCheckbox = page.getByRole('checkbox');
        this.submitButton = page.getByRole('button', { name: 'Sign Up' });
    }

    async fillForm(user) {
        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.emailInput.fill(user.email);
        await this.passwordInput.fill(user.password);
        await this.confirmPasswordInput.fill(user.password);
    }

    async submit() {
        await this.submitButton.click();
    }
}