# plan.md: form_validation

## Overview

A single-page sign-up form with five fields: Email, Country, Postal Code, Password and Password Confirmation. Each field is validated live and inline. Checks run while the user types and when they leave a field. An invalid field turns red and shows a message that says how to fix it. Submitting with errors shows a form-level message instead of sending anything. A valid submit shows a high five.

Sources:

- `design/initial_plan.md`: the assignment, which defines the behaviour.
- `design/style_example.png`: the look. It's a clean checkout form with light bordered inputs, a chevron select, a geometric sans font and a solid black button.

## Decisions

- **Scope:** only the five assignment fields, styled after the example. The sections are "Contact information" (Email), "Shipping" (Country / Region, Postal Code) and "Password" (Password, Confirm password). The breadcrumb, name, address and city fields, the checkboxes and "Return to Cart" are left out.
- **Native validation is off:** the `<form>` has `novalidate`, so every check runs in JavaScript. The inputs still use their proper types (`email`, `password`) and `required`.
- **One styling mechanism:** every check calls `setCustomValidity(message)`. That way `:user-valid` and `:user-invalid` reflect the custom rules too, and the CSS styles the states from those pseudo-classes alone. An `.is-submitted` class on the form covers fields that were never touched before a submit attempt.
- **Countries and postal codes:** six countries, each with its own pattern. Codes are matched case-insensitively after trimming. The error message shows the country's example format. If no country is chosen yet, the postal-code message asks for a country first.

  | Code | Country        | Pattern                                          | Example  |
  | ---- | -------------- | ------------------------------------------------ | -------- |
  | SE   | Sweden         | `^\d{3} ?\d{2}$`                                 | 113 51   |
  | DE   | Germany        | `^\d{5}$`                                        | 10115    |
  | FR   | France         | `^\d{5}$`                                        | 75008    |
  | NL   | Netherlands    | `^\d{4} ?[A-Z]{2}$`                              | 1012 AB  |
  | GB   | United Kingdom | `^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}\|GIR ?0AA)$` | SW1A 1AA |
  | US   | United States  | `^\d{5}(-\d{4})?$`                               | 90210    |

- **Password:** at least 8 characters, with at least one uppercase letter, one lowercase letter and one digit. The message names the first rule that fails.
- **Confirmation:** must equal the password. It is re-checked whenever the password changes, once the confirmation has a value.
- **Email:** required, and must match `local@domain.tld`, a pragmatic pattern rather than full RFC 5322.
- **Font:** Poppins from a Google Fonts `<link>` in `template.html`. This is a third-party request, which was agreed. The font-family token falls back to the system sans stack.
- **Success:** the form is replaced by a panel with a 🙌 high five and a "Start over" button that brings back an empty form.
- **Tests:** validators are pure functions with no DOM, covered by Node's built-in `node:test`. No test dependency is added.

## Architecture

```
design/                 initial_plan.md, style_example.png (reference only)
src/
  index.js              imports global CSS, appends createSignupForm() to #content
  template.html         <head> with the Poppins link, empty <div id="content">
  data/
    form.js             headings, labels, placeholders, messages, button and success copy
    countries.js        { code, name, pattern, example }
  utils/dom.js          createEl
  validation/
    validators.js       validateEmail, validateCountry, validatePostalCode,
                        validatePassword, validateConfirm, each returning "" or a message
    liveValidation.js   binds input / blur / change events, setCustomValidity, error text
  components/
    field.js/.css       createField(): label, input or select, error <p>
    button.js/.css      createButton()
    successPanel.js/.css createSuccessPanel(): the high five
  sections/
    signupForm.js/.css  createSignupForm(): headings, field grid, form message, submit
  styles/
    tokens.css          colours, type, spacing, radius
    base.css            reset and element defaults
tests/
  validators.test.js    node:test suite
```

**Module pattern:** each component or section exports a `createX()` function. The function returns an element built with `createEl`, and its CSS sits beside it. Copy comes only from `src/data/`.

**Validation flow, per field:**

1. `input` runs the field's validator.
2. `blur` also runs it, which covers fields the user tabs through without typing.
3. The result goes to `setCustomValidity`, the error `<p>` text and `aria-invalid`.
4. Cross-field checks:
   - A Country `change` re-checks Postal Code and swaps its placeholder to the country's example.
   - A Password `input` re-checks Confirm when Confirm has a value.

**Submit flow:**

1. `preventDefault`, validate every field and add `.is-submitted`.
2. If any field is invalid, show "Please fix the N highlighted fields" and focus the first invalid field.
3. Otherwise, show the success panel.

**Layout:** a single column at ≤767 px. From 768 px up, Postal Code takes half a row as in the example, and Password and Confirm sit side by side. The form is capped at the example's width.

## Tasks

Every task also has these implicit DoD items: `npm run check` passes with no errors or warnings, and the task's files are formatted.

### Phase 0: Setup

| ID   | Task                                               | Priority | Definition of Done                                                                                                  |
| ---- | -------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| T-01 | Project setup (Webpack, ESLint, Prettier, scripts) | Must     | `npm run dev` serves the page; lint and format:check pass; `node_modules` and `dist` ignored; build has no warnings |
| T-02 | plan.md, CLAUDE.md and board                       | Must     | No `{{…}}` left in CLAUDE.md; plan.md has all six sections; every task is on the board with its DoD                 |

### Phase 1: Foundation

| ID   | Task                          | Priority | Definition of Done                                                                                                          |
| ---- | ----------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| T-03 | Design tokens and base styles | Must     | Colours only in tokens.css; Poppins loads and renders                                                                       |
| T-04 | Content data and `createEl`   | Must     | All copy in `src/data/`; six countries with pattern and example; `createEl` matches CLAUDE.md                               |
| T-05 | Static form                   | Must     | `<form novalidate>`; every input has a label and a linked error element; layout matches the example at 375, 800 and 1280 px |

### Phase 2: Features

| ID   | Task                              | Priority | Definition of Done                                                                                                                                                |
| ---- | --------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T-06 | Validators and unit tests         | Must     | Every rule has passing and failing cases; each country has valid and invalid samples; `npm test` passes                                                           |
| T-07 | Live validation and state styling | Must     | Errors show while typing and on blur; red invalid state with message; country change re-checks postal code; password change re-checks confirm                     |
| T-08 | Submit handling and high five     | Must     | Empty or invalid submit flags every field and shows the form message; focus moves to the first invalid field; valid submit shows the high five; Start over resets |

### Phase 3: Finish

| ID   | Task                              | Priority | Definition of Done                                                                                 |
| ---- | --------------------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| T-09 | Responsive and accessibility pass | Should   | Checked at 375, 800 and 1280 px; tab order and focus rings correct; errors announced via aria-live |
| T-10 | Test matrix and README            | Should   | Every case in the matrix below checked in Chrome, Firefox and Safari; README has run instructions  |
| T-11 | GitHub Pages deploy               | Could    | Live URL loads and validation works there                                                          |

## Open questions

Until these are answered, the build follows the design as drawn.

1. **Submit button text:** the design says "Continue to payment", which is what the build uses. "Create account" would suit a form with a password better.
2. **"Password" heading:** the design has no matching section, so the heading is new copy.
3. **Valid-state styling:** the design shows no valid state. The build uses a subtle green border. Should it show nothing instead?
4. **Page heading (added in T-09):** the design has no page title, so a visually hidden `<h1>` "Sign up" gives screen-reader users a heading to land on. Is that wording right?

## Verification

**Per task:**

- `npm run format`, then `npm run check`, plus `npm test` from T-06 on.
- Every DoD item is checked before the task moves to Testing.
- Anything that needs a real browser is listed in the hand-off for the user to look at.

**Whole project (T-10 matrix):**

- [ ] Submit the empty form: every field is red, the form message shows, focus is on Email
- [ ] Tab through all fields without typing: each shows its "required" error on blur
- [ ] Email: `a`, `a@`, `a@b` and `a@b.` are rejected; `a@b.se` is accepted, live while typing
- [ ] Each country: one valid and one invalid postal code
- [ ] Enter `113 51` with Sweden, switch to the US: postal code turns invalid; switch back: valid again
- [ ] Postal code entered before any country is chosen: the message asks for a country first
- [ ] Password: too short, no uppercase, no lowercase and no digit each give their own message
- [ ] Confirm mismatch, then fixed by editing the confirmation, and fixed again by editing the password
- [ ] A fully valid submit shows the high five; Start over brings back an empty form with no red fields
- [ ] Layout at 375, 800 and 1280 px
- [ ] Keyboard only: every control reachable, visible focus, Enter submits
- [ ] Chrome, Firefox and Safari behave the same
