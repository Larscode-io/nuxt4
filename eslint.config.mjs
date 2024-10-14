import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/multi-word-component-names': 'off',
  },
  ignores: ['**/dist', '**/node_modules', '**/.nuxt'],
  ignores: ['**/dist', '**/node_modules', '**/.nuxt', '**/.vscode', '**/.github', '**/app/content'],
  features: {
    stylistic: true, // Enable auto-formatting on save
  },
})