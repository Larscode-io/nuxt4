---
title: Design System – Kleuren in Nuxt
description: Deze pagina beschrijft het kleurenpalet en de richtlijnen voor kleurgebruik binnen het Nuxt 4 framework
---

# 🎨 Kleurgebruik – Designsystem Constitutional Court (Nuxt 4 + Vuetify 3)

## Definities in SCSS
- The file `_variables.scss` contains SCSS variables used as design tokens at compile time.
- This file defines SCSS variables (e.g., `$skyBlue`) for values that never change.
- SCSS variables exist only at build time and are available in <style lang="scss"> blocks.
- SCSS variables do not exist at runtime in the browser.
- For runtime usage (e.g., in Vue templates or inline styles), use CSS variables (--sky-blue).
- Example: `var(--sky-blue)` in Vue templates and inline styles.

```scss
@use "sass:color";
$logoColor: #043c72;
$indigo: #0065ca;

$indigo-dark: color.adjust($indigo, $lightness: -15%);
$indigoExtraLight: rgba(0, 101, 202, 0.14);
$indigoLight: rgba(0, 101, 202, 0.8);
$indigoMediumLight: rgba(0, 101, 202, 0.7);
$skyBlue: #00aae7;
$skyBlueExtraLight: rgba(0, 170, 231, 0.24);
$rajahYellow: #fcbf60;
$rajahGold: #FFB700;
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
```

## 🌐 Definities in CSS
- This file injects CSS variables that correspond to the SCSS variables defined in `_variables.scss` for use at runtime.
- This allows the variables to be accessed as CSS custom properties in our Vue components.
- SCSS variables (e.g., `$logoColor`) are only available during the build (preprocessing) stage
and cannot be accessed at runtime in the browser, unlike CSS variables.
- However, CSS variables are part of the runtime environment, the browser
- These are available at runtime in templates and inline styles.
- Globally accessible because they are defined in the `:root` selector, also visible in the browser dev tools
- All CSS variables with `--…` names are defined in this file: `assets/scss/colors.scss`.
- This file is included globally via css: ['@/assets/scss/colors.scss'] in `nuxt.config.ts`.

```ts
@use './_variables.scss' as *;

:root {
    --logo-color: #{$logoColor};
    --indigo: #{$indigo};
    --indigo-dark: #{$indigo-dark};
    --indigo-extra-light: #{$indigoExtraLight};
    --indigo-light: #{$indigoLight};
    --indigo-medium-light: #{$indigoMediumLight};
    --sky-blue: #{$skyBlue};
    --sky-blue-extra-light: #{$skyBlueExtraLight};
    --rajah-yellow: #{$rajahYellow};
    --rajah-gold: #{$rajahGold};
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


Inside templates and inline styles
```html
<div :style="{ color: 'var(--sky-blue)' }">
```

Gebruik in je SCSS of CSS:
```scss
.my-class
  { color: var(--sky-blue); }
```
---


