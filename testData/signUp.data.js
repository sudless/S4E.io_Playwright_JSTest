import { generateUniqueEmail, generateUniquePhoneNumber} from '../utilities/validationHelpers';


export function createValidUser() {
    return {
        email: generateUniqueEmail(),
        password: 'StrongPass123!',
        phoneNumber: generateUniquePhoneNumber()
    };
}

export const invalidEmails = [
    'invalidPlain',
    'missingAt.com',
    'test@.com',
    'test@com',
    'test@domain.'
];


export const mismatchedPasswords = {
    password: 'StrongPass123!',
    confirmPassword: 'DifferentPass123!'
};