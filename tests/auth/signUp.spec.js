import { test, expect } from '@playwright/test';

test.describe('Sign Up - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://app.s4e.io/sign-up');
    });

    test('User can successfully sign up with valid data', async ({ page }) => {
        // Fill all required fields with valid data
        // Click submit
        // Assert success message OR redirect OR dashboard visibility
    });

    test('User cannot sign up with empty required fields', async ({ page }) => {
        // Click submit without filling fields
        // Assert validation messages are shown
    });

    test('User cannot sign up with invalid email format', async ({ page }) => {
        // Fill invalid email
        // Submit
        // Assert email validation message
    });

    test('User cannot sign up when passwords do not match', async ({ page }) => {
        // Fill different password & confirm password
        // Submit
        // Assert mismatch error
    });

    test('User must accept terms and conditions to sign up', async ({ page }) => {
        // Fill valid data
        // Do NOT check terms checkbox
        // Submit
        // Assert submission blocked
    });

    test('User cannot sign up with already registered email', async ({ page }) => {
        // Register once
        // Try registering again with same email
        // Assert duplicate email error
    });

});