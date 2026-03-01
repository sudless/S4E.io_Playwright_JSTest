export function generateUniqueEmail() {
    const timestamp = Date.now();
    return `testuser${timestamp}@example.com`;
}

export function generateStrongPassword() {
    return `StrongPass${Date.now()}!`;
}
export async function expectValidationMessage(locator, message) {
    await expect(locator).toHaveText(message);
}