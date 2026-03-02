export function generateUniqueEmail() {
    const timestamp = Date.now();
    return `testuser${timestamp}@example.com`;
}

export function generateUniquePhoneNumber() {
    const areaCode = Math.floor(200 + Math.random() * 800);   // 200–999
    const prefix = Math.floor(200 + Math.random() * 800);     // 200–999
    const lineNumber = Math.floor(1000 + Math.random() * 9000); // 1000–9999

    return `${areaCode}${prefix}${lineNumber}`;
}
export const generateShortPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    return Array.from(
        { length: Math.floor(Math.random() * 7) + 1 },
        () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
};
export function generateNoUppercasePassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const length = Math.floor(Math.random() * 5) + 9; // 9–13 characters
    let result = '';

    for (let i = 0; i < length; i++) {
        result += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return result;
}
export const generateNoLowercasePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    return Array.from(
        { length: Math.floor(Math.random() * 5) + 9 },
        () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
};

