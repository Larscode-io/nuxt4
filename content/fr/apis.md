---
title: Informations sur l'API
description: Informations concernant les API et leur utilisation
posterUrl: ~/assets/img/newsletter-background.png
---

# Informations sur l'API

Notre site web utilise des API pour la construction des pages. Toutefois, la Cour a décidé de **ne pas fournir de facilités spécifiques** pour l'accès automatisé aux données. Les informations accessibles au public sur notre site peuvent être utilisées **sans l'intervention de notre service informatique**. En analysant nos pages, vous pouvez identifier vous-même les API nécessaires.

<br>

## Exemples d'API disponibles

- **Informations sur les arrêts :**
  `https://node04.const-court.be/api/v1/press/judgments?lang=fr`

- **Informations sur les affaires pendantes :**
  `https://node04.const-court.be/api/v1/juris/pending-cases?lang=fr`

- **Communiqués de presse concernant les arrêts :**
  `https://node04.const-court.be/api/v1/media/press-releases-concerning-judgments?lang=fr&withArchive=false`

<br>

## Technique
> ℹ️ **Astuce :**
> Identifiez vous-même les API utilisées via **les outils de développement de Chrome** (onglet **Réseau**, filtrez sur **XHR** ou **Fetch**).
> Comme de nombreuses pages sont rendues côté serveur (SSR), aucune "fetch" n’apparaît souvent au premier chargement.
> Naviguer côté client (en changeant de page puis en revenant) déclenche généralement une requête visible dans l’onglet Réseau.
> Il peut être nécessaire de faire appel à un spécialiste.

> ⚠️ **Remarque :**
> Le nom du serveur `node04.const-court.be` peut varier selon le backend actif et est susceptible de changer.
> Il est recommandé d’utiliser l’URL plus stable :
> `https://www.const-court.be/api/v1/juris/pending-cases?lang=fr`

<br>

## Arrêts par année

- **NL :** `https://www.const-court.be/public/n`
- **FR :** `https://www.const-court.be/public/f`
- **DE :** `https://www.const-court.be/public/d`

😁 Nous vous prions d’adopter une approche responsable lors de l’utilisation de nos API. Un usage excessif ou trop fréquent peut affecter les performances de nos systèmes. 😠
<br>

**Nous vous recommandons de :**

- mettre en place des mécanismes de mise en cache ;
- répartir les requêtes dans le temps.

Ainsi, nous pouvons garantir un accès efficace et durable aux informations pour tous les utilisateurs de notre infrastructure.

<br>
<br>

## Aspects juridiques
> ⚠️ **Attention :**
> La loi relative au registre central des décisions du pouvoir judiciaire prévoit la pseudonymisation des jugements et arrêts.
> Cela **ne s'applique pas** aux arrêts de la Cour.
>
> **Le téléchargement massif de données est interdit.**
- conformément à la législation applicable en matière de protection des données (voir notre [déclaration de confidentialité](/footer/privacy-policy)) ;
- ainsi qu’à d'autres dispositions légales pertinentes.

> **Attention :**
> La loi relative au registre central des décisions du pouvoir judiciaire prévoit la pseudonymisation des jugements et arrêts. Cela **ne s’applique pas** aux arrêts de la Cour.

<br>
