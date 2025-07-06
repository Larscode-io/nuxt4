import stylistic from '@stylistic/eslint-plugin'
import vue from 'eslint-plugin-vue'
import ts from '@typescript-eslint/eslint-plugin'
import vueParser from 'vue-eslint-parser'
import nuxt from 'eslint-plugin-nuxt'

export default [
  {
    plugins: {
      '@stylistic': stylistic,
      vue,
      '@typescript-eslint': ts,
      nuxt,
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      // Restrict imports
      'no-restricted-imports': ['error', {
        paths: [
          {
            name: '@types',
            message: '🚫 Do not import from @types/. Use @models/ instead.',
          },
        ],
        patterns: [
          {
            group: ['@/types/**'],
            message: '🚫 Do not import from /types. Use /models instead.',
          },
        ],
      }],

      // General JS/TS rules
      'no-console': 'warn',
      'prefer-const': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',

      // Stylistic rules (@stylistic/eslint-plugin v5)
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/operator-linebreak': ['error', 'before'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1 }],
      '@stylistic/quotes': ['error', 'single'],

      // Vue formatting & structure
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
      'vue/no-v-html': 'off',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

      // ✅ Nuxt-specific minimal rules
      'nuxt/no-cjs-in-config': 'error',                // Block `require()` in Nuxt config
      'nuxt/no-env-in-hooks': 'warn',                  // Block direct use of `process.env` in setup()
      'nuxt/no-globals-in-created': 'warn',            // Don’t use globals (like window) in `created`
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      // Disabled because the old Nuxt rule used deprecated options not compatible with ESLint 9+
      'vue/object-property-newline': 'off',
    },
  },
  {
    ignores: ['**/dist', '**/node_modules', '**/.nuxt', '**/coverage'],
  },
]
