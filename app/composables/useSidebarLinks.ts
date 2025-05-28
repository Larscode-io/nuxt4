import { computed } from 'vue'
import type { TocLink } from '@membermodels/members'
import type { ParsedContentv2 } from '@nuxt/content'

type PageContent = ParsedContentv2

export function useSidebarLinks(page: Ref<PageContent | null>) {
  const sideBarLinks = computed(() =>
    page.value ? extractSideBarLinks({ value: page.value }) : [],
  )
  const hasSidebarLinks = computed(() => sideBarLinks.value.length > 0)

  const hasContent = computed(() => Array.isArray(page.value?.body?.value) && page.value.body.value.length > 0)

  function extractSideBarLinks(page: { value: PageContent }): TocLink[] {
    const links = (page?.value?.body?.toc as { links?: TocLink[] })?.links ?? []
    interface Toc {
      id: string
      depth: number
      text?: string
      [key: string]: unknown
    }

    interface FilteredToc extends Toc {
      text: string
    }

    const filtered: FilteredToc[] = links.filter((toc: Toc) => toc.depth === 3)
      .map((toc: Toc) => ({
        ...toc,
        text: toc.text?.split('.').slice(1).join('.').trim() || toc.text?.trim() || '',
      }))
    return filtered.length
      ? filtered
      : [{
          id: '_1-loading',
          depth: 3,
          text: 'Loading... sidebar links',
        }]
  }

  return {
    sideBarLinks,
    hasSidebarLinks,
    extractSideBarLinks,
    hasContent,
  }
}
