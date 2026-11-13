import { createEl } from "../utils/dom.js";
import { createField } from "../components/field.js";
import { createButton } from "../components/button.js";
import { fields, sections, formCopy } from "../data/form.js";
import { countries } from "../data/countries.js";
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

export function createSignupForm() {
  const page = createEl("main", { className: "page" });
  const form = createEl("form", {
    className: "signup",
    attrs: { novalidate: "" },
  });

  sections.forEach((section) => form.appendChild(createSection(section)));

  form.appendChild(
    createEl("p", {
      className: "signup__message",
      attrs: { id: "form-message", role: "alert" },
    }),
  );

  const actions = createEl("div", { className: "signup__actions" });
  actions.appendChild(createButton(formCopy.submit, { type: "submit" }));
  form.appendChild(actions);

  page.appendChild(form);
  return page;
}
