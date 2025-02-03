<template>
  <div class="content-wrapper">
    <BannerImage v-if="pageJudge" :title="pageJudge.title" :description="pageJudge.description" :image="img"
      :alt="t('alt.banner.flag')" />
    <v-container>
      <v-row class="d-flex" justify="center">
        <v-col v-if="hasSidebarLinks" cols="12" md="4">
          <Sidebar :active="currentActiveContentInToc" :toc="sideBarLinks" @click="updateCurrentActiveContentInToc" />
        </v-col>
        <v-col cols="12" md="8">

          <v-row>
            <article v-if="pageJudge">
              <ContentRendererMarkdown :value="pageJudge.body" class="nuxt-content" />
            </article>

            <div v-for="(member, index) in judgeMembers" :key="index" class="gallery"
              :class="{ 'left-column': index % 2 === 0, 'right-column': index % 2 !== 0 }">
              <MemberCard :headlineLevel="2" :name="member.name" :slug="member.slug" :image="member.picture"
                :withImage="true" :infos="getInfo(member.infos)" :jobTitle="member.role" :width="300"
                :isAlive="member.isAlive" :lang="member.lang" :femaleTitle="member.femaleTitle" />
            </div>

            <article v-if="pageReferendar">
              <ContentRendererMarkdown :value="pageReferendar.body" class="nuxt-content" />
            </article>

            <div v-for="(member, index) in officeStaffMembers" :key="index" class="gallery"
              :class="{ 'left-column': index % 2 === 0, 'right-column': index % 2 !== 0 }">
              <MemberCard :headlineLevel="2" :name="member.name" :slug="member.slug" :image="member.picture"
                :withImage="true" :infos="getInfo(member.infos)" :jobTitle="member.role" :width="300"
                :isAlive="member.isAlive" :lang="member.lang" :femaleTitle="member.femaleTitle" />
            </div>

            <article v-if="pageClerk">
              <ContentRendererMarkdown :value="pageClerk.body" class="nuxt-content" />
            </article>

            <div v-for="(member, index) in registrarMembers" :key="index" class="gallery"
              :class="{ 'left-column': index % 2 === 0, 'right-column': index % 2 !== 0 }">
              <MemberCard :headlineLevel="2" :name="member.name" :slug="member.slug" :image="member.picture"
                :withImage="true" :infos="getInfo(member.infos)" :jobTitle="member.role" :width="300"
                :isAlive="member.isAlive" :lang="member.lang" :femaleTitle="member.femaleTitle" />
            </div>

            <article v-if="pageOfficeStaff">
              <ContentRendererMarkdown :value="pageOfficeStaff.body" class="nuxt-content" />
            </article>

            <div class="section-content nuxt-content">
              <h3 :id="toSlug(t('court.organization.emeritus-and-honorary-members'))">
                {{ t('court.organization.emeritus-and-honorary-members') }}
              </h3>
            </div>

            <h4 class="heading-h3">
              {{ t('general.message.presidents') }}
            </h4>

            <div class="d-flex justify-space-between flex-wrap">
              <MemberCard v-for="member of membersEmeritusPresidents" :headline-level="5" :slug="member.slug"
                :infos="getInfo(member.infos)" :isSmall="true" :name="member.name" :with-image="false"
                :jobTitle="member.role" :lang="member.lang" :isAlive="member.isAlive" :femaleTitle="member.femaleTitle" />
            </div>

            <h4 class="heading-h3">
              {{ t('general.message.judges') }}
            </h4>

            <div class="d-flex justify-space-between flex-wrap">
              <MemberCard v-for="member of membersEmeritusJudges" :headline-level="5" :slug="member.slug"
                :infos="getInfo(member.infos)" :isSmall="true" :name="member.name" :with-image="false"
                :jobTitle="member.role" :lang="member.lang" :isAlive="member.isAlive" :femaleTitle="member.femaleTitle" />
            </div>


            <h4 class="heading-h3">
              {{ t('general.message.legal-secretaries') }}
            </h4>

            <div class="d-flex justify-space-between flex-wrap">
              <MemberCard v-for="member of membersEmeritusOfficeStaffMembers" :headline-level="5" :slug="member.slug"
                :infos="getInfo(member.infos)" :isSmall="true" :name="member.name" :with-image="false"
                :jobTitle="member.role" :lang="member.lang" :isAlive="member.isAlive" :femaleTitle="member.femaleTitle" />
            </div>

            <h4 class="heading-h3">
              {{ t('general.message.registrars') }}
            </h4>

            <div class="lowImageGallery">
              <MemberCard v-for="member of membersEmeritusRegistrars" :headline-level="5" :slug="member.slug"
                :infos="getInfo(member.infos)" :isSmall="true" :name="member.name" :with-image="false"
                :jobTitle="member.role" :lang="member.lang" :isAlive="member.isAlive" :femaleTitle="member.femaleTitle" />
            </div>

            <div class="section-content nuxt-content">
              <h3 :id="toSlug(t('court.organization.previous-incumbents'))">
                {{ t('court.organization.previous-incumbents') }}
              </h3>
            </div>

            <h4 class="heading-h3">
              {{ t('general.message.presidents') }}
            </h4>

            <div class="d-flex justify-space-between flex-wrap">
              <MemberCard v-for="member of membersHistoricPresidents" :headline-level="5" :slug="member.slug"
                :infos="getInfo(member.infos)" :isSmall="true" :name="member.name" :with-image="false"
                :jobTitle="member.role" :lang="member.lang" :startDate="member.startDate" :endDate="member.endDate"
                :isAlive="member.isAlive" :femaleTitle="member.femaleTitle" />
            </div>

            <h4 class="heading-h3">
              {{ t('general.message.judges') }}
            </h4>

            <div class="d-flex justify-space-between flex-wrap">
              <MemberCard v-for="member of membersHistoricJudges" :headline-level="5" :slug="member.slug"
                :infos="getInfo(member.infos)" :isSmall="true" :name="member.name" :with-image="false"
                :jobTitle="member.role" :lang="member.lang" :startDate="member.startDate" :endDate="member.endDate"
                :isAlive="member.isAlive" :femaleTitle="member.femaleTitle" />
            </div>

          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ContentKeys, type Locale } from '~/core/constants';
import { useLanguage } from '@/composables/useLanguage';
import img from '~/assets/img/organisation.png';
import { extractSideBarLinks } from '~/utils/contentUtils';
import { fetchMultipleByPaths } from '~/utils/requestUtils';
import MemberCard from '../../../components/MemberCard.vue';
import '~/assets/css/content.css';
import { type Member, type Infos } from '@types/members';
import { type PageContent } from '@types/content';

const { t, locale } = useLanguage();

const currentActiveContentInToc = ref('');
const pageJudge: Ref<PageContent | null> = ref(null);
const pageOfficeStaff: Ref<PageContent | null> = ref(null);
const pageReferendar: Ref<PageContent | null> = ref(null);
const pageClerk: Ref<PageContent | null> = ref(null);
const membersResponse = ref<{ data: Member[] }>();
const membersEmeritusResponse = ref<{ data: Member[] }>();
const membersHistoricResponse = ref<{ data: Member[] }>();
const sideBarLinks = ref([]);
// These include all roles that should be displayed in the "judges" section
const judgeMembers = ref<Member[]>([]);
const officeStaffMembers = ref<Member[]>([]);
const registrarMembers = ref<Member[]>([]);
const membersEmeritusPresidents = ref<Member[]>([]);
const membersEmeritusJudges = ref<Member[]>([]);
const membersEmeritusOfficeStaffMembers = ref<Member[]>([]);
const membersEmeritusRegistrars = ref<Member[]>([]);

const membersHistoricPresidents = ref<Member[]>([]);
const membersHistoricJudges = ref<Member[]>([]);

const hasSidebarLinks = computed(() => sideBarLinks.value.length > 0);

const updateCurrentActiveContentInToc = (id: string) => {
  currentActiveContentInToc.value = id;
};

const startIntersectionObserver = () => {
  const options = {
    threshold: 0.9,
    rootMargin: '0px 0px -50% 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const elem = entry.target as HTMLElement;

        if (entry.intersectionRatio >= 0.75) {
          updateCurrentActiveContentInToc(elem.id);
        }
      }
    });
  }, options);

  document.querySelectorAll('h3').forEach((el) => {
    if (sideBarLinks.value.map((toc: { id: string }) => toc.id).includes(el.id)) {
      observer.observe(el);
    }
  });
};

const alternateLang = (mems) => {
  let startLang: string;
  if (locale.value === Languages.FRENCH || locale.value === Languages.GERMAN) {
    startLang = Languages.FRENCH
  } else {
    startLang = Languages.DUTCH
  }
  const altLang = startLang === 'fr' ? 'nl' : 'fr',
    p = mems.filter(m => m.lang === startLang),
    s = mems.filter(m => m.lang === altLang),
    r = [];
  for (let i = 0; i < Math.max(p.length, s.length); i++) {
    p[i] && r.push(p[i]);
    s[i] && r.push(s[i]);
  }
  return r;
}

const updateMembers = () => {
  const filterByRole = (response: any, roles: string[]): Member[] => {
    if (!response?.data) return [];
    return response.data.filter((member: Member) => roles.includes(member.role));
  };

  membersHistoricPresidents.value = filterByRole(membersHistoricResponse.value, ['president']);
  membersHistoricJudges.value = filterByRole(membersHistoricResponse.value, ['judge']);

  membersEmeritusPresidents.value = filterByRole(membersEmeritusResponse.value, ['president']);
  membersEmeritusJudges.value = filterByRole(membersEmeritusResponse.value, ['judge']);
  membersEmeritusOfficeStaffMembers.value = filterByRole(membersEmeritusResponse.value, ['legalSecretaries']);
  membersEmeritusRegistrars.value = filterByRole(membersEmeritusResponse.value, ['registrars']);

  judgeMembers.value = alternateLang(filterByRole(membersResponse.value, ['judge', 'president']));
  officeStaffMembers.value = alternateLang(filterByRole(membersResponse.value, ['legalSecretaries']));
  registrarMembers.value = alternateLang(filterByRole(membersResponse.value, ['registrars']));
};

// watch(locale, (newVal, oldVal) => {
//   console.log('locale changed', newVal, oldVal);
//   updateMembers()
// });

const getInfo = (infos: Infos) => {
  if (!infos) {
    return [];
  }

  return infos[locale.value as keyof Infos];
}

const updateSideBarLinks = () => {

  if (!pageJudge.value || !pageOfficeStaff.value || !pageReferendar.value || !pageClerk.value) {
    sideBarLinks.value = [];
    return;
  }


  const judgeLinks = extractSideBarLinks(pageJudge);
  const referendarLinks = extractSideBarLinks(pageReferendar);
  const clerkLinks = extractSideBarLinks(pageClerk);
  const officeStaffLinks = extractSideBarLinks(pageOfficeStaff);

  // set the first sidebar link as active by default
  updateCurrentActiveContentInToc(judgeLinks[0].id);

  sideBarLinks.value = judgeLinks
    .concat(referendarLinks)
    .concat(clerkLinks)
    .concat(officeStaffLinks)
    .concat([
      {
        id: toSlug(t('court.organization.emeritus-and-honorary-members')),
        text: t('court.organization.emeritus-and-honorary-members'),
      },
      {
        id: toSlug(t('court.organization.previous-incumbents')),
        text: t('court.organization.previous-incumbents'),
      },
    ]);

  setTimeout(() => {
    startIntersectionObserver()
  }, 200)
};

const fetchData = async () => {
  try {
    const results = await fetchMultipleByPaths([
      `${locale.value}/${ContentKeys.presentationOrganizationJudge}`,
      `${locale.value}/${ContentKeys.presentationOrganizationOfficeStaff}`,
      `${locale.value}/${ContentKeys.presentationOrganizationReferendar}`,
      `${locale.value}/${ContentKeys.presentationOrganizationClerk}`,
      `${ContentKeys.presentationOrganizationCurrentMembership}`,
      `${ContentKeys.presentationOrganizationCurrentMembershipEmeritus}`,
      `${ContentKeys.presentationOrganizationCurrentMembershipHistoric}`
    ]);
    [
      pageJudge.value,
      pageOfficeStaff.value,
      pageReferendar.value,
      pageClerk.value,
      membersResponse.value,
      membersEmeritusResponse.value,
      membersHistoricResponse.value
    ] = results;
    console.log('results', results);
    updateMembers();
    updateSideBarLinks();

  } catch (error) {
    console.error('Error fetching content:', error);
  }
};

onMounted(() => {
  fetchData();
});

</script>

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
  ;
}

.gallery {
  padding: 0 16px;
}

.lowImageGallery {
  display: flex;
  justify-content: space-between;
  flex: 1;
}

@media (max-width: 480px) {
  .gallery {
    width: 100%;
    float: none;
  }

  .left-column,
  .right-column {
    clear: both;
    justify-content: center;
  }
}
</style>