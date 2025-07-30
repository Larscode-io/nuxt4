// app/utils/breadcrumbMap.ts

type Crumb = {
  key: string;
  translationKey: string;
}

const home: Crumb = {
  key: '',
  translationKey: 'menu.home'
}

const court: Crumb = {
  key: 'court',
  translationKey: 'menu.court.title'
}

const judgments: Crumb = {
  key: 'judgments',
  translationKey: 'general.message.judgment'
}

const make = (...crumbs: Crumb[]) => crumbs

export const baseBreadcrumbMap: Record<string, Crumb[]> = {
  '/judgments': make(home, judgments),

  '/court/presentation/jurisdiction': make(
    home,
    court,
    { key: 'jurisdiction', translationKey: 'court.jurisdiction.title' }
  ),

  '/court/presentation/organization': make(
    home,
    court,
    { key: 'organization', translationKey: 'court.organization.title' }
  ),

  '/search/judgment': make(
    home,
    { key: 'search', translationKey: 'general.message.search-label' }
  ),

  '/court/basic-text': make(
    home,
    court,
    { key: 'basic-text', translationKey: 'basic-text.constitution.title' }
  ),

  '/court/presentation/history-of-the-court': make(
    home,
    court,
    { key: 'history-of-the-court', translationKey: 'court.history-court.title' }
  ),

  '/judgments/pending-cases': make(
    home,
    judgments,
    { key: 'pending-cases', translationKey: 'general.message.pending-case' }
  ),

  '/court/presentation/how-the-court-operates': make(
    home,
    court,
    { key: 'how-the-court-operates', translationKey: 'court.how-court-operates.title' }
  ),

  '/court/presentation/publications-on-the-court': make(
    home,
    court,
    { key: 'publications-on-the-court', translationKey: 'general.message.publication' }
  ),

  '/media/press-releases-concerning-the-judgments': make(
    home,
    { key: 'media', translationKey: 'contact.media' },
    {
      key: 'press-releases-concerning-the-judgments',
      translationKey: 'general.message.press-releases-about-judgments'
    }
  )
}

// Helper function to get translated breadcrumbs
export const getTranslatedBreadcrumbs = (path: string, t: Function): Array<{ key: string, name: string }> => {
  const crumbs = baseBreadcrumbMap[path] || []
  const translatedCrumbs = crumbs.map(crumb => ({
    key: crumb.key,
    name: t(crumb.translationKey)
  }))
  console.log(translatedCrumbs)
  return translatedCrumbs
}
