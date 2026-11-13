import { createEl } from "../utils/dom.js";
import "./button.css";

// Solid black button from the design. `type` defaults to "button" so only an explicit
// "submit" ever submits a form.
export function createButton(text, { type = "button", className } = {}) {
  return createEl("button", {
    className: className ? `button ${className}` : "button",
    text,
    attrs: { type },
  });
}
