import { computed } from 'vue'
// import type { PageContent } from '@membermodels/members'
import { ContentKeys } from '@core/constants'
import type { ParsedContentv2 } from '@nuxt/content'

type PageContent = ParsedContentv2
export function useOrganisationPages(locale: Ref<string>) {
  const { t, langCollection } = useLanguage()

  const { currentActiveContentInToc, updateCurrentActiveContentInToc } = useActiveSectionObserver('h3', 0.75)

  // so we can use the extractSideBarLinks composable made for a one-page structure
  const dummyPage = ref<PageContent>({
    title: 'No content available',
    description: '',
    body: {
      toc: {
        id: 'dummyId',
        depth: 3,
        text: 'No content available',
        links: [],
      },
      children: [],
      type: 'root',
    },
    _id: 'dummyId',
    _path: '',
    _locale: '',
  })
  const { sideBarLinks, hasSidebarLinks, extractSideBarLinks } = useSidebarLinks(dummyPage)

  const { data: results } = useAsyncData(
    `stay-informed-${locale.value}`,
    async () => {
      const collection = langCollection[locale.value as keyof typeof langCollection] ?? 'collection_dutch'
      const [pageJudge, pageReferendar, pageClerk, pageOfficeStaff] = await Promise.all([
        queryCollection(collection).path(`/${locale.value}/${ContentKeys.presentationOrganizationJudge}`).first(),
        queryCollection(collection).path(`/${locale.value}/${ContentKeys.presentationOrganizationReferendar}`).first(),
        queryCollection(collection).path(`/${locale.value}/${ContentKeys.presentationOrganizationClerk}`).first(),
        queryCollection(collection).path(`/${locale.value}/${ContentKeys.presentationOrganizationOfficeStaff}`).first(),
      ])
      return { pageJudge, pageReferendar, pageClerk, pageOfficeStaff }
    },
  )

  const pageJudge = computed(() => results.value?.pageJudge)
  const pageOfficeStaff = computed(() => results.value?.pageOfficeStaff)
  const pageReferendar = computed(() => results.value?.pageReferendar)
  const pageClerk = computed(() => results.value?.pageClerk)

  const judgeLinks = computed(() => pageJudge.value ? extractSideBarLinks({ value: pageJudge.value }) : [])
  const clerkLinks = computed(() => pageClerk.value ? extractSideBarLinks({ value: pageClerk.value }) : [])
  const referendarLinks = computed(() => pageReferendar.value ? extractSideBarLinks({ value: pageReferendar.value }) : [])
  const officeStaffLinks = computed(() => pageOfficeStaff.value ? extractSideBarLinks({ value: pageOfficeStaff.value }) : [])

  const mergedSidebarLinks = computed(() => {
    if (
      !pageJudge.value
    ) {
      return [] // wachten tot alles geladen is
    }

    return [
      ...extractSideBarLinks({ value: pageJudge.value }),
      ...extractSideBarLinks({ value: pageReferendar.value }),
      ...extractSideBarLinks({ value: pageClerk.value }),
      ...extractSideBarLinks({ value: pageOfficeStaff.value }),
      {
        id: toSlug(t('court.organization.emeritus-and-honorary-members')),
        depth: 3,
        text: t('court.organization.emeritus-and-honorary-members'),
      },
      {
        id: toSlug(t('court.organization.previous-incumbents')),
        depth: 3,
        text: t('court.organization.previous-incumbents'),
      },
    ]
  })

  watch(mergedSidebarLinks, (newLinks) => {
    dummyPage.value.body.toc.links = newLinks
  }, { immediate: true })

  onMounted(() => {
    const sidebarLinks = extractSideBarLinks({ value: dummyPage.value })
    if (sidebarLinks.length > 0 && sidebarLinks[0]?.id) {
      updateCurrentActiveContentInToc(sidebarLinks[0]?.id)
    }
  })
  return {
    currentActiveContentInToc,
    updateCurrentActiveContentInToc,
    dummyPage,
    sideBarLinks,
    hasSidebarLinks,
    extractSideBarLinks,
    pageJudge,
    pageOfficeStaff,
    pageReferendar,
    pageClerk,
    locale,
  }
}
