import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt([
  {
    rules: {
      // `~/*`꼴의 import 금지
      "no-restricted-imports": [
        "error",
        {
          patterns: ["~/*", "~~/*"],
        },
      ],
    },
  },
]);
