import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/singleline-html-element-content-newline': 'off', // Disable new lines for single-line elements
  },
  ignores: ['**/dist', '**/node_modules', '**/.nuxt'],
  features: {
    stylistic: true, // auto format on save
  },
})
