import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/singleline-html-element-content-newline': 'off', // Disable new lines for single-line elements
    '@stylistic/semi': 'off',
    'vue/html-indent': 'on',
    'vue/max-attributes-per-line': 'on',
    'vue/first-attribute-linebreak': 'on',
    'vue/attributes-order': 'on',
    'prefer-const': 'on',
    '@stylistic/indent': 'on',
    '@stylistic/no-trailing-spaces': 'on',
    '@stylistic/no-multiple-empty-lines': 'on',
    '@stylistic/operator-linebreak': 'on',
    '@stylistic/arrow-parens': 'off',
  },
  ignores: ['**/dist', '**/node_modules', '**/.nuxt'],
  features: {
    stylistic: true, // auto format on save
  },
})
