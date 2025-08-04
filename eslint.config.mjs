import eslint from "@eslint/js";
import importSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, {
  plugins: { "simple-import-sort": importSort },
  rules: {
    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
  },
});
