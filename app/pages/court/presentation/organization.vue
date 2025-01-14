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
            <article v-if="pageReferendar">
              <ContentRendererMarkdown :value="pageReferendar.body" class="nuxt-content" />
            </article>
            <article v-if="pageClerk">
              <ContentRendererMarkdown :value="pageClerk.body" class="nuxt-content" />
            </article>
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
import { useRoute } from 'vue-router';
import { ContentKeys } from '~/core/constants';
import { useLanguage } from '@/composables/useLanguage';
import img from '~/assets/img/organisation.png';
import { extractSideBarLinks } from '~/utils/contentUtils';
import { fetchMultipleByPaths } from '~/utils/requestUtils';
import '~/assets/css/content.css';

const { t, locale } = useLanguage();

interface PageContent {
  body: {
    toc: {
      links: any;
    };
  };
}

const currentActiveContentInToc = ref('');
const pageJudge: Ref<PageContent | null> = ref(null);
const pageOfficeStaff: Ref<PageContent | null> = ref(null);
const pageReferendar: Ref<PageContent | null> = ref(null);
const pageClerk: Ref<PageContent | null> = ref(null);
const members = ref([]);
const membersEmeritus = ref([]);
const membersHistoric = ref([]);
const sideBarLinks = ref([]);

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

const updateSideBarLinks = () => {

  if (!pageJudge.value || !pageOfficeStaff.value || !pageReferendar.value || !pageClerk.value) {
    sideBarLinks.value = [];
    return;
  }


  const judgeLinks = extractSideBarLinks(pageJudge);
  const referendarLinks = extractSideBarLinks(pageReferendar);
  const clerkLinks = extractSideBarLinks(pageClerk);
  const officeStaffLinks = extractSideBarLinks(pageOfficeStaff);

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
      members.value,
      membersEmeritus.value,
      membersHistoric.value
    ] = results;
    console.log('results: ', results)
    updateSideBarLinks();

  } catch (error) {
    console.error('Error fetching content:', error);
  }
};

onMounted(() => {
  fetchData();
  // startIntersectionObserver()
});

</script>
