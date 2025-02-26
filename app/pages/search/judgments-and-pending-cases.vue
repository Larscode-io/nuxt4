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
        <v-tabs v-model="activeTab" color="primary" direction="vertical" class="vertical-tabs" background-color="white"
          grow>
          <v-tab v-for="tab in tabs" :key="tab.id" :value="tab.id" :to="tab.to" nuxt style="text-transform: none">
            {{ tab.label }}
          </v-tab>
        </v-tabs>
      </v-col>

      <v-col cols="12" md="8">
        <client-only :placeholder="t('general.message.loading')">
          <form @submit.prevent="submit">
            <v-text-field v-model="payload.search" :label="t('general.message.search-label')" required />
            <div>
              <v-checkbox color="primary" v-for="choice in choices" :key="choice.id" v-model="payload.choices"
                :label="choice.label" :value="choice.id" />
            </div>
            <v-btn type="submit" class="mr-4 submit-button" :loading="loading" :aria-label="t('aria.label.submit')">
              {{ t('general.submit') }}
            </v-btn>
            <v-btn v-if="hasJudgments || hasPendingCases" class="mr-4" :aria-label="t('aria.label.print')"
              @click.prevent="print('list')">
              <v-icon left>
                mdi-printer
              </v-icon>
              {{ t('general.message.printList') }}
            </v-btn>
          </form>
        </client-only>

        <v-tabs v-if="hasJudgments || hasPendingCases" ref="list" v-model="selectedTab" :vertical="false" class="my-6">
          <v-tab v-if="hasPendingCases" href="#tab1">
            {{ t('general.message.pending-case') }}
          </v-tab>
          <v-tab v-if="hasJudgments" href="#tab2">
            {{ t('general.message.judgment') }}
          </v-tab>

          <v-tab-item :hidden="!hasPendingCases" value="tab1">
            <!-- TODO: fix judgementCard -->
            <!-- <v-col cols="12">
              <PendingCaseCard v-for="pendingCase in searchPendingCasesResponse" :key="pendingCase.id"
                :id="pendingCase.id" :processing-language="pendingCase.processingLanguage"
                :receipt-date="pendingCase.dateReceived" :date-of-hearing="pendingCase.dateOfHearing"
                :date-of-judgment="pendingCase.dateDelivered" :concerning="pendingCase.description"
                :notice-from-const-court-path="pendingCase.noticeOfTheConstitutionalCourtLink"
                :notification-art74-to-official-journal-link="pendingCase.art74Link"
                :notification-art74-to-official-journal-date="pendingCase.dateArt74"
                :joined-cases="pendingCase.joinedCases" :keywords="pendingCase.keywords"
                :linked-case-number="pendingCase.linkedCaseNumber" />
            </v-col> -->
          </v-tab-item>
          <v-tab-item :hidden="!hasJudgments" value="tab2">
            <!-- TODO: fix judgementCard -->
            <!-- <v-col cols="12">
              <JudgmentCard v-for="judgment in searchJudgmentsResponse" :key="judgment.id" :id="judgment.id"
                :reference="judgment.nr" :date="judgment.formatedJudmentDate" :title="judgment.courtVerdict || ''"
                :description="judgment.description" :state="judgment.availablePart" :keywords="judgment.keywords"
                :pdf-url="judgment.filePath" :summary="judgment.summary" />
            </v-col> -->
          </v-tab-item>
        </v-tabs>
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
import img from '~/assets/img/banner-text.png'
import { RoutePathKeys } from "../../core/constants";

// i18n setup
const { t } = useI18n()

// Router en route
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

// Payload en state
const payload = reactive({
  search: '',
  judgmentDates: [] as string[],
  choices: [
    'general.message.pending-case',
    'general.message.judgment'
  ],
})
const loading = ref(false)
const loaded = ref(false)
const selectedTab = ref(null)
const searchError = ref(null)
const searchPendingCasesResponse = ref<any[]>([])
const searchJudgmentsResponse = ref<any[]>([])

// Simuleer de fetch-state (hier kun je later useFetch of useAsyncData inzetten)
const fetchState = reactive({
  pending: false,
  error: false,
})

// Keuzes en tabs
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
// --- Tabs & Search Type Options ---
const searchTabs = [
  { id: "general.message.judgment", to: RoutePathKeys.searchJudgment },
  { id: "general.message.standard", to: RoutePathKeys.searchStandard },
  { id: "general.message.systematic-table-contents-label", to: RoutePathKeys.searchTableOfContent },
  { id: "general.message.judgment-keywords-summary", to: RoutePathKeys.searchJudgmentKeywordSummary },
  { id: "general.message.full-text-of-judgments", to: RoutePathKeys.searchFullTextJudgment },
  { id: "general.message.keywords-judgments-pending-cases", to: RoutePathKeys.searchJudgmentsAndPendingCases },
];
const activeTab = ref("general.message.keywords-judgments-pending-cases");

const tabs = searchTabs.map((tab) => ({
  id: tab.id,
  to: localePath(tab.to),
  label: t(tab.id, 2),
}));

// Head metadata
useHead({
  title: t('menu.search.title') || t('general.message.constsCourt'),
  meta: [
    {
      name: 'description',
      content: t('menu.search.title') || '',
    },
  ],
})

// Computed properties
const hasPendingCases = computed(() => searchPendingCasesResponse.value.length > 0)
const hasJudgments = computed(() => searchJudgmentsResponse.value.length > 0)

// Watchers
watch(
  () => route.query.term,
  (term) => {
    if (term) {
      payload.search = term as string
      router.push({ hash: '' })
      // Indien nodig: scroll naar boven
    }
  },
  { immediate: true }
)

// Methoden
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

  // Bepaal welke requests verzonden moeten worden op basis van payload.choices
  const judgmentRequest = payload.choices.includes('general.message.judgment')
    ? $fetch(`${ApiUrl.searchJudgments}?lang=${t('locale')}`, {
      method: 'POST',
      body: payload,
    })
    : Promise.resolve([])
  const pendingCaseRequest = payload.choices.includes('general.message.pending-case')
    ? $fetch(`${ApiUrl.searchPendingCases}?lang=${t('locale')}`, {
      method: 'POST',
      body: payload,
    })
    : Promise.resolve([])

  const [error, response] = await to(Promise.all([pendingCaseRequest, judgmentRequest]))
  loading.value = false

  if (error || !response) {
    searchError.value = error || new Error('Error in judgments-and-pending-cases')
    return
  }
  loaded.value = true
  searchPendingCasesResponse.value = response[0]
  searchJudgmentsResponse.value = response[1]
}
function print(refName: string) {
  // Gebruik een globale printfunctie indien beschikbaar
  // @ts-ignore
  $print(refName)
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

.v-tabs {
  margin-bottom: 32px;
}

button {
  margin-top: 24px;
}

.submit-button {
  background: $indigo !important;
  color: white;
}

.v-input {
  // margin: 32px 0 !important;
}

.d-flex .v-input__slot {
  box-shadow: none !important;
}
</style>
