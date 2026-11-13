import { fields, formCopy } from "../data/form.js";
import { validateField, findCountry } from "./validators.js";

// When a field changes, these fields are re-checked too.
const DEPENDENTS = {
  country: ["postalCode"],
  password: ["confirmPassword"],
};

function getValues(form) {
  return Object.fromEntries(
    Object.keys(fields).map((name) => [name, form.elements[name].value]),
  );
}

function isRevealed(control) {
  return control.hasAttribute("data-touched");
}

// Runs the field's validator and stores the result with setCustomValidity, so :invalid,
// :user-invalid and :user-valid follow the custom rules. The message is shown only once the
// field has been left (data-touched), so the first keystrokes are not flagged as errors.
export function updateField(form, name, { touch = false } = {}) {
  const control = form.elements[name];
  const message = validateField(name, getValues(form));
  control.setCustomValidity(message);
  if (touch) control.setAttribute("data-touched", "");

  const shownMessage = isRevealed(control) ? message : "";
  const error = control.closest(".field").querySelector(".field__error");
  error.textContent = shownMessage;

  // Always explicit: without it Chrome reports empty required fields as invalid to screen
  // readers on page load, before the user has done anything.
  control.setAttribute("aria-invalid", shownMessage ? "true" : "false");

  return message;
}

function updatePostalCodePlaceholder(form) {
  const country = findCountry(form.elements.country.value);
  form.elements.postalCode.placeholder = country
    ? formCopy.postalCodeExample(country.example)
    : fields.postalCode.placeholder;
}

function updateDependents(form, name) {
  (DEPENDENTS[name] ?? []).forEach((dependent) => {
    const control = form.elements[dependent];
    if (control.value || isRevealed(control)) updateField(form, dependent);
  });
}

// Checks and reveals every field, as on a submit attempt. Returns the names of invalid
// fields in form order.
export function validateAll(form) {
  return Object.keys(fields).filter(
    (name) => updateField(form, name, { touch: true }) !== "",
  );
}

export function countInvalid(form) {
  return Object.keys(fields).filter(
    (name) => !form.elements[name].validity.valid,
  ).length;
}

export function bindLiveValidation(form) {
  form.addEventListener("input", (event) => {
    const { name } = event.target;
    if (!(name in fields)) return;

    event.target.setAttribute("data-dirty", "");
    // Picking from a select is a finished choice, so it is revealed straight away.
    updateField(form, name, { touch: event.target.tagName === "SELECT" });
    updateDependents(form, name);
    if (name === "country") updatePostalCodePlaceholder(form);
  });

  form.addEventListener("focusout", (event) => {
    const { name } = event.target;
    if (!(name in fields)) return;
    updateField(form, name, { touch: true });
  });

  // Prime every control's validity so the CSS state is right from the first interaction.
  Object.keys(fields).forEach((name) => updateField(form, name));
}
