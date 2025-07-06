# GitHub Copilot Instructions

## General Guidelines

### 🧩 Style & Formatting

1. Use **Vuetify Utility Classes (VUC)** for layout, spacing, alignment, and text styling.
   **Examples:** `py-15`, `d-flex`, `text-white`, `px-6`, `text-h4`, `font-weight-semibold`.

2. Use **scoped SCSS** only for custom visual effects:
   - Background images (e.g. grayscale, `background-position`)
   - Z-index layering (e.g. overlays, absolute banners)
   - Decorative elements (e.g. underlines, custom fonts, transitions)

3. **Avoid duplication**: If a Vuetify class exists for a style (e.g. margin, padding, text color), prefer it over custom CSS.

4. Keep SCSS **clean and purposeful**. Extract reusable styles into global utility classes only if used across multiple components.

5. Mixing is allowed — but give each tool a clear role:
   - **VUC** = structural layout
   - **SCSS** = custom visual polish

6. Follow **Vue.js and Nuxt conventions**: kebab-case for filenames, PascalCase for components, 2-space indentation, and clear structure.

### ⚙️ Framework & Libraries

- Use **Nuxt 3 (compatibility mode 4)** and **Vue 3**.
- Use Nuxt Content v3.
- Use the **Composition API** for all components.
- Leverage **Vue's reactivity** idiomatically.
- Avoid adding new dependencies unless justified.
- Use `<NuxtLink>` for client-side routing.

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
