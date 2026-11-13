import { createEl } from "../utils/dom.js";
import { createField } from "../components/field.js";
import { createButton } from "../components/button.js";
import { fields, sections, formCopy } from "../data/form.js";
import { countries } from "../data/countries.js";
import { createSuccessPanel } from "../components/successPanel.js";
import {
  bindLiveValidation,
  validateAll,
  countInvalid,
} from "../validation/liveValidation.js";
import "./signupForm.css";

// Fields that share a row with a neighbour from the tablet breakpoint up, as in the design.
const HALF_WIDTH_FIELDS = new Set([
  "postalCode",
  "password",
  "confirmPassword",
]);

const countryOptions = countries.map(({ code, name }) => ({
  value: code,
  label: name,
}));

function createSection({ heading, fields: fieldNames }) {
  const fieldset = createEl("fieldset", { className: "signup__section" });
  fieldset.appendChild(
    createEl("legend", { className: "signup__heading", text: heading }),
  );

  const grid = createEl("div", { className: "signup__fields" });
  fieldNames.forEach((name) => {
    grid.appendChild(
      createField(fields[name], {
        options: name === "country" ? countryOptions : undefined,
        className: HALF_WIDTH_FIELDS.has(name) ? "field--half" : undefined,
      }),
    );
  });
  fieldset.appendChild(grid);
  return fieldset;
}

function createForm({ onSuccess }) {
  const form = createEl("form", {
    className: "signup",
    attrs: { novalidate: "" },
  });

  // The design has no visible page title; this gives screen-reader users a heading to land on.
  form.appendChild(
    createEl("h1", { className: "visually-hidden", text: formCopy.title }),
  );

  sections.forEach((section) => form.appendChild(createSection(section)));

  const message = createEl("p", {
    className: "signup__message",
    attrs: { id: "form-message", role: "alert" },
  });
  form.appendChild(message);

  const actions = createEl("div", { className: "signup__actions" });
  actions.appendChild(createButton(formCopy.submit, { type: "submit" }));
  form.appendChild(actions);

  bindLiveValidation(form);

  // Once the summary is showing, keep its count in step with the fields and clear it when
  // everything is fixed. Registered after bindLiveValidation so validity is already updated.
  const refreshMessage = () => {
    if (!message.textContent) return;
    const count = countInvalid(form);
    message.textContent = count ? formCopy.errorSummary(count) : "";
  };
  form.addEventListener("input", refreshMessage);
  form.addEventListener("focusout", refreshMessage);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const invalid = validateAll(form);

    if (invalid.length) {
      message.textContent = formCopy.errorSummary(invalid.length);
      form.elements[invalid[0]].focus();
      return;
    }

    message.textContent = "";
    onSuccess();
  });

  return form;
}

// The page swaps between the form and the high-five panel. "Start over" builds a fresh
// form, so no values or validation state carry over.
export function createSignupForm() {
  const page = createEl("main", { className: "page" });

  const showForm = () => {
    const form = createForm({ onSuccess: showSuccess });
    page.replaceChildren(form);
    return form;
  };

  const showSuccess = () => {
    const panel = createSuccessPanel({
      onRestart: () => showForm().elements.email.focus(),
    });
    page.replaceChildren(panel);
    panel.focus();
  };

  showForm();
  return page;
}
