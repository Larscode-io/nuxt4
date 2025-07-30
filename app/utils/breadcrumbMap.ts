// app/utils/breadcrumbMap.ts

type LangMap = Record<string, string>
type Crumb = { key: string; nameByLang: LangMap }

const home: Crumb = {
  key: '',
  nameByLang: { nl: 'Home', fr: 'Accueil', de: 'Startseite', en: 'Home' }
}

const court: Crumb = {
  key: 'court',
  nameByLang: { nl: 'Het Hof', fr: 'La Cour', de: 'Das Gericht', en: 'The Court' }
}

const judgments: Crumb = {
  key: 'judgments',
  nameByLang: { nl: 'Arresten', fr: 'Arrêts', de: 'Urteile', en: 'Judgments' }
}

const make = (...crumbs: Crumb[]) => crumbs

export const baseBreadcrumbMap: Record<string, Crumb[]> = {
  '/judgments': make(home, judgments),

  '/court/presentation/jurisdiction': make(
    home,
    court,
    {
      key: 'jurisdiction',
      nameByLang: { nl: 'Bevoegdheden', fr: 'Compétences', de: 'Zuständigkeit', en: 'Jurisdiction' }
    }
  ),

  '/court/presentation/organization': make(
    home,
    court,
    {
      key: 'organization',
      nameByLang: { nl: 'Organisatie', fr: 'Organisation', de: 'Organisation', en: 'Organization' }
    }
  ),

  '/search/judgment': make(
    home,
    {
      key: 'search',
      nameByLang: { nl: 'Zoeken', fr: 'Recherche', de: 'Suche', en: 'Search' }
    }
  ),

  '/court/basic-text': make(
    home,
    court,
    {
      key: 'basic-text',
      nameByLang: { nl: 'Grondtekst', fr: 'Texte fondamental', de: 'Grundtext', en: 'Basic Text' }
    }
  ),

  '/court/presentation/history-of-the-court': make(
    home,
    court,
    {
      key: 'history-of-the-court',
      nameByLang: { nl: 'Historiek', fr: 'Historique', de: 'Geschichte', en: 'History' }
    }
  ),

  '/judgments/pending-cases': make(
    home,
    judgments,
    {
      key: 'pending-cases',
      nameByLang: { nl: 'Hangende zaken', fr: 'Affaires en cours', de: 'Laufende Verfahren', en: 'Pending Cases' }
    }
  ),

  '/court/presentation/how-the-court-operates': make(
    home,
    court,
    {
      key: 'how-the-court-operates',
      nameByLang: { nl: 'Werking', fr: 'Fonctionnement', de: 'Arbeitsweise', en: 'Operation' }
    }
  ),

  '/court/presentation/publications-on-the-court': make(
    home,
    court,
    {
      key: 'publications-on-the-court',
      nameByLang: { nl: 'Publicaties', fr: 'Publications', de: 'Veröffentlichungen', en: 'Publications' }
    }
  ),

  '/media/press-releases-concerning-the-judgments': make(
    home,
    {
      key: 'media',
      nameByLang: { nl: 'Media', fr: 'Médias', de: 'Medien', en: 'Media' }
    },
    {
      key: 'press-releases-concerning-the-judgments',
      nameByLang: { nl: 'Persberichten', fr: 'Communiqués relatifs aux arrêts', de: 'Pressemitteilungen', en: 'Press Releases' }
    }
  )
}
