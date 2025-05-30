<script setup lang="ts">
import img from '@assets/img/organisation-Y-0050.png'
import '@assets/css/content.css'
import type { Member } from '@membermodels/members'
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import { ContentKeys } from '@core/constants'
import type { ParsedContentv2 } from '@nuxt/content'

function setFirstDynamicTocEntry() {
  const first = dynamicLinks.value[0]?.id
  if (first && currentActiveContentInToc.value !== first) {
    updateCurrentActiveContentInToc(first)
  }
}

type PageContent = ParsedContentv2
void 0 as unknown as Member

const { locale } = useI18n()
const { t, langCollection } = useLanguage()

const { currentActiveContentInToc, updateCurrentActiveContentInToc } = useActiveSectionObserver('h3', 0.75)

// Here we fetch the members data using the useMembers composable
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
} = useMembers(locale)

const { data: results, pending } = useAsyncData(
  `organisation-page-${locale.value}`,
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

type TocLink = {
  id: string
  depth: number
  text: string
}

interface Toc {
  id: string
  depth: number
  text?: string
  [key: string]: unknown
}

interface FilteredToc extends Toc {
  text: string
}

function extractSideBarLinks(page: PageContent): TocLink[] {
  if (!page?.body?.toc?.links) return []

  const links = (page?.body?.toc as { links?: TocLink[] })?.links ?? []

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

const staticLinks = ref<TocLink[]>([])
const dynamicLinks = computed(() => {
  if (
    !pageJudge.value
  ) {
    return []
  }

  return [
    ...extractSideBarLinks(pageJudge.value),
    ...extractSideBarLinks(pageReferendar.value),
    ...extractSideBarLinks(pageClerk.value),
    ...extractSideBarLinks(pageOfficeStaff.value),
  ]
})

const mergedSidebarLinks = computed(() => [
  ...dynamicLinks.value,
  ...staticLinks.value,
])

watchEffect(() => {
  staticLinks.value = [
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

watch(
  [locale, dynamicLinks],
  () => setFirstDynamicTocEntry(),
  // changing toc works on the dom so we best wait for the next tick
  { immediate: true, flush: 'post' },
)

onMounted(() => {
  // here we set the first dynamic toc entry
  setFirstDynamicTocEntry()
})
</script>

<template>
  <div class="content-wrapper">
    <BannerImage
      :title="t('menu.court.presentation.organization')"
      :description="t('menu.court.presentation.organization-title-description')"
      :image="img"
      :alt="t('alt.banner.flag')"
    />
    <v-container>
      <v-row
        class="d-flex"
        justify="center"
      >
        <v-col
          cols="12"
          md="4"
        >
          <SideBar
            v-if="!pending && mergedSidebarLinks.length"
            :active="currentActiveContentInToc"
            :toc="mergedSidebarLinks"
            @click="updateCurrentActiveContentInToc"
          />
        </v-col>
        <v-col
          cols="12"
          md="8"
        >
          <v-row>
            <ClientOnly>
              <!-- 1️⃣ Full-width placeholder -->
              <template #placeholder>
                <v-col
                  cols="12"
                  class="my-skeleton-wrapper"
                >
                  <v-skeleton-loader
                    v-for="n in 10"
                    :key="n"
                    type="list-item-two-line"
                  />
                </v-col>
              </template>

              <!-- 2️⃣ Real content -->
              <article v-if="pageJudge">
                <ContentRenderer
                  :value="pageJudge.body"
                  class="nuxt-content"
                />
              </article>
            </ClientOnly>

            <div
              v-for="(member, index) in judgeMembers"
              :key="member!.slug"
              class="gallery"
              :class="{ 'left-column': index % 2 === 0, 'right-column': index % 2 !== 0 }"
            >
              <MemberCard
                :headline-level="2"
                :name="member!.name"
                :slug="member!.slug"
                :image="member!.picture"
                :with-image="true"
                :infos="member!.infos"
                :job-title="member!.mostRecentRole?.role"
                :width="300"
                :is-alive="true"
                :lang="member!.lang"
                :female-title="member!.femaleTitle"
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
              :key="member!.slug"
              class="gallery"
              :class="{ 'left-column': index % 2 === 0, 'right-column': index % 2 !== 0 }"
            >
              <MemberCard
                :headline-level="2"
                :name="member!.name"
                :slug="member!.slug"
                :image="member!.picture"
                :with-image="true"
                :infos="member!.infos"
                :job-title="member!.mostRecentRole?.role"
                :width="300"
                :is-alive="member!.isAlive"
                :lang="member!.lang"
                :female-title="member!.femaleTitle"
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
              :key="member!.slug"
              class="gallery"
              :class="{ 'left-column': index % 2 === 0, 'right-column': index % 2 !== 0 }"
            >
              <MemberCard
                :headline-level="2"
                :name="member!.name"
                :slug="member!.slug"
                :image="member!.picture"
                :with-image="true"
                :infos="member!.infos"
                :job-title="member!.mostRecentRole?.role"
                :width="300"
                :is-alive="member!.isAlive"
                :lang="member!.lang"
                :female-title="member!.femaleTitle"
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
                :job-title="member.roles[0]?.role"
                :lang="member.lang"
                :start-date="member.roles[0]?.startDate"
                :end-date="member.roles[0]?.endDate"
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
                v-for="(member, i) of presidentMembersHistoric"
                :key="`${member.slug}-${i}`"
                :headline-level="5"
                :slug="member.slug"
                :infos="member.infos"
                :is-small="true"
                :name="member.name"
                :with-image="false"
                :job-title="member.roles[0]?.role"
                :lang="member.lang"
                :start-date="member.roles[0]?.startDate"
                :end-date="member.roles[0]?.endDate"
                :is-alive="member.isAlive"
                :female-title="member.femaleTitle"
              />
            </div>

            <h4 class="heading-h3">
              {{ t('general.message.judges') }}
            </h4>

            <div class="gallery d-flex justify-space-between flex-wrap">
              <MemberCard
                v-for="(member, i) of judgeMembersHistoric"
                :key="`${member.slug}-${i}`"
                :headline-level="5"
                :slug="member.slug"
                :infos="member.infos"
                :is-small="true"
                :name="member.name"
                :with-image="false"
                :job-title="member.roles[0]?.role"
                :lang="member.lang"
                :start-date="member.roles[0]?.startDate"
                :end-date="member.roles[0]?.endDate"
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
