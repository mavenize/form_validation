// All copy for the sign-up form. Headings and placeholders follow design/style_example.png.

export const passwordRules = {
  minLength: 8,
};

export const fields = {
  email: {
    id: "email",
    name: "email",
    label: "Email",
    placeholder: "Email",
    type: "email",
    autocomplete: "email",
  },
  country: {
    id: "country",
    name: "country",
    label: "Country / Region",
    placeholder: "Country / Region",
    autocomplete: "country",
  },
  postalCode: {
    id: "postal-code",
    name: "postalCode",
    label: "Postal Code",
    placeholder: "Postal Code",
    type: "text",
    autocomplete: "postal-code",
  },
  password: {
    id: "password",
    name: "password",
    label: "Password",
    placeholder: "Password",
    type: "password",
    autocomplete: "new-password",
    hint: `At least ${passwordRules.minLength} characters, with an uppercase letter, a lowercase letter and a number.`,
  },
  confirmPassword: {
    id: "confirm-password",
    name: "confirmPassword",
    label: "Confirm password",
    placeholder: "Confirm password",
    type: "password",
    autocomplete: "new-password",
  },
};

export const sections = [
  { id: "contact", heading: "Contact information", fields: ["email"] },
  { id: "shipping", heading: "Shipping", fields: ["country", "postalCode"] },
  {
    id: "password",
    heading: "Password",
    fields: ["password", "confirmPassword"],
  },
];

export const messages = {
  email: {
    required: "Enter your email address.",
    invalid: "Enter an email address like name@example.com.",
  },
  country: {
    required: "Choose your country or region.",
  },
  postalCode: {
    required: "Enter your postal code.",
    noCountry: "Choose a country first, so the postal code can be checked.",
    invalid: (countryName, example) =>
      `Enter a valid ${countryName} postal code, like ${example}.`,
  },
  password: {
    required: "Enter a password.",
    tooShort: (minLength) => `Use at least ${minLength} characters.`,
    noUppercase: "Add at least one uppercase letter.",
    noLowercase: "Add at least one lowercase letter.",
    noDigit: "Add at least one number.",
  },
  confirmPassword: {
    required: "Confirm your password.",
    mismatch: "The passwords don't match.",
  },
};

export const formCopy = {
  title: "Sign up",
  submit: "Continue to payment",
  postalCodeExample: (example) => `Postal Code, e.g. ${example}`,
  errorSummary: (count) =>
    count === 1
      ? "Please fix the highlighted field before continuing."
      : `Please fix the ${count} highlighted fields before continuing.`,
};

export const successCopy = {
  emoji: "🙌",
  heading: "High five!",
  body: "Everything checks out. Your details are valid.",
  restart: "Start over",
};
