<script setup lang="ts">
import img from '@assets/img/organisation-Y-0050.png'
import '@assets/css/content.css'
import type { Member } from '@membermodels/members'

void 0 as unknown as Member

const { t } = useI18n()
const { locale } = useLanguage()

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

// Here we fetch the content for the organization pages using the useOrganisationPages composable
const {
  pageJudge,
  pageOfficeStaff,
  pageReferendar,
  pageClerk,
  sideBarLinks,
  currentActiveContentInToc,
  updateCurrentActiveContentInToc,
  hasSidebarLinks,
  loadingPageContent,
} = useOrganisationPages(locale)
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
        v-if="!loadingPageContent"
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
