import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      ".astro/**",
      "node_modules/**",
      "public/scripts/reveal.js",
      "public/scripts/analytics.js",
      "scripts/build-og-images.mjs",
      "round*/**",
    ],
  },

  ...eslintPluginAstro.configs["flat/recommended"],

  // TypeScript rules only for .ts/.mjs files (not .astro frontmatter)
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.ts", "**/*.mjs"],
  })),

  // Custom rules for all files
  {
    rules: {
      "no-console": "off",
      "prefer-const": "warn",
    },
  },

  // Custom TS rules for .ts/.mjs files only
  {
    files: ["**/*.ts", "**/*.mjs"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // Relax rules for inline scripts in .astro files
  {
    files: ["**/*.astro"],
    rules: {
      "no-var": "off",
      "no-undef": "off",
    },
  },
);
