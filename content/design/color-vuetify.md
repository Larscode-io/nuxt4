---
title: Design System – Kleuren in Vuetify 3
description: Overzicht en richtlijnen voor het toepassen van systeemkleuren binnen het Vuetify 3 framework in Vue/Nuxt 4.
---

# 🎨 Vuetify 3 – Kleurgebruik in Vue/Nuxt 4

## 🔧 Architectuur
- We gebruiken **Vuetify 3 theming** als primaire manier om kleuren toe te passen.
- Hexwaarden worden nooit hardcoded in componenten, maar gedefinieerd als **Vuetify theme keys** en/of **CSS custom properties** (design tokens).
- Kleuren worden toegewezen aan een **semantische rol**: `primary`, `text`, `accent`, `surface`, etc.
- deze worden door will be used by Vuetify components when you set `color="primary"` etc.
- of `color="primary lighten-2"` etc.
- of zonder de `color` prop zal `v-btn` bepaalde van die kleuren gebruiken

---

## 🖼️ Vuetify theme setup (voorbeeld)

In `vuetify.options.ts`:
```ts
          colors: {
            primary: '#043c72', // logoColor
            secondary: '#0065ca', // indigo
            accent: '#fcbf60', // rajahYellow
            error: '#c32a3a', // errorRed
            info: '#00aae7', // skyBlue
            success: '#3aa82f', // successGreen
            warning: '#d65c0e', // warningOrange

            // Custom keys (use camelCase !!)
            logoColor: '#043c72',
            indigo: '#0065ca',
            indigoExtraLight: 'rgba(0, 101, 202, 0.14)',
            indigoLight: 'rgba(0, 101, 202, 0.8)',
            indigoMediumLight: 'rgba(0, 101, 202, 0.7)',
            skyBlue: '#00aae7',
            skyBlueExtraLight: 'rgba(0, 170, 231, 0.24)',
            rajahYellow: '#fcbf60',
            rajahLight: 'rgba(254, 201, 118, 0.9)',
            rajahExtraLight: 'rgba(254, 201, 118, 0.2)',
            textOnRajah: '#3d3a44',
            ivoryGrey: '#d9dad9',
            darkGrey: '#777777',
            linkBlue: '#00709d',
            pdfRed: '#c90304',
            dropdown: '#c90304',
            dropdownBg: '#3aa82f',
          },
```

---

## 🎨 Kleurdefinities

| Naam       | Token / Key      | Hex        | Gebruik                          |
|------------|------------------|------------|----------------------------------|
| Primair    | `primary`        | `#003366`  | Hoofdkleur, buttons, CTA’s       |
| Secundair  | `secondary`      | `#006699`  | Subaccenten, badges, iconen      |
| Accent     | `accent`         | `#6699cc`  | Hoverkleuren, links, ritme       |
| Achtergrond| `background`     | `#ffffff`  | Pagina- en contentachtergrond    |
| Oppervlak  | `surface`        | `#f5f5f5`  | Kaarten, secties met lichte toon |
| Tekst      | `text`           | `#333333`  | Bodytekst                        |
| Gedempt    | `muted`          | `#666666`  | Metadata, bijschriften           |
| Lijnkleur  | `border`         | `#dddddd`  | Scheidingen, tabellen            |

---

## 🎛 Componentbinding

| Component    | Prop       | Waarde           | Uitleg                                 |
|--------------|------------|------------------|----------------------------------------|
| `<v-btn>`    | `color`    | `primary`        | Hoofdknop                              |
| `<v-chip>`   | `color`    | `secondary`      | Accentkleur bij tags                   |
| `<v-card>`   | `color`    | `surface`        | Licht gekleurde achtergrond            |
| `<v-alert>`  | `type`     | `success`, `info`| Gebruik Vuetify types voor statuskleur |
| Tekst        | `class`    | `text-text`      | Of eigen scoped CSS                    |

---

## 🎯 Richtlijnen voor gebruik
### ✅ 1. In een Vuetify-component via `color` prop

Aanbevolen manier voor Vuetify componenten:

```vue
<v-btn color="primary">Doorgaan</v-btn>
<v-card color="surface" class="pa-4">...</v-card>
<v-chip color="secondary">Filter</v-chip>
```

Kleuren komen uit je theme-configuratie (`primary`, `accent`, `surface`, ...).

---

### ✅ 2. In je eigen component via Vuetify utility-classes

Vuetify levert kleur-utility classes:

```vue
<span class="text-primary">Belangrijk</span>
<div class="bg-surface pa-4">Achtergrondvlak</div>
```

- `text-[kleur]` → tekstkleur
- `bg-[kleur]` → achtergrondkleur
- `border-[kleur]` → randkleur (indien beschikbaar)

---

### ✅ 3. In `<style>` via CSS custom properties (`var(--v-theme-...)`)

Vuetify zet themekleuren om naar CSS-variabelen. Gebruik ze zo:

```vue
<template>
  <div class="my-box">Ik gebruik de themakleur via CSS</div>
</template>

<style scoped>
.my-box {
  background-color: var(--v-theme-surface);
  color: var(--v-theme-text);
  border: 1px solid var(--v-theme-border);
}
</style>
```

---

### ✅ 4. In script via Composition API (`useTheme()`)

Wil je kleuren benaderen in JS/TS (bv. dynamisch):

```ts
import { useTheme } from 'vuetify'

const theme = useTheme()
console.log(theme.current.value.colors.primary)
```

### ⛔ 5. Vermijd:
```vue
<v-btn style="background-color: #003366">Contact</v-btn>
<span style="color: #6699cc">Link</span>
```

---

### 🔁 Samenvatting

| Situatie                          | Aanpak                             | Voorbeeld                        |
|----------------------------------|------------------------------------|----------------------------------|
| Vuetify component                | `color="primary"`                  | `<v-btn color="primary">`       |
| Tekst of div kleur               | Vuetify class                      | `class="text-accent"`           |
| CSS in component                 | `var(--v-theme-[kleur])`           | `color: var(--v-theme-primary);`|
| In script / TS composable        | `useTheme()`                       | `theme.current.value.colors`    |

---

## 🔁 Toekomstige uitbreiding

- ✅ Donkere modus: nog niet voorzien, maar theming is voorbereid
- ✅ Kleurcontrast: voldoet grotendeels aan WCAG AA (grijs kan later fijner)
- 📌 Overweeg: `info`, `success`, `warning`, `error` in eigen kleurenschema opnemen
