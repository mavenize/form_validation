import { createEl } from "../utils/dom.js";
import { createButton } from "./button.js";
import { successCopy } from "../data/form.js";
import "./successPanel.css";

// The high five shown after a valid submit. Focusable so it can take focus when it
// replaces the form, which makes screen readers announce it.
export function createSuccessPanel({ onRestart }) {
  const panel = createEl("section", {
    className: "success",
    attrs: { tabindex: "-1", "aria-labelledby": "success-heading" },
  });

  panel.appendChild(
    createEl("p", {
      className: "success__emoji",
      text: successCopy.emoji,
      attrs: { "aria-hidden": "true" },
    }),
  );
  panel.appendChild(
    createEl("h1", {
      className: "success__heading",
      text: successCopy.heading,
      attrs: { id: "success-heading" },
    }),
  );
  panel.appendChild(
    createEl("p", { className: "success__body", text: successCopy.body }),
  );

  const restart = createButton(successCopy.restart);
  restart.addEventListener("click", onRestart);
  panel.appendChild(restart);

  return panel;
}
