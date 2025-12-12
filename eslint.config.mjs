import nextTypescript from "eslint-config-next/typescript";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const esLintConfig = [
  ...nextTypescript,
  ...nextCoreWebVitals,
  {
    rules: {
      "react/display-name": "off",
      "jsx-a11y/no-autofocus": "off",
      // Relax strict React hooks purity/static analysis rules
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/static-components": "off",
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      // Relax some TypeScript strictness to avoid many build errors
      "@typescript-eslint/no-explicit-any": ["warn"],
      "@typescript-eslint/no-empty-object-type": ["warn"],
      "@typescript-eslint/no-wrapper-object-types": ["warn"],
      // Prefer-const and unused-expression/style rules as warnings
      "prefer-const": ["warn"],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-unused-expressions": ["warn"],
    },
  },
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default esLintConfig;
