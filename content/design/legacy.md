---
title: Design System – Legacy
description: What to keep from the Nuxt 2 legacy site, what to adapt, what to leave behind for Nuxt 4 + Vuetify 3
---

# 🎨 Legacy Site Audit – Wat overnemen, wat vertalen, wat achterlaten

Een kritische analyse van de legacy Nuxt 2-site als visuele referentiebron voor de Nuxt 4-herwerking. Doel: huisstijlgevoel behouden, zonder technische rommel mee te sleuren.

---

## ✅ Wat behouden (als bron voor je design tokens)

| Element             | Reden                                                     |
|---------------------|-----------------------------------------------------------|
| 🎨 **Kleurenpalet** | Herkenbaarheid, consistente branding                      |
| 🔤 **Font family**  | Bv. `Public Sans`, `Proxima Nova`, ...                   |
| 📚 **Typografische sfeer** | Is het formeel, modern, ingetogen? Vastleggen als toon  |
| 🧱 **Layoutbreedte** | Bv. max-width: 1260px – overnemen in `PageContainer`     |
| ✍️ **Visuele toon** | Witruimte, accenten, sobere stijl → vertalen naar tokens  |

> **Actie:** Zet deze elementen om in CSS-variabelen of `tokens.ts`

---

## 🔄 Wat vertalen of structureren

| Element                  | Reden & actie                                         |
|--------------------------|--------------------------------------------------------|
| 📏 **Willekeurige marges** | Vertalen naar `spacing-sm/md/lg` in tokens            |
| 📐 **Inconsistent headings** | Leg vaste schaal vast in `<BaseHeading>`             |
| 🎭 **Inline-style knoppen** | Omzetten naar `<BaseButton>` met props                |
| 📦 **Card-achtige blokken** | Vervangen door `<BaseCard>` met vaste layout          |
| 📱 **Responsieve hacks** | Overzetten naar Vuetify grid/utility classes          |

> **Actie:** Analyseer wat herbruikbaar is, maar bouw het opnieuw op.

---

## ❌ Wat achterlaten

| Element                     | Waarom niet meenemen                                 |
|-----------------------------|------------------------------------------------------|
| ❌ Inline styles / !important | Slecht schaalbaar, moeilijk overschrijfbaar         |
| ❌ Custom marges `.mb16`, `.mt42` | Breekt spacing-consistentie                    |
| ❌ Grijstinten zonder semantiek | (#333, #444, #777) – voeg betekenis toe via tokens |
| ❌ SCSS met diepe nesting     | Moeilijk te onderhouden – herwerken in losse tokens |

> **Actie:** Negeer of herschrijf deze delen volledig.

---

## 🧭 Toepassing op je eigen audit

Tijdens het analyseren van je oude en nieuwe pagina’s:

1. **Gebruik de legacy-site als visuele bron**, niet als technische basis
2. Vraag bij elk element:
   - Is dit kleurgebruik bewust & herbruikbaar?
   - Is deze marge/stijl consistent gebruikt?
   - Past dit bij de gewenste sfeer van de site?
3. Zet je keuzes en herwerkte versies in `app/pages/design/design.vue` of een apart overzicht

---

## 🧠 Vuistregel

> **Herneem sfeer en toon, maar herschrijf gedrag en techniek.**

Zodra deze audit staat, kun je je startercomponenten afstemmen op wat echt telt: herkenbaarheid + consistentie + onderhoudbaarheid.
