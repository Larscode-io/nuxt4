<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { ref, watch, computed } from 'vue'
import img from '@assets/img/organisation-Y-0050.png'
import type { Member, PageContent } from '@membermodels/members'
import { ContentKeys } from '@core/constants'
import '@assets/css/content.css'

const { t, locale } = useLanguage()
const {
  judgeMembers,
  registrarMembers,
  officeStaffMembers,
  judgeMembersHistoric,
  presidentMembersHistoric,
  aliveNonActiveJudgeMembersHistoric,
  aliveNonActivePresidentMembersHistoric,
  aliveNonActiveRegistrarMembersHistoric,
  aliveNonActiveOfficeStaffMembersHistoric,
} = useMembers(locale) as {
  judgeMembers: ComputedRef<Member[]>
  registrarMembers: ComputedRef<Member[]>
  officeStaffMembers: ComputedRef<Member[]>
  judgeMembersHistoric: ComputedRef<Member[]>
  presidentMembersHistoric: ComputedRef<Member[]>
  aliveNonActiveJudgeMembersHistoric: ComputedRef<Member[]>
  aliveNonActivePresidentMembersHistoric: ComputedRef<Member[]>
  aliveNonActiveRegistrarMembersHistoric: ComputedRef<Member[]>
  aliveNonActiveOfficeStaffMembersHistoric: ComputedRef<Member[]>
}
const { currentActiveContentInToc, updateCurrentActiveContentInToc } = useActiveSectionObserver('h3', 0.75)

// Minimal dummy page with only the required structure
// so we can use the sidebar component for more than 1 content page
const dummyPage = ref<PageContent>({
  title: 'No content available',
  body: {
    toc: {
      id: 'dummyId',
      depth: 3,
      text: 'No content available',
    },
  },
})

const { sideBarLinks, hasSidebarLinks, extractSideBarLinks } = useSidebarLinks(dummyPage)

const { data: results } = await useAsyncData(
  `organisationPages-${locale.value}`,
  async () => {
    const [pageJudge, pageReferendar, pageClerk, pageOfficeStaff] = await Promise.all([
      $fetch(`/${locale.value}/${ContentKeys.presentationOrganizationJudge}`),
      $fetch(`/${locale.value}/${ContentKeys.presentationOrganizationReferendar}`),
      $fetch(`/${locale.value}/${ContentKeys.presentationOrganizationClerk}`),
      $fetch(`/${locale.value}/${ContentKeys.presentationJobOffers}`),
    ])
    return { pageJudge, pageReferendar, pageClerk, pageOfficeStaff }
  },
)

// Helper to check if an object is a valid PageContent
function isPageContent(val: unknown): val is PageContent {
  return !!val && typeof val === 'object' && 'title' in val && 'body' in val
}

const pageJudge = computed<PageContent | null>(() => {
  const val = results.value?.pageJudge
  return isPageContent(val) ? val : null
})
const pageClerk = computed<PageContent | null>(() => {
  const val = results.value?.pageClerk
  return isPageContent(val) ? val : null
})
const pageReferendar = computed<PageContent | null>(() => {
  const val = results.value?.pageReferendar
  return isPageContent(val) ? val : null
})
const pageOfficeStaff = computed<PageContent | null>(() => {
  const val = results.value?.pageOfficeStaff
  return isPageContent(val) ? val : null
})

const judgeLinks = computed(() => pageJudge.value ? extractSideBarLinks({ value: pageJudge.value }) : [])
const clerkLinks = computed(() => pageClerk.value ? extractSideBarLinks({ value: pageClerk.value }) : [])
const referendarLinks = computed(() => pageReferendar.value ? extractSideBarLinks({ value: pageReferendar.value }) : [])
const officeStaffLinks = computed(() => pageOfficeStaff.value ? extractSideBarLinks({ value: pageOfficeStaff.value }) : [])

const mergedSidebarLinks = computed(() => [
  ...judgeLinks.value,
  ...referendarLinks.value,
  ...clerkLinks.value,
  ...officeStaffLinks.value,
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
])

watch(mergedSidebarLinks, (newLinks) => {
  dummyPage.value.body.toc.links = newLinks
}, { immediate: true })

onMounted(() => {
  const sidebarLinks = extractSideBarLinks({ value: dummyPage.value })
  // jump to the first link in the sidebar
  if (sidebarLinks.length > 0 && sidebarLinks[0]?.id) {
    updateCurrentActiveContentInToc(sidebarLinks[0]?.id)
  }
})
</script>

<template>
  <div class="content-wrapper">
    <BannerImage
      :title="pageJudge?.title || t('court.organization.title')"
      :description="pageJudge?.description"
      :image="img"
      :alt="t('alt.banner.flag')"
    />
    <v-container>
      <v-row
        class="d-flex"
        justify="center"
      >
        <v-col
          v-if="hasSidebarLinks"
          cols="12"
          md="4"
        >
          <SideBar
            :active="currentActiveContentInToc"
            :toc="sideBarLinks"
            @click="updateCurrentActiveContentInToc"
          />
        </v-col>
        <v-col
          cols="12"
          md="8"
        >
          <v-row>
            <article v-if="pageJudge ">
              <ContentRenderer
                :value="pageJudge.body"
                class="nuxt-content content-renderer"
              />
            </article>

            <div
              v-for="(member, index) in judgeMembers"
              :key="member.slug"
              class="gallery"
              :class="{ 'left-column': index % 2 === 0, 'right-column': index % 2 !== 0 }"
            >
              <MemberCard
                :headline-level="2"
                :name="member.name"
                :slug="member.slug"
                :image="member.picture"
                :with-image="true"
                :infos="member.infos"
                :job-title="member.mostRecentRole?.role"
                :width="300"
                :is-alive="true"
                :lang="member.lang"
                :female-title="member.femaleTitle"
              />
            </div>

            <article v-if="pageReferendar">
              <ContentRenderer
                :value="pageReferendar.body"
                class="nuxt-content"
              />
            </article>
            <div
              v-for="(member, index) in officeStaffMembers"
              :key="member.slug"
              class="gallery"
              :class="{ 'left-column': index % 2 === 0, 'right-column': index % 2 !== 0 }"
            >
              <MemberCard
                :headline-level="2"
                :name="member.name"
                :slug="member.slug"
                :image="member.picture"
                :with-image="true"
                :infos="member.infos"
                :job-title="member.mostRecentRole?.role"
                :width="300"
                :is-alive="member.isAlive"
                :lang="member.lang"
                :female-title="member.femaleTitle"
              />
            </div>

            <article v-if="pageClerk">
              <ContentRenderer
                :value="pageClerk.body"
                class="nuxt-content"
              />
            </article>

            <div
              v-for="(member, index) in registrarMembers"
              :key="member.slug"
              class="gallery"
              :class="{ 'left-column': index % 2 === 0, 'right-column': index % 2 !== 0 }"
            >
              <MemberCard
                :headline-level="2"
                :name="member.name"
                :slug="member.slug"
                :image="member.picture"
                :with-image="true"
                :infos="member.infos"
                :job-title="member.mostRecentRole?.role"
                :width="300"
                :is-alive="member.isAlive"
                :lang="member.lang"
                :female-title="member.femaleTitle"
              />
            </div>

            <article v-if="pageOfficeStaff">
              <ContentRenderer
                :value="pageOfficeStaff.body"
                class="nuxt-content"
              />
            </article>

            <div class="section-content nuxt-content">
              <h3 :id="toSlug(t('court.organization.emeritus-and-honorary-members'))">
                {{ t('court.organization.emeritus-and-honorary-members') }}
              </h3>
            </div>

            <h4 class="heading-h3">
              {{ t('general.message.presidents') }}
            </h4>

            <div class="gallery d-flex justify-space-between flex-wrap">
              <MemberCard
                v-for="member of aliveNonActivePresidentMembersHistoric"
                :key="member.slug"
                :headline-level="5"
                :slug="member.slug"
                :infos="member.infos"
                :is-small="true"
                :name="member.name"
                :with-image="false"
                :job-title="member.mostRecentRole?.role"
                :lang="member.lang"
                :is-alive="member.isAlive"
                :female-title="member.femaleTitle"
              />
            </div>

            <h4 class="heading-h3">
              {{ t('general.message.judges') }}
            </h4>

            <div class="gallery d-flex justify-space-between flex-wrap">
              <MemberCard
                v-for="member of aliveNonActiveJudgeMembersHistoric"
                :key="member.slug"
                :headline-level="5"
                :slug="member.slug"
                :infos="member.infos"
                :is-small="true"
                :name="member.name"
                :with-image="false"
                :job-title="member.mostRecentRole?.role"
                :lang="member.lang"
                :is-alive="member.isAlive"
                :female-title="member.femaleTitle"
              />
            </div>

            <h4 class="heading-h3">
              {{ t('general.message.legal-secretaries') }}
            </h4>

            <div class="gallery d-flex justify-space-between flex-wrap">
              <MemberCard
                v-for="member of aliveNonActiveOfficeStaffMembersHistoric"
                :key="member.slug"
                :headline-level="5"
                :slug="member.slug"
                :infos="member.infos"
                :is-small="true"
                :name="member.name"
                :with-image="false"
                :job-title="member.mostRecentRole?.role"
                :lang="member.lang"
                :is-alive="member.isAlive"
                :female-title="member.femaleTitle"
              />
            </div>

            <h4 class="heading-h3">
              {{ t('general.message.registrars') }}
            </h4>

            <div class="gallery d-flex justify-space-between flex-wrap">
              <MemberCard
                v-for="member of aliveNonActiveRegistrarMembersHistoric"
                :key="member.slug"
                :headline-level="5"
                :slug="member.slug"
                :infos="member.infos"
                :is-small="true"
                :name="member.name"
                :with-image="false"
                :job-title="member.mostRecentRole?.role"
                :lang="member.lang"
                :is-alive="member.isAlive"
                :female-title="member.femaleTitle"
              />
            </div>

            <div class="section-content nuxt-content">
              <h3 :id="toSlug(t('court.organization.previous-incumbents'))">
                {{ t('court.organization.previous-incumbents') }}
              </h3>
            </div>

            <h4 class="heading-h3">
              {{ t('general.message.presidents') }}
            </h4>

            <div class="gallery d-flex justify-space-between flex-wrap">
              <MemberCard
                v-for="member of presidentMembersHistoric"
                :key="member.slug"
                :headline-level="5"
                :slug="member.slug"
                :infos="member.infos"
                :is-small="true"
                :name="member.name"
                :with-image="false"
                :job-title="member.mostRecentRole?.role"
                :lang="member.lang"
                :start-date="member.startDate"
                :end-date="member.endDate"
                :is-alive="member.isAlive"
                :female-title="member.femaleTitle"
              />
            </div>

            <h4 class="heading-h3">
              {{ t('general.message.judges') }}
            </h4>

            <div class="gallery d-flex justify-space-between flex-wrap">
              <MemberCard
                v-for="member of judgeMembersHistoric"
                :key="member.slug"
                :headline-level="5"
                :slug="member.slug"
                :infos="member.infos"
                :is-small="true"
                :name="member.name"
                :with-image="false"
                :job-title="member.mostRecentRole?.role"
                :lang="member.lang"
                :start-date="member.startDate"
                :end-date="member.endDate"
                :is-alive="member.isAlive"
                :female-title="member.femaleTitle"
              />
            </div>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.nuxt-content {
  width: 100%;
}

.left-column {
  display: flex;
  justify-content: flex-start;
  width: 50%;
}

.right-column {
  display: flex;
  justify-content: flex-end;
  width: 50%;
}

.heading-h3 {
  width: 100%;
}

.gallery {
  padding: 0 16px;
}

@media (max-width: 579px) {
  .gallery {
    width: 100%;
    float: none;
    justify-content: center !important;
  }
}

@media (max-width: 480px) {
  .gallery {
    width: 100%;
    float: none;
    justify-content: center !important;
  }

  .left-column,
  .right-column {
    clear: both;
    justify-content: center;
  }
}
</style>
