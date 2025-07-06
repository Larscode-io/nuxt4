# GitHub Copilot Instructions

## General Guidelines

### 🧩 Style & Formatting

- Create and update a progress.md with the overall progress of the project
- Accessibility and WCAG should always be a consideration
- Use **Vuetify Utility Classes (VUC)** for layout, spacing, alignment, and text styling.
- Use **scoped SCSS** only for custom visual effects if it cannot be done with VUC
- **Avoid duplication**: If a Vuetify class exists for a style (e.g. margin, padding, text color), prefer it over custom CSS.
- Keep SCSS **clean and purposeful**. Extract reusable styles into global utility classes only if used across multiple components.
- Mixing is allowed: **VUC** for structural layout and **SCSS** for custom visual polish
- Follow **Vue.js and Nuxt conventions**: kebab-case for filenames, PascalCase for components, 2-space indentation, and clear structure.

### ⚙️ Framework & Libraries

- Use **Nuxt 4** has a new Directory Structure: source code goes in the app folder for cleaner organization
- Use **Nuxt 4** has improved Data Fetching with useAsyncData and useFetch
- Use **Nuxt 4** has improved Enhanced Head Management: useHead() to declare head meta in components or pages
- Use **Nuxt 4** has improved Data Fetching with useAsyncData and useFetch
- extract pages and components functions in 'app/utils' where relevant
- extract api functions in 'server/utils'
- Use Nuxt Content v3
- Use the **Composition API** for all components
- Leverage **Vue's reactivity** idiomatically
- Avoid adding new dependencies unless justified
- Use `<NuxtLink>` for client-side routing
- In Nuxt Content (@nuxt/content), the queryCollection function is used to query content files stored in the content directory. It provides chainable methods to filter, sort, and manipulate the data before retrieving it. Below are the most commonly used chainable methods:
.where()
.sort()
.limit()
.skip()
.find()
.first()
.only()
.without()
.surround()
.fetch()

### 🧼 Readability & Maintainability

- Write **clear, modular, self-explanatory code**.
- Use **descriptive variable and function names**.
- Favor simplicity over cleverness.

### 📝 Documentation & Comments

- Add brief inline comments for non-obvious logic.
- Use docstrings for composables or complex methods.

### 💻 Coding Standards

- Maintain consistent indentation and naming.
- Follow a clean and logical file structure.

### 🚨 Error Handling

- Use Nuxt's built-in composables and utilities (`useFetch`, `useError`, `onErrorCaptured`, etc.).
- Validate inputs and handle edge cases gracefully.
- Log critical issues for debugging without polluting output.

### 🚀 Performance & Optimization

- Keep code efficient, but not at the cost of clarity.
- Avoid over-engineering — optimize real bottlenecks.

## ✅ Specific Practices

- Write unit tests where applicable.
- Use modern JS/TS features (e.g. `optional chaining`, `nullish coalescing`, `async/await`) when helpful.
- Prefer clarity over brevity.
- Structure code for easy extension, reuse, or refactoring.

## 🎨 Theming & Design

### Custom Colors

Use the following **project color palette** for consistent, accessible design.

```scss
$logoColor: #043c72;
$indigo: #0065ca;
$indigoExtraLight: rgba(0, 101, 202, 0.14);
$indigoLight: rgba(0, 101, 202, 0.8);
$indigoMediumLight: rgba(0,101,202, 0.7);
$skyBlue: #00aae7;
$skyBlueExtraLight: rgba(0, 170, 231, 0.24);
$rajahYellow: #fcbf60;
$ivoryGrey: #d9dad9;
$darkGrey: #777777;
$linkBlue: #00709d;
$errorRed: #c32a3a;
$warningOrange: #d65c0e;
$successGreen: #3aa82f;
$rajahLight: rgba(254, 201, 118, 0.9);
$rajahExtraLight: rgba(254, 201, 118, 0.2);
$textOnRajah: #3d3a44;
$pdfRed: #c90304;

// Expose the SCSS variables as CSS variables
:root {
    --logo-color: #{$logoColor};
    --indigo: #{$indigo};
    --indigo-extra-light: #{$indigoExtraLight};
    --indigo-light: #{$indigoLight};
    --indigo-medium-light: #{$indigoMediumLight};
    --sky-blue: #{$skyBlue};
    --sky-blue-extra-light: #{$skyBlueExtraLight};
    --rajah-yellow: #{$rajahYellow};
    --ivory-grey: #{$ivoryGrey};
    --dark-grey: #{$darkGrey};
    --link-blue: #{$linkBlue};
    --error-red: #{$errorRed};
    --warning-orange: #{$warningOrange};
    --success-green: #{$successGreen};
    --rajah-light: #{$rajahLight};
    --rajah-extra-light: #{$rajahExtraLight};
    --text-on-rajah: #{$textOnRajah};
    --pdf-red: #{$pdfRed};
}
```
