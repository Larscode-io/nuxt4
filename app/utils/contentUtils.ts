type TocLink = {
  id?: string
  depth: number
  text: string
}

export const extractSideBarLinks = (page: { value: { body: { toc: { links: TocLink[] } } } }): TocLink[] => {
  const getFilteredLinks = (links: TocLink[]) =>
    links.filter(toc => toc.depth === 3)

  const formatLinkText = (text: string): string =>
    text.split('.').slice(1).join('.').trim() || text.trim()

  const links = getFilteredLinks(page.value.body?.toc?.links || []).map(toc => ({
    ...toc,
    text: toc.text ? formatLinkText(toc.text) : '',
  }))

  return links.length === 0
    ? [
        {
          id: '_1-gwh',
          depth: 3,
          text: 'No links found in markdown doc, set :enable-toc="false" when using ContentPage component',
        },
      ]
    : links
}
