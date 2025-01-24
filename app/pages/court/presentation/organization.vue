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
              <MemberCard :headlineLevel="2" :name="member.name" :slug="member.slug"
                :image="member.picture || 'https://via.placeholder.com/150'" :withImage="true"
                :infos="getInfo(member.infos)" :jobTitle="member.role" :width="300" :isAlive="member.isAlive"
                :lang="member.lang" />
            </div>

            <article v-if="pageReferendar">
              <ContentRendererMarkdown :value="pageReferendar.body" class="nuxt-content" />
            </article>

            <div v-for="(member, index) in officeStaffMembers" :key="index" class="gallery"
              :class="{ 'left-column': index % 2 === 0, 'right-column': index % 2 !== 0 }">
              <MemberCard :headlineLevel="2" :name="member.name" :slug="member.slug"
                :image="member.picture || 'https://via.placeholder.com/150'" :withImage="true"
                :infos="getInfo(member.infos)" :jobTitle="member.role" :width="300" :isAlive="member.isAlive"
                :lang="member.lang" />
            </div>

            <article v-if="pageClerk">
              <ContentRendererMarkdown :value="pageClerk.body" class="nuxt-content" />
            </article>

            <div v-for="(member, index) in officeStaffMembers" :key="index" class="gallery"
              :class="{ 'left-column': index % 2 === 0, 'right-column': index % 2 !== 0 }">
              <MemberCard :headlineLevel="2" :name="member.name" :slug="member.slug"
                :image="member.picture || 'https://via.placeholder.com/150'" :withImage="true"
                :infos="getInfo(member.infos)" :jobTitle="member.role" :width="300" :isAlive="member.isAlive"
                :lang="member.lang" />
            </div>

            <article v-if="pageOfficeStaff">
              <ContentRendererMarkdown :value="pageOfficeStaff.body" class="nuxt-content" />
            </article>
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
const membersEmeritus = ref([]);
const membersHistoric = ref([]);
const sideBarLinks = ref([]);
// These include all roles that should be displayed in the "judges" section
const judgeMembers = ref<Member[]>([]);
const officeStaffMembers = ref<Member[]>([]);


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

const updateMembersByGroup = () => {
  judgeMembers.value = membersResponse.value ? membersResponse.value.data.filter((member: any) => member.role === 'judge' || member.role === 'president') : [];
  officeStaffMembers.value = membersResponse.value ? membersResponse.value.data.filter((member: any) => member.role === 'legalSecretaries') : [];
  pageReferendar.value = membersResponse.value ? membersResponse.value.data.filter((member: any) => member.role === 'legalSecretaries') : [];

};

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
      membersEmeritus.value,
      membersHistoric.value
    ] = results;

    updateMembersByGroup();
    console.log('membersResponse: ', membersResponse.value)
    updateSideBarLinks();

  } catch (error) {
    console.error('Error fetching content:', error);
  }
};



onMounted(() => {
  fetchData();
  // updateCurrentActiveContentInToc(elem.id);
  // startIntersectionObserver()
});

</script>

<style scoped>
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

.gallery {
  padding: 0 16px;
}
</style>