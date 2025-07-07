---
title: Design System – Audit
description: Audit strategy from Legacy site to Nuxt 4 + Vuetify 3 site
---

# 📋 Visuele Audit – Nuxt 4 Site

## 🔍 1. Pagina-overzicht

| Pagina         | Headings gebruikt | Marges (top/bottom) | Fontgrootte  | Line-height  | Kleurgebruik     | Opmerkingen                     |
|----------------|-------------------|----------------------|-------------|--------------|------------------|---------------------------------|
| /              | h1                | h1: mt-8 mb-2        | h1: 24px    | 36px         | #043c72, logo  | Tiempos Headline                |
| /              | h2                | h1: mt-8 mb-2        | h1: 32px    | 40px         | #043c72, logo  | Tiempos Headline                |
| /              | h3                | h1: mt-8 mb-2        | h3: 24px    | 36px         | #000000, zwart | Tiempos Headline                |
| /              | menu              | h1: mt-8 mb-2        |     32px    | 24px         | #000000, zwart | Tiempos Headline                |
| /              | menu on hover     | h1: mt-8 mb-2        |     32px    | 24px         | #0065ca, indigo| Tiempos Headline                |


| /nieuws        | h2, h3            | h2: mt-6 mb-0        | h3: 20px    | 1.5          | #003366, blauw | weinig witruimte                |
| /agenda        | h2, h4            | h4: mt-4 mb-2        | h4: 16px    | 1.4          | zwart, grijs     | headings voelen generiek        |
| /uitspraak     | h2, p             | p: mb-2              | p: 16px     | 1.5          | zwart            | leesbaar, maar visueel vlak     |

> Tip: analyseer 5–10 sleutelpagina’s. Noteer inconsistenties in marges, kleur en structuur.

---

## 🎨 2. Typografische schaal (gevonden vs gewenst)

| Grootte-label | Huidige groottes (geschat) | Gewenst (beslist) | Toepassing                       |
|---------------|----------------------------|-------------------|----------------------------------|
| sm            | 14px                       | 14px              | disclaimers, details             |
| base          | 16px                       | 16px              | paragraaftekst                   |
| lg            | 18px / 20px                | 18px              | subtitels                        |
| xl            | 24px / 28px                | 20–24px           | hoofdtitels, page titles         |

---

## 📏 3. Spacing – huidige vs richtlijn

| Type               | Huidig (geschat) | Gewenst (8px grid) | Opmerkingen                      |
|--------------------|------------------|--------------------|----------------------------------|
| Margin onder `<h2>`| wisselend        | 16px (`spacing-md`) | vaak te krap op paragrafen      |
| Padding in cards   | 12–20px          | 16px               | wisselend per component          |
| Tussen knoppen     | 4–16px           | 8px–16px           | inconsistente afstand            |

---

## 🌈 4. Kleurgebruik

| Element       | Kleur gebruikt     | Overgenomen uit legacy? | Richtlijngebruik                |
|---------------|--------------------|--------------------------|--------------------------------|
| Primair       | #003366          | Ja                       | CTA-knoppen, hoofdlinks        |
| Secundair     | #006699          | Ja                       | iconen, accenten               |
| Accent        | #6699CC          | Ja                       | hovereffecten                  |
| Tekstkleur    | #333333 of zwart | Gedeeltelijk             | basis tekstkleur               |
| Achtergrond   | wit / grijs        | Ja                       | pagina, cards                  |

---

## 📌 5. Notities en grootste inconsistenties

- Headings missen vaste spacing → geen visuele hiërarchie
- Verschillende typografische groottes zonder logica
- Knoppen zien er generiek uit (Vuetify standaard)
- Cards missen uniforme opbouw
- Responsieve marges breken op mobiel

---

## ✅ Volgende acties (afgeleid uit audit)

1. Bepaal definitieve typografische schaal op basis van audit
2. Zet alle spacing om naar veelvouden van 8px
3. Maak CSS-variabelen met kleurdefinities uit legacy
4. Bouw startercomponenten voor: headings, tekst, knoppen, cards
5. Hergebruik deze op sleutelpagina’s
