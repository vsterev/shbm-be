import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["**/*.{ts}"],
  },
  { languageOptions: { globals: globals.browser } },
  {
    ignores: [
      "dist/",
      "tsoa/",
      "*.js",
      "src/database/migrations",
      "src/database/seeders",
    ],
  },
  ...tseslint.configs.recommended,
];
