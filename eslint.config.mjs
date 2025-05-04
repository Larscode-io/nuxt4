import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import stylistic from '@stylistic/eslint-plugin'
import vue from 'eslint-plugin-vue'
import ts from '@typescript-eslint/eslint-plugin'

export default createConfigForNuxt({
  plugins: {
    '@stylistic': stylistic,
    vue,
    '@typescript-eslint': ts,
  },
  rules: {
    // Algemene JS/TS regels
    'no-console': 'warn',
    'prefer-const': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',

    // Stylistic (opmaak) regels
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/indent': ['error', 2],
    '@stylistic/arrow-parens': ['error', 'always'],
    '@stylistic/operator-linebreak': ['error', 'before'],
    '@stylistic/no-trailing-spaces': 'error',
    '@stylistic/no-multiple-empty-lines': ['error', { max: 1 }],
    '@stylistic/quotes': ['error', 'single'],

    // Vue component layout & attributen
    'vue/multi-word-component-names': 'off',
    'vue/html-indent': ['error', 2],
    'vue/max-attributes-per-line': ['error', {
      singleline: 3,
      multiline: 1,
    }],
    'vue/first-attribute-linebreak': ['error', {
      singleline: 'beside',
      multiline: 'below',
    }],
    'vue/attributes-order': 'warn',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'always',
    }],
  },
  ignores: ['**/dist', '**/node_modules', '**/.nuxt'],
  features: {
    stylistic: true,
  },
})
