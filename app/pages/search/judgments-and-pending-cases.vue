<template>
  <v-container fluid class="fill-height pa-0 d-block">
    <BannerImage :title="t('menu.search.title')" :description="t('menu.search.title-description')" :image="img" />
    <v-row v-if="fetchState.pending" class="d-flex" align="flex-start" justify="center">
      <v-col cols="12" md="12">
        <v-skeleton-loader class="mx-auto" max-width="300" type="article" />
      </v-col>
    </v-row>
    <v-row v-else-if="fetchState.error" class="d-flex" align="flex-start" justify="center">
      <v-col cols="12" md="12">
        <ErrorCard :message="t('error.fetchingData')" :show-go-home="false" />
      </v-col>
    </v-row>
    <v-row v-else class="d-flex">
      <v-col cols="12" md="4" class="mt-4">
        <SearchTabs active-tab="general.message.keywords-judgments-pending-cases" />
      </v-col>

      <v-col cols="12" md="8" class="mt-6">
        <client-only :placeholder="t('general.loading')">
          <form @submit.prevent="submit">
            <v-text-field v-model="payload.search" :label="t('general.message.search-label')" required />
            <div>
              <v-checkbox v-for="choice in choices" :key="choice.id" v-model="payload.choices" class="p-0" color="primary"
                :label="choice.label" :value="choice.id" />
            </div>
            <v-btn type="submit" class="mr-4 mt-6 submit-button" :loading="loading" :aria-label="t('aria.label.submit')">
              {{ t('general.submit') }}
            </v-btn>
            <v-btn v-if="hasJudgments || hasPendingCases" class="mr-4 mt-6" :aria-label="t('aria.label.print')"
              @click.prevent="print()">
              <v-icon left>
                mdi-printer
              </v-icon>
              <p class="ml-2">{{ t('general.message.print-list') }}</p>
            </v-btn>
          </form>
        </client-only>

        <v-tabs v-if="hasJudgments || hasPendingCases" ref="list" v-model="selectedTab" :vertical="false"
          class="my-6 mb-8">
          <v-tab v-if="hasPendingCases" value="tab1" href="#tab1">
            {{ t('general.message.pending-case') }}
          </v-tab>
          <v-tab v-if="hasJudgments" value="tab2" href="#tab2">
            {{ t('general.message.judgment') }}
          </v-tab>
        </v-tabs>
        <v-tabs-window v-model="selectedTab">
          <v-tabs-window-item :hidden="!hasPendingCases" value="tab1">
            <v-col cols="12" class="print-content" id="print-tab1">
              <PendingCaseCard v-for="pendingCase in searchPendingCasesData" :id="pendingCase.id" :key="pendingCase.id"
                :processing-language="pendingCase.processingLanguage" :receipt-date="pendingCase.dateReceived"
                :date-of-hearing="pendingCase.dateOfHearing" :date-of-judgment="pendingCase.dateDelivered"
                :concerning="pendingCase.description"
                :notice-from-const-court-path="pendingCase.noticeOfTheConstitutionalCourtLink"
                :notification-art74-to-official-journal-link="pendingCase.art74Link"
                :notification-art74-to-official-journal-date="pendingCase.dateArt74"
                :joined-cases="pendingCase.joinedCases" :keywords="pendingCase.keywords"
                :linked-case-number="pendingCase.linkedCaseNumber" />
            </v-col>
          </v-tabs-window-item>
          <v-tabs-window-item :hidden="!hasJudgments" value="tab2">
            <v-col cols="12" class="print-content" id="print-tab2">
              <JudgmentCard v-for="judgment in searchJudgmentsData" :id="judgment.id" :key="judgment.id"
                :ids-role="judgment.idsRole" :reference="judgment.nr" :date="judgment.formatedJudmentDate"
                :title="judgment.courtVerdict || ''" :description="judgment.description" :state="judgment.availablePart"
                :keywords="judgment.keywords" :pdf-url="judgment.filePath" :summary="judgment.summary" />
            </v-col>
          </v-tabs-window-item>
        </v-tabs-window>
        <v-col v-if="(loaded && !hasJudgments && !hasPendingCases) || fetchState.error" cols="12">
          <EmptyComponent />
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ApiUrl } from '../../core/constants'
import { to } from '../../core/utilities'
import PendingCaseCard from '../../components/PendingCaseCard.vue'
import JudgmentCard from '../../components/JudgmentCard.vue'
import EmptyComponent from '../../components/EmptyComponent.vue'
import BannerImage from '../../components/BannerImage.vue'
import ErrorCard from '../../components/ErrorCard.vue'
import SearchTabs from '../../components/SearchTabs.vue'
import img from '~/assets/img/banner-text.png'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

const payload = reactive({
  search: '',
  judgmentDates: [] as string[],
  choices: [
    'general.message.pending-case',
    'general.message.judgment',
  ],
})
const loading = ref(false)
const loaded = ref(false)
const selectedTab = ref(null)
const searchError = ref(null)
const searchPendingCasesResponse = ref<any[]>([])
const searchJudgmentsResponse = ref<any[]>([])
const searchPendingCasesData = computed(() => searchPendingCasesResponse.value?.value)
const searchJudgmentsData = computed(() => searchJudgmentsResponse.value?.value)

const fetchState = reactive({
  pending: false,
  error: false,
})

const choices = ref([
  {
    id: 'general.message.pending-case',
    label: t('general.message.pending-case', 2),
  },
  {
    id: 'general.message.judgment',
    label: t('general.message.judgment', 2),
  },
])

useHead({
  title: t('menu.search.title') || t('general.message.constsCourt'),
  meta: [
    {
      name: 'description',
      content: t('menu.search.title') || '',
    },
  ],
})

const hasPendingCases = computed(() => {
  return searchPendingCasesResponse.value?.value?.length > 0
})
const hasJudgments = computed(() => searchJudgmentsResponse.value?.value?.length > 0)

watch(
  () => route.query.term,
  (term) => {
    if (term) {
      payload.search = term as string
      router.push({ hash: '' })
    }
  },
  { immediate: true },
)

function formatDate(date = ''): string {
  if (!date) return ''
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

async function submit() {
  if (!payload.search) return

  loading.value = true
  loaded.value = false
  searchError.value = null

  const judgmentRequest = payload.choices.includes('general.message.judgment')
    ? cPost(`${ApiUrl.searchJudgments}?lang=${locale.value}`, payload)
    : Promise.resolve([])

  const pendingCaseRequest = payload.choices.includes('general.message.pending-case')
    ? cPost(`${ApiUrl.searchPendingCases}?lang=${locale.value}`, payload)
    : Promise.resolve([])

  const [error, response] = await to(Promise.all([pendingCaseRequest, judgmentRequest]))
  loading.value = false

  if (error || !response) {
    searchError.value = error || new Error('Error in judgments-and-pending-cases')
    return
  }
  loaded.value = true

  searchPendingCasesResponse.value = response[0]?.data
  searchJudgmentsResponse.value = response[1]?.data
}

function print() {
  const activeTabId = selectedTab.value === 'tab1' ? 'tab1' : 'tab2';
  const title = activeTabId === 'tab1'
    ? t('general.message.pending-case', 2)
    : t('general.message.judgment', 2);

  const printContent = document.getElementById(`print-${activeTabId}`);

  if (!printContent) {
    console.error('Print content niet gevonden');
    return;
  }

  // Creëer een onzichtbare iframe om de print-inhoud te isoleren
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';

  document.body.appendChild(iframe);

  // Haal alle stylesheets op om toe te passen op de iframe
  const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
  let stylesHtml = '';

  styles.forEach(style => {
    if (style.tagName === 'LINK') {
      stylesHtml += `<link rel="stylesheet" href="${style.getAttribute('href')}" />`;
    } else {
      stylesHtml += style.outerHTML;
    }
  });

  // Schrijf de inhoud naar de iframe
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      ${stylesHtml}
      <style>
        body { 
          font-family: sans-serif; 
          padding: 20px; 
        }
        h1 { 
          margin-bottom: 20px; 
        }
        .v-card {
          margin-bottom: 16px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          background-color: white;
          padding: 16px;
        }
        .v-card__title {
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 8px;
        }
        .v-card__text {
          color: #333;
        }
        .v-card__actions {
          margin-top: 12px;
          padding-top: 8px;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div>
        ${printContent.innerHTML}
      </div>
    </body>
    </html>
  `);
  iframeDoc.close();

  // Wacht tot iframe volledig geladen is
  iframe.onload = function () {
    try {
      // Print de iframe
      iframe.contentWindow.print();

      // Verwijder de iframe na een vertraging
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 1000);
    } catch (e) {
      console.error('Print error:', e);
      document.body.removeChild(iframe);
    }
  };
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 !important;

  @include mobile {
    padding: 32px;
  }
}

.d-flex {
  max-width: 1260px !important;
  width: 100%;
  margin: auto;
  margin-bottom: 80px;

  @include mobile {
    width: 100%;
    margin-bottom: 40px;
  }
}

.nuxt-content {
  padding-top: 32px;
}

.submit-button {
  background: $indigo !important;
  color: white;
}

.d-flex .v-input__slot {
  box-shadow: none !important;
}

@media print {
  .no-print {
    display: none !important;
  }

  .print-content {
    display: block !important;
  }
}
</style>