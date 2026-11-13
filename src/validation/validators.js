// Pure validators: no DOM access, so they run in the browser and in node:test alike.
// Each returns "" when the value is valid, or the message to show the user.
import { messages, passwordRules } from "../data/form.js";
import { countries } from "../data/countries.js";

// local@domain.tld: no spaces, one @, and a dot followed by at least two characters.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function findCountry(code) {
  return countries.find((country) => country.code === code);
}

export function validateEmail(value) {
  const email = value.trim();
  if (!email) return messages.email.required;
  if (!EMAIL_PATTERN.test(email)) return messages.email.invalid;
  return "";
}

export function validateCountry(code) {
  if (!findCountry(code)) return messages.country.required;
  return "";
}

export function validatePostalCode(value, countryCode) {
  const postalCode = value.trim();
  if (!postalCode) return messages.postalCode.required;

  const country = findCountry(countryCode);
  if (!country) return messages.postalCode.noCountry;
  if (!country.pattern.test(postalCode)) {
    return messages.postalCode.invalid(country.name, country.example);
  }
  return "";
}

// Rules are checked in order and the first one that fails is reported.
export function validatePassword(value) {
  if (!value) return messages.password.required;
  if (value.length < passwordRules.minLength) {
    return messages.password.tooShort(passwordRules.minLength);
  }
  if (!/\p{Lu}/u.test(value)) return messages.password.noUppercase;
  if (!/\p{Ll}/u.test(value)) return messages.password.noLowercase;
  if (!/\d/.test(value)) return messages.password.noDigit;
  return "";
}

export function validateConfirmPassword(value, password) {
  if (!value) return messages.confirmPassword.required;
  if (value !== password) return messages.confirmPassword.mismatch;
  return "";
}

// One entry per field name in data/form.js. Each takes the full set of form values,
// so cross-field rules (postal code needs the country, confirm needs the password) fit the same shape.
export const fieldValidators = {
  email: (values) => validateEmail(values.email),
  country: (values) => validateCountry(values.country),
  postalCode: (values) => validatePostalCode(values.postalCode, values.country),
  password: (values) => validatePassword(values.password),
  confirmPassword: (values) =>
    validateConfirmPassword(values.confirmPassword, values.password),
};

export function validateField(name, values) {
  return fieldValidators[name](values);
}
