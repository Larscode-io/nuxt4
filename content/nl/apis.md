---
title: API-informatie
description: Informatie over de API's en hun gebruik
posterUrl: ~/assets/img/newsletter-background.png
---

# API-informatie

Onze website maakt gebruik van API's voor de opbouw van pagina’s. Het Hof heeft echter besloten geen specifieke faciliteiten te creëren voor geautomatiseerde toegang tot de gegevens. De publiek toegankelijke informatie op onze website kan zonder tussenkomst van onze ICT-dienst worden gebruikt. Door analyse van onze pagina's kunt u de benodigde API's zelf identificeren.

<br>

## Voorbeelden van beschikbare API's

- **Informatie over de arresten:**
  `https://node04.const-court.be/api/v1/press/judgments?lang=nl`

- **Informatie over de hangende zaken:**
  `https://node04.const-court.be/api/v1/juris/pending-cases?lang=nl`

- **Persberichten over de arresten:**
  `https://node04.const-court.be/api/v1/media/press-releases-concerning-judgments?lang=nl&withArchive=false`

<br>

## Technisch
> ℹ️ **Tip:**
> Zoek de gebruikte API's zelf via **Chrome DevTools** (tabblad **Network**, filter op **XHR** of **Fetch**).
> Omdat veel pagina's SSR zijn, zie je bij de eerste pagina-lading vaak geen "fetch" verschijnen.
> Gewoon even client-side navigeren (weg en terug) triggert meestal wel de "fetch" en maakt de request zichtbaar in het Network-paneel.
> Mogelijk dient u hier een specialist te raadplegen.

> ⚠️ **Let op:**
> De servernaam `node04.const-court.be` kan variëren naargelang de actieve backend en kan wijzigen.
> Het is aanbevolen om de stabielere URL te gebruiken:
> `https://www.const-court.be/api/v1/juris/pending-cases?lang=nl`

<br>

## Arresten per jaartal

- **NL:** `https://www.const-court.be/public/n`
- **FR:** `https://www.const-court.be/public/f`
- **DE:** `https://www.const-court.be/public/d`

😁 Wij verzoeken u vriendelijk om bij het gebruik van onze API's een verantwoorde benadering te hanteren. Overmatig of frequent opvragen van gegevens kan de prestaties van onze systemen beïnvloeden. 😠
<br>

**Wij raden aan om:**

- cachingmechanismen te implementeren;
- verzoeken te spreiden over de tijd.

Zo kunnen we een efficiënte en duurzame toegang tot de informatie waarborgen voor alle gebruikers van onze infrastructuur.
Wij raden aan om:

- cachingmechanismen te implementeren;
- verzoeken te spreiden over de tijd.

Zo kunnen we een efficiënte en duurzame toegang tot de informatie waarborgen voor alle gebruikers van onze infrastructuur.
<br>
<br>

## Juridische aspecten
> ⚠️ **Opgelet:**
> De wet betreffende het centrale register voor de beslissingen van de rechterlijke orde voorziet in de pseudonimisering van vonnissen en arresten.
> Dit is **niet** het geval voor de arresten van het Hof.
>
> **Massaal downloaden van gegevens is verboden.**
- de toepasselijke regelgeving inzake gegevensbescherming (zie onze [privacyverklaring](/footer/privacy-policiy));
- andere relevante wettelijke bepalingen.

> **Opgelet:**
> De wet betreffende het centrale register voor de beslissingen van de rechterlijke orde voorziet in de pseudonimisering van vonnissen en arresten. Dit is **niet** het geval voor de arresten van het Hof.
>

<br>
