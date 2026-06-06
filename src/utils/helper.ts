import { createNavigationContainerRef } from "@react-navigation/native";

/**
 * <> Get the current route name from the navigation ref.
 */
export const navigationRef = createNavigationContainerRef<any>();

export function getCurrentRouteName() {
    if (navigationRef.isReady()) {
        return navigationRef.getCurrentRoute()?.name;
    } else {
        return undefined;
    }
}

/**
 * Validates an email address using a regular expression.
 * <>inspired by: https://stackoverflow.com/questions/43676695/email-validation-react-native-returning-the-result-as-invalid-for-all-the-e
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email is valid, false otherwise.
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates an email address using a regular expression.
 * <>inspired by: https://stackoverflow.com/questions/12090077/javascript-regular-expression-password-validation-having-special-characters
 * @param {string} password - The email address to validate.
 * @returns {boolean} - True if the email is valid, false otherwise.
 */
export const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return passwordRegex.test(password);
};
