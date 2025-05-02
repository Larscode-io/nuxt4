# GitHub Copilot Instructions

## General Guidelines

- **Style & Formatting:**  
  - Prefer Vuetify utility classes over SCSS for custom styling.
  - Use Vuetify for UI components and utility classes for fine-grained control.
  - Follow Vue.js and Nuxt naming conventions and indentation.

- **Framework & Libraries:**  
  - Use Nuxt 3 compatibility mode 4 and Vue 3.
  - Use Vue Composition API for components.
  - Use Vue's reactivity system effectively and understandably.
  - Avoid new dependencies unless necessary.
  - Use nuxt-link for navigation with Nuxt router.

- **Readability & Maintainability:**  
  - Write clear, well-structured code with descriptive variable names and modular functions.

- **Documentation & Comments:**  
  - Include brief inline comments for complex logic and function/method docstrings.

- **Coding Standards:**  
  - Maintain consistent indentation, naming conventions, and file organization.

- **Error Handling:**  
  - Implement robust error handling using Nuxt's built-in utilities.
  - Validate inputs, handle exceptions gracefully, and log errors appropriately.

- **Performance & Optimization:**  
  - Optimize code for efficiency without sacrificing readability.

## Specific Considerations

- Write unit tests where applicable.
- Use modern language features and best practices, avoiding unnecessary complexity.
- Prioritize clarity over brevity.
- Structure code for easy extension or refactoring.

## Additional notes

- Generated code should be self-explanatory with minimal additional comments.
- Follow the principle of "least astonishment."
- Consider edge cases and include appropriate safeguards.

## Beautifying Templates with colors

### Using Custom Colors

To create a balanced, visually appealing, and accessible website, use the following custom colors

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