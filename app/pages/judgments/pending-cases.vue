<script setup lang="ts">
import { ref } from 'vue'
import img from '@assets/img/banner-judgment.png'
import { ApiUrl, PendingCaseType, EMPTY_VALUE } from '@core/constants'
import type { Decision } from '@core/constants'
import { useLanguage } from '@/composables/useLanguage'

const { t, locale } = useLanguage()

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl

const withArchive = ref(true)

const allPendingCase = 'all'
const caseType = [
  { text: t('general.message.all-pending-cases'), value: allPendingCase },
  { text: t('general.message.questions-referred'), value: PendingCaseType.questionsReferred },
  { text: t('general.message.action-for-cancellation'), value: PendingCaseType.actionForCancellation },
]
const selectedType = ref(caseType[0]?.value)
// we start with no year selected so we can show all pending cases
const selectedYear = ref(null)
const selectedByDistance = ref(false)

const { data: cases, pending, error, refresh } = useAsyncData<Decision[]>(
  () => `pending-cases-${locale.value}`,
  () => $fetch<Decision[]>(`${baseURL}${ApiUrl.pendingCases}?lang=${locale.value}&withArchive=${withArchive.value}`),
)

const { data: pressJudgmentsRaw, error: pressJudgmentsError, status: _pressJudgmentsStatus }
  = useFetch<Decision[]>(`${baseURL}${ApiUrl.pressJudgment}?lang=${locale.value}`)

const pressJudgments = computed(() => {
  return pressJudgmentsRaw.value?.map(({ id, distance, dateLong }) => {
    return {
      id,
      distance,
      dateLong,
    }
  }) || []
})

if (pressJudgmentsError.value) {
  console.error(pressJudgmentsError.value)
}
const isSubscribable = (id: number) => {
  const found = pressJudgments.value?.find(j => j.id === id)
  if (found === undefined) {
    return true
  }
  if (found !== undefined) {
    return found.distance > 30
  }
}
const _findDateLongInPressJudgments = (id: number) => {
  const found = pressJudgments.value?.find(j => j.id === id)
  return found?.dateLong
}

const hasUpcomingJudgment = (id: number) => {
  return Array.isArray(pressJudgments.value) && pressJudgments.value.find(j => j.id === id) !== undefined
}

const pendingCasesFilteredByType = computed(() => {
  if (selectedType.value === allPendingCase) {
    return cases.value
  }
  return cases.value?.filter(c => c.type === selectedType.value)
})
const pendingCasesFilteredByTypeAndYear = computed(() => {
  if (selectedYear.value !== null) {
    return pendingCasesFilteredByType.value?.filter(c => c.dateReceived?.split('-')[2] === selectedYear.value)
  }
  if (selectedByDistance.value) {
    return pendingCasesFilteredByType.value?.filter(c => hasUpcomingJudgment(c.id))
  }
  return pendingCasesFilteredByType.value
})

const hasPendingCases = computed(() => (pendingCasesFilteredByType.value?.length ?? 0) > 0)
const emptyValue = EMPTY_VALUE

const yearsInPendingCases = computed(() => {
  const casesPerYear = new Map<string, number>()
  cases.value?.forEach((c) => {
    const dateReceived = c.dateReceived
    if (dateReceived) {
      const year = dateReceived.split('-')[2] || ''
      if (selectedType.value === allPendingCase || c.type === selectedType.value) {
        casesPerYear.set(year, (casesPerYear.get(year) ?? 0) + 1)
      }
    }
  })
  return casesPerYear
})

const yearsInPendingCasesArray = computed(() => {
  return Array.from(yearsInPendingCases.value.entries()).map(([year, count]) => ({ year, count })).sort((a, b) => Number(b.year) - Number(a.year))
})

const filterLoading = ref(false)
const showSkeleton = computed(() => filterLoading.value || pending.value)

watch([selectedType, selectedYear], () => {
  filterLoading.value = true
  setTimeout(() => {
    filterLoading.value = false
  }, 300)
})
</script>

<template>
  <div>
    <BannerImage
      :title="t('menu.decisions.pending-cases', 2)"
      :description="t('menu.decisions.pending-cases-title-description')"
      :image="img"
      :alt="t('alt.banner.courtroom')"
    />

    <v-container fluid>
      <v-row>
        <v-col
          cols="12"
          md="3"
        >
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="selectedType"
                :items="caseType"
                item-title="text"
                item-value="value"
                variant="outlined"
                :label="`${t('general.message.type')}${t('general.message.colon')}`"
                @update:model-value="selectedYear = null"
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="selectedYear"
                :items="yearsInPendingCasesArray"
                :item-title="item => item.year ? `${item.year} (${item.count})` : `${t('general.message.unknown-year')} (${item.count})`"
                item-value="year"
                variant="outlined"
                :label="t('general.message.year-selection')"
                @click="selectedByDistance = false"
              />
            </v-col>
            <v-col cols="12">
              <v-checkbox
                v-model="selectedByDistance"
                label="Show only cases with upcoming judgment"
                @click="selectedYear = null"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col
          v-if="showSkeleton"
          cols="12"
          md="9"
        >
          <v-skeleton-loader type="list-item-two-line" />
        </v-col>
        <v-col
          v-else-if="error"
          cols="12"
          md="9"
        >
          <v-alert
            type="error"
            dismissible
          >
            <v-row>
              <v-col>
                <p>Error: {{ error.message }}</p>
              </v-col>
              <v-col class="d-flex justify-end">
                <v-btn
                  color="primary"
                  @click="refresh"
                >
                  Retry
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-col>
        <v-col
          v-else-if="hasPendingCases"
          cols="12"
          md="9"
        >
          <v-card
            v-for="{
              id,
              processingLanguage,
              dateReceived,
              dateOfHearing,
              dateDelivered,
              description,
              linkedCaseNumber,
              dateArt74,
              joinedCases,
              keywords,
            } in pendingCasesFilteredByTypeAndYear"
            :id="`pending-cases-card-${id}`"
            :key="id"
            outlined
            class="mx-auto mb-3"
          >
            <v-list-item>
              <v-row>
                <v-col cols="9">
                  <h3>
                    {{ t('general.message.roll-number') }}: {{ id }} ({{
                      processingLanguage
                    }})
                  </h3>
                </v-col>
                <v-col
                  cols="3"
                  class="d-flex justify-end"
                >
                  <div v-if="!isSubscribable(id)">
                    <v-chip
                      color="var(--logo-color)"
                      class="mr-2"
                    >
                      {{ t('general.message.judgment-deliveries') }}
                    </v-chip>
                  </div>
                  <v-btn v-else>
                    {{ t('newsletter.rol.subscribe') }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  {{ t('general.message.receipt-date') }}
                </v-col>
                <v-col cols="8">
                  {{ dateReceived || emptyValue }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  {{ t('general.message.date-of-hearing', 2) }}
                </v-col>
                <v-col cols="8">
                  {{ dateOfHearing || emptyValue }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  {{ t('general.message.date-of-judgment') }}
                </v-col>
                <v-col cols="8">
                  {{ dateDelivered || emptyValue }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  {{ t('general.message.concerning') }}
                </v-col>
                <!-- eslint-disable vue/no-v-html -->
                <v-col cols="8">
                  <p v-html="description || emptyValue" />
                </v-col>
              </v-row>
              <v-row v-if="linkedCaseNumber">
                <v-col cols="12">
                  <span>{{ t('general.message.case-joined-with-case-numbers') }}

                    <a
                      :href="`#pending-cases-card-${linkedCaseNumber}`"
                      :aria-label="`Link to pending case card ${linkedCaseNumber}`"
                    >
                      <span class="link">{{ linkedCaseNumber }}</span>
                    </a>
                  </span>
                </v-col>
              </v-row>
              <v-row v-if="dateArt74">
                <v-col cols="12">
                  <!-- eslint-disable vue/no-v-html -->
                  <span
                    v-html="t('general.message.notification-art74-be-official-journal')
                      .replace('Moniteur belge', '<i>Moniteur belge</i>')
                      .replace('Belgisch Staatsblad', '<i>Belgisch Staatsblad</i>') + ': '"
                  />
                  {{ dateArt74 || emptyValue }}
                </v-col>
              </v-row>
              <v-row v-if="joinedCases && joinedCases.length > 0">
                <v-col cols="12">
                  <span>
                    {{ t('general.message.joined-case', joinedCases.length) + ': ' }}
                    <a
                      v-for="caseNumber of joinedCases"
                      :key="caseNumber"
                      :href="`#pending-cases-card-${caseNumber}`"
                      class="mr-3"
                    >
                      {{ caseNumber }}</a>
                  </span>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  md="2"
                  class="mt-2"
                >
                  {{ t('general.message.keywords', 2) }}
                </v-col>
                <v-col
                  cols="12"
                  md="10"
                >
                  <div class="elevation-2 my-2 subtitle border pa-2">
                    {{ keywords || t('error.no-data-available') }}
                  </div>
                </v-col>
              </v-row>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
