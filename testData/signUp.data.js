export const validUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe+test123@example.com',
    password: 'StrongPass123!'
};

export const invalidEmails = [
    'plainaddress',
    'missingatsign.com',
    'user@.com',
    'user@com',
    'user@domain.'
];

export const weakPasswords = [
    '123',
    'password',
    'abcdef',
    'AAAAAA'
];

export const mismatchedPasswords = {
    password: 'StrongPass123!',
    confirmPassword: 'DifferentPass123!'
};