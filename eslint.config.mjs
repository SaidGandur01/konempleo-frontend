// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    "no-useless-escape": "off",
    "@typescript-eslint/no-explicit-any": "off"
  },
});
