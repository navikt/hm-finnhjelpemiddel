// Backwards compatibility
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const esLintConfig = [
  ...compat.extends('next/core-web-vitals', 'plugin:jsx-a11y/recommended'),
  {
    rules: {
      'react/display-name': 'off',
    },
  },
]

export default esLintConfig