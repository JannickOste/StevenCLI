// @ts-check
import globals from "globals"
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['**/build/**', '**/dist/**', "sysadmin/**", "bin/**", "**/eslint.config.*"],
  },
  eslint.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    languageOptions: {
      parser: tseslint.parser,
      globals: globals.node,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname
      },
    }, 
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/consistent-return': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/ban-tslint-comment': "error",
      "@typescript-eslint/no-array-constructor": "error",
      "no-unused-vars": "off",
      '@typescript-eslint/no-unused-vars': 'error',
      "no-undef": "off" 
    },
  },
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
   {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    ...tseslint.configs['recommended-requiring-type-checking'],
  }
);