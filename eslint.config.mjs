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
    files: ["webpack.config.js"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
  eslintConfigPrettier,
]);
