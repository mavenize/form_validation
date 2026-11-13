# form_validation

A sign-up form with live inline validation, built with plain JavaScript and bundled with Webpack.

**Live demo:** https://mavenize.github.io/form_validation/

## What it does

- Collects Email, Country, Postal Code, Password and Password Confirmation.
- Validates as you type and when you leave a field. Invalid fields turn red and show a message that says how to fix them.
- Checks postal codes against the chosen country's format (Sweden, Germany, France, Netherlands, United Kingdom, United States). Changing the country re-checks the code.
- Requires passwords to have at least 8 characters, with an uppercase letter, a lowercase letter and a number. The confirmation is re-checked whenever the password changes.
- Blocks submitting while anything is wrong: it shows how many fields need fixing and moves focus to the first one. A valid form gets a high five 🙌.

The `<form>` has `novalidate`, so the browser's own validation bubbles never appear and every check runs in JavaScript. Results are passed to `setCustomValidity`, which means the `:user-valid` and `:user-invalid` CSS pseudo-classes reflect the custom rules and drive the styling.

## Getting started

You need Node.js 20.19 or newer (or 22.13+ or 24+).

```sh
npm install
npm run dev
```

`npm run dev` opens the form at http://localhost:8080 and reloads on changes.

## Scripts

| Command                | What it does                                  |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Dev server with live reload                   |
| `npm run build`        | Production build to `dist/`                   |
| `npm test`             | Unit tests for the validators (`node:test`)   |
| `npm run lint`         | ESLint                                        |
| `npm run format`       | Prettier rewrites every file                  |
| `npm run format:check` | Prettier, check only                          |
| `npm run check`        | Lint, format check, tests and build in one go |

## Project layout

```
src/
  index.js          entry: global CSS and the form section
  template.html     page shell
  data/             all copy, plus the countries and their postal-code patterns
  validation/       validators.js (pure rules) and liveValidation.js (DOM wiring)
  components/       field, button and success panel
  sections/         the sign-up form
  styles/           design tokens and base styles
tests/              validator unit tests
design/             the original brief and style reference
```

## Deploying to GitHub Pages

`dist/` is git-ignored, so the build is force-added and pushed to the `gh-pages` branch as a subtree:

```sh
npm run build
git add dist -f
git commit -m "chore: deploy"
git push origin main
git subtree push --prefix dist origin gh-pages
```

The first time, set **Settings → Pages → Source** to the `gh-pages` branch. The page loads its script by a relative path, so it works under the `/form_validation/` sub-path without extra configuration.
