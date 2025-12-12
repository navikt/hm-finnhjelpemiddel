import nextTypescript from "eslint-config-next/typescript";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
// Backwards compatibility
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const esLintConfig = [
  ...nextTypescript,
  ...nextCoreWebVitals,
  ...compat.extends("plugin:jsx-a11y/recommended"),
  {
    rules: {
      'react/display-name': 'off',
      'jsx-a11y/no-autofocus': 'off',
    },
  },
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
  }
]

export default esLintConfig
