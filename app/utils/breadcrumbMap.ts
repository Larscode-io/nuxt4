// app/utils/breadcrumbMap.ts

export const baseBreadcrumbMap: Record<string, { key: string; nameByLang: Record<string, string> }[]> = {
  '/judgments': [
    { key: '', nameByLang: { nl: 'Home', fr: 'Accueil', de: 'Startseite', en: 'Home' } },
    { key: 'judgments', nameByLang: { nl: 'Arresten', fr: 'Arrêts', de: 'Urteile', en: 'Judgments' } },
  ],
  '/court/presentation/jurisdiction': [
    { key: '', nameByLang: { nl: 'Home', fr: 'Accueil', de: 'Startseite', en: 'Home' } },
    { key: 'court', nameByLang: { nl: 'Het Hof', fr: 'La Cour', de: 'Das Gericht', en: 'The Court' } },
    { key: 'jurisdiction', nameByLang: { nl: 'Bevoegdheden', fr: 'Compétences', de: 'Zuständigkeit', en: 'Jurisdiction' } },
  ],
  '/court/presentation/organization': [
    { key: '', nameByLang: { nl: 'Home', fr: 'Accueil', de: 'Startseite', en: 'Home' } },
    { key: 'court', nameByLang: { nl: 'Het Hof', fr: 'La Cour', de: 'Das Gericht', en: 'The Court' } },
    { key: 'organization', nameByLang: { nl: 'Organisatie', fr: 'Organisation', de: 'Organisation', en: 'Organization' } },
  ],
  '/search/judgment': [
    { key: '', nameByLang: { nl: 'Home', fr: 'Accueil', de: 'Startseite', en: 'Home' } },
    { key: 'search', nameByLang: { nl: 'Zoeken', fr: 'Recherche', de: 'Suche', en: 'Search' } },
  ],
  '/court/basic-text': [
    { key: '', nameByLang: { nl: 'Home', fr: 'Accueil', de: 'Startseite', en: 'Home' } },
    { key: 'court', nameByLang: { nl: 'Het Hof', fr: 'La Cour', de: 'Das Gericht', en: 'The Court' } },
    { key: 'basic-text', nameByLang: { nl: 'Grondtekst', fr: 'Texte fondamental', de: 'Grundtext', en: 'Basic Text' } },
  ],
  '/court/presentation/history-of-the-court': [
    { key: '', nameByLang: { nl: 'Home', fr: 'Accueil', de: 'Startseite', en: 'Home' } },
    { key: 'court', nameByLang: { nl: 'Het Hof', fr: 'La Cour', de: 'Das Gericht', en: 'The Court' } },
    { key: 'history-of-the-court', nameByLang: { nl: 'Historiek', fr: 'Historique', de: 'Geschichte', en: 'History' } },
  ],
  '/judgments/pending-cases': [
    { key: '', nameByLang: { nl: 'Home', fr: 'Accueil', de: 'Startseite', en: 'Home' } },
    { key: 'judgments', nameByLang: { nl: 'Arresten', fr: 'Arrêts', de: 'Urteile', en: 'Judgments' } },
    { key: 'pending-cases', nameByLang: { nl: 'Hangende zaken', fr: 'Affaires en cours', de: 'Laufende Verfahren', en: 'Pending Cases' } },
  ],
  '/court/presentation/how-the-court-operates': [
    { key: '', nameByLang: { nl: 'Home', fr: 'Accueil', de: 'Startseite', en: 'Home' } },
    { key: 'court', nameByLang: { nl: 'Het Hof', fr: 'La Cour', de: 'Das Gericht', en: 'The Court' } },
    { key: 'how-the-court-operates', nameByLang: { nl: 'Werking', fr: 'Fonctionnement', de: 'Arbeitsweise', en: 'Operation' } },
  ],
  '/court/presentation/publications-on-the-court': [
    { key: '', nameByLang: { nl: 'Home', fr: 'Accueil', de: 'Startseite', en: 'Home' } },
    { key: 'court', nameByLang: { nl: 'Het Hof', fr: 'La Cour', de: 'Das Gericht', en: 'The Court' } },
    { key: 'publications-on-the-court', nameByLang: { nl: 'Publicaties', fr: 'Publications', de: 'Veröffentlichungen', en: 'Publications' } },
  ],
  '/media/press-releases-concerning-the-judgments': [
    { key: '', nameByLang: { nl: 'Home', fr: 'Accueil', de: 'Startseite', en: 'Home' } },
    { key: 'media', nameByLang: { nl: 'Media', fr: 'Médias', de: 'Medien', en: 'Media' } },
    { key: 'press-releases-concerning-the-judgments', nameByLang: { nl: 'Persberichten', fr: 'Communiqués relatifs aux arrêts', de: 'Pressemitteilungen', en: 'Press Releases' } },
  ]
};
