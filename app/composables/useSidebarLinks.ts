// const { sideBarLinks, hasSidebarLinks } = useSidebarLinks(page)

import { computed } from 'vue'
import type { TocLink, PageContent } from '@membermodels/members'

export function useSidebarLinks(page: Ref<any>) {
  const sideBarLinks = computed(() =>
    page.value ? extractSideBarLinks({ value: page.value }) : [],
  )
  const hasSidebarLinks = computed(() => sideBarLinks.value.length > 0)
  const hasContent = computed(() => Array.isArray(page.value?.body?.value) && page.value.body.value.length > 0)

  function extractSideBarLinks(page: { value: PageContent }): TocLink[] {
    const links = page?.value?.body?.toc?.links ?? []
    const filtered = links.filter(toc => toc.depth === 3)
      .map(toc => ({
        ...toc,
        text: toc.text?.split('.').slice(1).join('.').trim() || toc.text?.trim() || '',
      }))
    return filtered.length
      ? filtered
      : [{
          id: '_1-gwh',
          depth: 3,
          text: 'No links found in markdown doc, do you need a ContentPage ?',
        }]
  }

  return {
    sideBarLinks,
    hasSidebarLinks,
    extractSideBarLinks,
    hasContent,
  }
}
