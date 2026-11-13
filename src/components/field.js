import { createEl } from "../utils/dom.js";
import "./field.css";

function createControl(config, options) {
  const attrs = {
    id: config.id,
    name: config.name,
    autocomplete: config.autocomplete,
    required: "",
  };

  if (!options) {
    return createEl("input", {
      className: "field__control",
      attrs: { ...attrs, type: config.type, placeholder: config.placeholder },
    });
  }

  const select = createEl("select", {
    className: "field__control field__control--select",
    attrs,
  });
  select.appendChild(
    createEl("option", {
      text: config.placeholder,
      attrs: { value: "", disabled: "", selected: "" },
    }),
  );
  options.forEach(({ value, label }) => {
    select.appendChild(createEl("option", { text: label, attrs: { value } }));
  });
  return select;
}

// Builds one form field: a label (visually hidden, as the design shows placeholders only),
// the input or select, an optional hint and an empty error message for validation to fill.
// Pass `options` ([{ value, label }]) to get a select instead of an input.
export function createField(config, { options, className } = {}) {
  const field = createEl("div", {
    className: className ? `field ${className}` : "field",
  });

  const label = createEl("label", {
    className: "field__label visually-hidden",
    text: config.label,
    attrs: { for: config.id },
  });

  const control = createControl(config, options);
  const describedBy = [];

  field.appendChild(label);

  if (options) {
    const wrap = createEl("div", { className: "field__select-wrap" });
    wrap.appendChild(control);
    field.appendChild(wrap);
  } else {
    field.appendChild(control);
  }

  if (config.hint) {
    const hintId = `${config.id}-hint`;
    field.appendChild(
      createEl("p", {
        className: "field__hint",
        text: config.hint,
        attrs: { id: hintId },
      }),
    );
    describedBy.push(hintId);
  }

  const errorId = `${config.id}-error`;
  field.appendChild(
    createEl("p", {
      className: "field__error",
      attrs: { id: errorId, "aria-live": "polite" },
    }),
  );
  describedBy.push(errorId);

  control.setAttribute("aria-describedby", describedBy.join(" "));
  return field;
}
