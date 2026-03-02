import { test, expect } from '@playwright/test';
import { SignUpPage } from '../../pages/signUp.page';
import { createValidUser, invalidEmails } from '../../testData/signUp.data';
import {
    generateShortPassword,
    generateNoUppercasePassword,
    generateNoLowercasePassword
} from '../../utilities/validationHelpers';

test.describe('Sign Up Tests', (role, options) => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://app.s4e.io/sign-up');
        await page.route('**/register', async route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    redirectUrl: '/confirmation-required'
                })
            });
        });
    });

    test('User can successfully sign up with valid data, filling voluntary fields', async ({ page }) => {
        const signUpPage = new SignUpPage(page);

        const user = createValidUser();

        await signUpPage.fillFormVoluntary(user);
        await signUpPage.termsCheckbox.check();
        await signUpPage.submit();
        // captcha bypass in this file ( used because I have no access to test environment) doesn't allow real backend actions, this case cant be tested
        // if not in test environment with disabled captcha
        await expect(page).toHaveURL('https://app.s4e.io/confirmation-required');
    });
    test('User can successfully sign up without filling voluntary fields', async ({ page }) => {
        const signUpPage = new SignUpPage(page);

        const user = createValidUser();

        await signUpPage.fillFormMandatory(user);

        await signUpPage.termsCheckbox.check();
        await signUpPage.submit();

        await expect(page).toHaveURL('https://app.s4e.io/confirmation-required');
    });
    test("User cannot sign up with password below minimum length", async ({ page }) => {
        const signUpPage = new SignUpPage(page);

        const user = createValidUser();
        user.password = generateShortPassword();
        await signUpPage.fillFormMandatory(user);

        await signUpPage.termsCheckbox.check();

        await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
    });
    test("User cannot sign up with password missing at least one uppercase letter", async ({ page }) => {
        const signUpPage = new SignUpPage(page);

        const user = createValidUser();
        user.password = generateNoUppercasePassword();
        await signUpPage.fillFormMandatory(user);

        await signUpPage.termsCheckbox.check();
        await signUpPage.submit();

        await expect(page.getByText('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one number')).toBeVisible();
    });
    test("User cannot sign up with password missing at least one lowercase letter", async ({ page }) => {
        const signUpPage = new SignUpPage(page);

        const user = createValidUser();
        user.password = generateNoLowercasePassword();
        await signUpPage.fillFormMandatory(user);

        await signUpPage.termsCheckbox.check();
        await signUpPage.submit();

        await expect(page.getByText('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one number')).toBeVisible();
    });
    test('User cannot sign up with empty required fields', async ({ page }) => {
        const signUpPage = new SignUpPage(page);

        await signUpPage.termsCheckbox.check();
        await signUpPage.submit();

        await expect(page.getByText('Email is required')).toBeVisible();
        await expect(page.getByText('Password is required')).toBeVisible();
        await expect(page.getByText('Password again is required')).toBeVisible();

    });
    test('User cannot sign up with invalid email format', async ({ page }) => {
        const signUpPage = new SignUpPage(page);

        for (const invalidEmail of invalidEmails) {

            const user = createValidUser();
            user.email = invalidEmail;

            await page.goto('https://app.s4e.io/sign-up'); 

            await signUpPage.fillFormMandatory(user);
            await signUpPage.termsCheckbox.check();
            await signUpPage.submit();

            await expect(
                page.getByText(/email must be a valid email address/i)
            ).toBeVisible();

            await expect(page).toHaveURL(/sign-up/);
        }
    });
    test('User cannot sign up when passwords do not match', async ({ page }) => {
        const signUpPage = new SignUpPage(page);

        const user = createValidUser();

        await signUpPage.emailInput.fill(user.email);
        await signUpPage.passwordInput.fill(user.password);
        await signUpPage.confirmPasswordInput.fill('DifferentPass123!');

        await signUpPage.termsCheckbox.check();
        await signUpPage.submit();

        await expect(page.getByText('The passwords you entered do not match each other')).toBeVisible();
        await expect(page).toHaveURL(/sign-up/);
    });
    test('User must accept terms and conditions to sign up', async ({ page }) => {
        const signUpPage = new SignUpPage(page);

        const user = createValidUser();

        await signUpPage.fillFormMandatory(user);

        //await expect(signUpPage.submitButton).toHaveAttribute('tabindex', '-1');
        await expect(signUpPage.submitButton).toBeDisabled();
    });
    test('User cannot sign up with already registered email', async ({ page }) => {
        let signUpPage = new SignUpPage(page);
        const user = createValidUser();

        await signUpPage.fillFormMandatory(user);
        await signUpPage.termsCheckbox.check();
        await signUpPage.submit();

        await page.goto('https://app.s4e.io/sign-up');

        signUpPage = new SignUpPage(page);
        // captcha bypass in this file ( used because I have no access to test environment) doesn't allow real backend actions, this case cant be tested
        // if not in test environment with disabled captcha
        await signUpPage.fillFormMandatory(user);
        await signUpPage.termsCheckbox.check();
        await signUpPage.submit();

        await expect(page.getByText('You have already a member of S4E.')).toBeVisible();
        await expect(page).toHaveURL(/sign-up/);
    });
    test('User cannot sign up with a phone Number below minimum length', async ({ page }) => {
        const signUpPage = new SignUpPage(page);

        const user = createValidUser();
        user.phoneNumber = '123';
        await signUpPage.fillFormMandatory(user);
        await signUpPage.phoneNumInput.fill(user.phoneNumber);
        await signUpPage.termsCheckbox.check();

        await expect(signUpPage.submitButton)
            .toHaveAttribute('tabindex', '-1');

        await expect(page).toHaveURL(/sign-up/);
    });
    test('User cannot sign up with a phone number exceeding maximum length', async ({ page }) => {
        const signUpPage = new SignUpPage(page);

        const user = createValidUser();
        user.phoneNumber = '12345678901234567890';

        await signUpPage.fillFormMandatory(user);
        await signUpPage.phoneNumInput.fill(user.phoneNumber);
        await signUpPage.termsCheckbox.check();

        await expect(signUpPage.submitButton)
            .toHaveAttribute('tabindex', '-1');

        await expect(page).toHaveURL(/sign-up/);
    });
    test('User is directed to terms and conditions page when they click Terms links', async ({ page, context }) => {

        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            page.getByRole('link', { name: 'Terms of Service', exact: true }).click()
        ]);

        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL('https://s4e.io/terms-of-use');
        await newPage.close();


        await page.goto('https://app.s4e.io/sign-up');

        const [newPage2] = await Promise.all([
            context.waitForEvent('page'),
            page.getByRole('link', { name: 'Terms', exact: true }).click()
        ]);

        await newPage2.waitForLoadState();
        await expect(newPage2).toHaveURL('https://s4e.io/terms-of-use');

    });
    test('User is directed to Plans page when they click Plans link', async ({  page, context }) => {
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            page.getByRole('link', { name: 'Plans' }).click()
        ]);

        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL('https://s4e.io/pricing');
    });
    test('User is directed to Contact page when they click Contact Us link', async ({  page }) => {
        await page.getByRole('link', { name: 'Contact Us', exact: true }).click();
        await expect(page).toHaveURL('https://s4e.io/contact');
    });
    test('User is directed to s4e.io main page when they click S4E.io link', async ({  page, context }) => {
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            page.getByRole('link', { name: 'S4E.io' }).click()
        ]);

        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL('https://s4e.io/');
    });
    test('User is directed to Privacy Policy page when they click Privacy Policy link', async ({  page, context }) => {
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            page.getByRole('link', { name: 'Privacy Policy' }).click()
        ]);

        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL('https://s4e.io/privacy-policy');
    });
    test('Signup should reject SQL injection attempt', async ({ page }) => {
        const signUpPage = new SignUpPage(page);

        await page.goto('https://app.s4e.io/sign-up');

        await signUpPage.emailInput.fill("' OR 1=1 --");
        await signUpPage.passwordInput.fill("StrongPass123!");
        await signUpPage.confirmPasswordInput.fill("StrongPass123!");
        await signUpPage.termsCheckbox.check();

        await signUpPage.submit();

        await expect(page.getByText('Email must be a valid email address')).toBeVisible();
    });
    test('Signup should sanitize script input', async ({ page }) => {
        const signUpPage = new SignUpPage(page);

        await page.goto('https://app.s4e.io/sign-up');

        await signUpPage.emailInput.fill(`xss${Date.now()}@test.com`);
        await signUpPage.passwordInput.fill("StrongPass123!");
        await signUpPage.confirmPasswordInput.fill("StrongPass123!");
        await signUpPage.termsCheckbox.check();

        await signUpPage.submit();

        await expect(page.locator('text=<script>')).not.toBeVisible();
    });
    test('Signup page should enforce HTTPS', async ({ page }) => {
        await page.goto('http://app.s4e.io/sign-up');

        await expect(page).toHaveURL(/^https:/);
    });
});
