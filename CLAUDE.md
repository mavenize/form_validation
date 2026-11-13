# form_validation

A browser sign-up form (Email, Country, Postal Code, Password and Password Confirmation) with live inline validation, built as a learning exercise. The UI is in English. The page is rendered entirely from JavaScript and bundled with Webpack.

`design/` is the source of truth: `design/initial_plan.md` for behaviour and `design/style_example.png` for look and copy. Where it disagrees with this project's setup or `plan.md`, this project's setup and `plan.md` win.

`plan.md` holds the full project plan. This file holds the working rules.

## Commands

- `npm run dev`: live dev server at http://localhost:8080
- `npm run build`: production build to `dist/`
- `npm run lint`: ESLint on the whole project
- `npm run format`: Prettier rewrites every file
- `npm test`: unit tests in `tests/` with the built-in `node:test` runner
- `npm run check`: lint, format check, tests and build in one go. This must pass before any task moves to `Testing`.

## Project setup (task T-01)

Every new JS project starts with this as its first task, before any feature code.

1. `git init`, then `npm init -y`. Set `"private": true` and `"type": "module"` in `package.json`, so Node runs `src/` modules in tests without warnings.
2. Add `.gitignore` with `node_modules` and `dist`.
3. Webpack:
   `npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin style-loader css-loader`
4. Prettier:
   `npm install --save-dev --save-exact prettier`
   Create an empty `.prettierrc` (`{}`) and a `.prettierignore`:
   ```
   dist
   package-lock.json
   .todo4vcode
   design
   ```
   `.todo4vcode` is ignored so Prettier never rewrites the board file the extension owns. The design source is ignored because it is reference material, not our code.
5. ESLint (needs Node 20.19+, 22.13+ or 24+):
   `npm install --save-dev eslint @eslint/js globals eslint-config-prettier`
   Create `eslint.config.mjs` (shown below). `eslint-config-prettier` goes last so it switches off every rule that would fight Prettier. Leave formatting to Prettier and correctness to ESLint.
6. Add the scripts:
   ```json
   "scripts": {
     "dev": "webpack serve --open",
     "build": "webpack --mode production",
     "lint": "eslint .",
     "lint:fix": "eslint . --fix",
     "format": "prettier . --write",
     "format:check": "prettier . --check",
     "test": "node --test tests/",
     "check": "npm run lint && npm run format:check && npm test && npm run build"
   }
   ```
7. Run `npm run format` once so the first commit is already formatted, then `npm run check`.

`webpack.config.js` starting point:

```js
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(import.meta.dirname, "dist"),
    clean: true,
  },
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/template.html"],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./src/template.html" })],
  module: {
    rules: [
      { test: /\.css$/i, use: ["style-loader", "css-loader"] },
      {
        test: /\.(svg|png|jpe?g|webp|avif|gif|woff2?)$/i,
        type: "asset/resource",
      },
    ],
  },
};
```

`eslint.config.mjs` starting point:

```js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  { ignores: ["dist/", "design/"] },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["src/**/*.js"],
    languageOptions: { globals: globals.browser },
    rules: {
      // Enforces the no-innerHTML rule below, so lint catches it instead of a manual grep.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "AssignmentExpression > MemberExpression[property.name=/^(innerHTML|outerHTML)$/]",
          message: "Build DOM with createEl and appendChild.",
        },
        {
          selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
          message: "Build DOM with createEl and appendChild.",
        },
      ],
    },
  },
  {
    files: ["webpack.config.js", "tests/**/*.js"],
    languageOptions: { globals: globals.node },
  },
  eslintConfigPrettier,
]);
```

## Code rules

- Copy, URLs and other content live only in `src/data/`. Copy stays verbatim from the design.
- Use one DOM for all screen widths and adapt it with CSS. Breakpoints: ≤767, 768–1023, ≥1024.
- Style with classes and the tokens in `src/styles/tokens.css`. No inline styles, and no hard-coded colours outside that file.
- Each section or feature is a module that exports a `createX()` function returning an element, with its CSS beside it.
- Write code that passes `npm run lint` with no warnings. Do not disable a rule inline without saying why in the same comment.
- Install a package only when a task needs it, and say which task in the proposal.
- Never start a code comment with the words TODO, FIXME or NOTE, in any letter case. The task board extension scans every workspace file and imports those comments onto the board as tasks.

`createEl` helper (`src/utils/dom.js`):

```js
export function createEl(tag, { className, text, attrs = {} } = {}) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  Object.entries(attrs).forEach(([name, value]) =>
    element.setAttribute(name, value),
  );
  return element;
}
```

Project layout:

```
src/
  index.js          imports global CSS, appends each section to #content
  template.html     <head> plus an empty <div id="content">
  data/             all copy, URLs and other content
  utils/dom.js      createEl
  validation/       pure validators (no DOM) and the live-validation wiring
  components/       shared pieces (.js + .css pairs)
  sections/         one .js + .css pair per page section
  styles/           tokens.css, base.css (Poppins comes from a Google Fonts link in template.html)
  assets/           images, icons
tests/              node:test unit tests for src/validation/validators.js
design/             reference material, never edited or formatted
```

## plan.md

Write `plan.md` before any feature code (task T-02). It holds:

- **Overview**: what is being built and from which source.
- **Decisions**: scope, assets and their sources, third-party embeds, anything agreed with the user.
- **Architecture**: folder tree and the module pattern.
- **Tasks**: one table per phase (`Phase 0: Setup`, `Phase 1: Foundation`, `Phase 2: Features`, `Phase 3: Finish`) with ID, task, priority and Definition of Done.
- **Open questions**: gaps in the design to confirm with the client. Build as drawn until they answer.
- **Verification**: how each task and the whole project are checked.

Every task carries these implicit DoD items: `npm run check` passes with no errors or warnings, and the task's files are formatted.

## Task board (todo4vcode)

The ToDo4VCode extension is in shared-file mode and watches `.todo4vcode/shared-tasks.json`, so edits to that file appear on the board. `plan.md` defines the tasks, and the board tracks their state. All code must belong to a task on the board. If work has no task, add one first.

Every task has:

- `text`: an ID and title, such as `T-07 · Shared components`
- `description`: goal and files, in plain text because the field does not render Markdown
- `priority`: `Must`, `Should`, `Could` or `Wont`
- `tags`: its phase, such as `phase-1`
- `subtasks`: its **Definition of Done**, one item per subtask, each prefixed `DoD:`, so progress shows as checkboxes

File shape:

```json
{
  "format": "todo4vcode-shared-tasks",
  "version": "1.0.0",
  "tasks": [
    {
      "id": "T-01",
      "text": "T-01 · Project setup",
      "description": "Goal: Webpack, ESLint and Prettier with a dev server, CSS and asset handling.\nFiles: package.json, webpack.config.js, eslint.config.mjs, .prettierrc, .prettierignore, .gitignore, src/index.js, src/template.html",
      "tags": ["phase-0"],
      "priority": "Must",
      "status": "Todo",
      "completed": false,
      "createdAt": 0,
      "order": 1000,
      "subtasks": [
        {
          "id": "T-01-d1",
          "text": "DoD: npm run dev serves the page",
          "completed": false
        },
        {
          "id": "T-01-d2",
          "text": "DoD: npm run lint and npm run format:check pass",
          "completed": false
        },
        {
          "id": "T-01-d3",
          "text": "DoD: node_modules and dist are git-ignored",
          "completed": false
        },
        {
          "id": "T-01-d4",
          "text": "DoD: npm run build compiles with no errors or warnings",
          "completed": false
        }
      ]
    }
  ]
}
```

Set `createdAt` to the current time in milliseconds (`Date.now()`).

When editing the file by hand:

- Keep the JSON valid, or the extension falls back to its last valid copy.
- Keep `completed` true only when `status` is `Done`.
- Give new tasks an `order` 1000 above the highest existing value, and the next free `T-` number.
- Re-read the file before each edit, because the user may have changed it in the extension.

Status flow:

- `Todo`: not started
- `In Progress`: being built, one task at a time
- `Testing`: Definition of Done checked and commit proposed, waiting on the user
- `Done`: the user has confirmed it

## Working loop

Build one task at a time, in plan order:

1. Set the task to `In Progress`.
2. Build only that task's scope. Anything else that turns up becomes a new task.
3. Run `npm run format`, then check every Definition of Done item, including `npm run check`. Tick only what was actually verified.
4. Set the task to `Testing` and stop. Report which items were verified and which need the user's eyes in a browser.
5. Propose the exact `git add <files>` list and the commit message alongside the code.
6. When the user confirms, set the task to `Done`. That status change goes in with the next task's commit. Only then start the next task.

## Commits

The user commits and pushes. Do not run `git commit` or `git push` unless asked.

Every commit covers one task, names its ID, and stages `.todo4vcode/shared-tasks.json` with the code:

```
feat(T-07): add shared hours table component

Why it was needed, in one or two lines.

Task: T-07 · Shared components
```

Types: `feat`, `fix`, `style`, `refactor`, `chore`, `docs`.

## Deploying to GitHub Pages (optional)

`dist/` is git-ignored, so the build is force-added and pushed to the `gh-pages` branch as a subtree:

```sh
npm run build
git add dist -f
git commit -m "chore: deploy"
git push origin main
git subtree push --prefix dist origin gh-pages
```

Set `output.publicPath` or use relative asset paths if the site is served from a sub-path such as `/form_validation/`.
