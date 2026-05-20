import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import prettier from 'eslint-plugin-prettier/recommended';
import html from 'eslint-plugin-html';

export default defineConfig([
  {
    files: ['src/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['src/*.html'],
    plugins: { html },
    settings: {
      'html/html-extensions': ['.html'],
    },
  },
  eslintPluginPrettier,
  prettier,

  {
    rules: {
      'capitalized-comments': ['error', 'always'],
    },
  },
]);
