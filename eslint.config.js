import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  {
    ...js.configs.recommended,
    ignores: ['**/dist/**'],
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
  {
    files: ['**/__tests__/**/*', '**/*.test.ts', '**/*.test.tsx'],
    languageOptions: {
      globals: globals.jest,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['**/dist/**'],
    languageOptions: {
      parser,
      parserOptions: { project: './tsconfig.json' },
    },
    plugins: { '@typescript-eslint': ts },
    rules: {
      ...ts.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];
