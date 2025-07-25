<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import img from '@assets/img/banner-judgment.png'
import { ApiUrl, PendingCaseType, EMPTY_VALUE } from '@core/constants'
import type { Decision } from '@core/constants'
import { useLanguage } from '@/composables/useLanguage'

const { t, locale } = useLanguage()

const withArchive = ref(true)

const allPendingCase = 'all'

const selectedYear = ref(null)
const selectedByDistance = ref(false)

const { data: casesRaw, pending, error, refresh } = useAsyncData<Decision[]>(
  () => `pending-cases-${locale.value}`,
  () => $fetch<Decision[]>(`${ApiUrl.pendingCases}?lang=${locale.value}&withArchive=${withArchive.value}`),
)

const casesWithYear = computed(() => {
  return casesRaw.value?.map((c) => {
    const year = c.dateReceived?.split('-')[2] || ''
    return {
      ...c,
      yearReceived: year,
    }
  }) || []
})

const counts = computed(() => {
  const result = { actionForCancellation: 0, questionsReferred: 0 }
  for (const curr of casesWithYear.value) {
    if (curr.type === PendingCaseType.actionForCancellation) {
      result.actionForCancellation++
    }
    else if (curr.type === PendingCaseType.questionsReferred) {
      result.questionsReferred++
    }
  }
  return result
})

const caseTypeAndCounts = computed(() => {
  const total = counts.value.actionForCancellation + counts.value.questionsReferred
  return [
    {
      text: t('general.message.all-pending-cases')
        + (total > 0 ? ` (${total})` : ''),
      value: allPendingCase,
    },
    {
      text: t('general.message.questions-referred')
        + (counts.value.questionsReferred > 0 ? ` (${counts.value.questionsReferred})` : ''),
      value: PendingCaseType.questionsReferred,
    },
    {
      text: t('general.message.action-for-cancellation')
        + (counts.value.actionForCancellation > 0 ? ` (${counts.value.actionForCancellation})` : ''),
      value: PendingCaseType.actionForCancellation,
    },
  ]
})
const selectedType = ref(caseTypeAndCounts.value[0]?.value)
const { data: pressJudgmentsRaw, error: pressJudgmentsError, status: _pressJudgmentsStatus }
  = useFetch<Decision[]>(`${ApiUrl.pressJudgment}?lang=${locale.value}`)

const pressJudgmentsMap = computed(() => {
  const pressJudgmentsMapInternal = new Map<number, { distance: number, dateLong: string }>()
  pressJudgmentsRaw.value?.forEach(({ id, distance, dateLong }) => {
    pressJudgmentsMapInternal.set(id, { distance, dateLong })
  })
  return pressJudgmentsMapInternal
})

if (pressJudgmentsError.value) {
  console.error(pressJudgmentsError.value)
}
const isSubscribable = (id: number) => {
  const j = pressJudgmentsMap.value.get(id)
  return j ? j.distance > 30 : true
}

const _findDateLongInPressJudgments = (id: number) => {
  return pressJudgmentsMap.value.get(id)?.dateLong
}

const hasUpcomingJudgment = (id: number) => {
  return pressJudgmentsMap.value.has(id)
}

const pendingCasesFiltered = computed(() => {
  if (!Array.isArray(casesWithYear.value)) {
    return []
  }

  // this will filter out cases on different criteria
  // 1) by “type” (all, questions referred, action for cancellation)
  // 2) by “year” (all years, or a specific year)
  // 3) by “distance” toggle (show only cases with upcoming judgments)
  return casesWithYear.value.filter((c) => {
    if (selectedType.value !== allPendingCase && c.type !== selectedType.value) {
      return false
    }
    if (selectedYear.value !== null && c.yearReceived !== selectedYear.value) {
      return false
    }
    if (selectedByDistance.value && !hasUpcomingJudgment(c.id)) {
      return false
    }

    return true
  })
})

const hasPendingCases = computed(() => pendingCasesFiltered.value.length > 0)
const _emptyValue = EMPTY_VALUE

const yearsInPendingCasesByType = computed(() => {
  // Only run when casesWithYear or selectedType changes
  const counts = new Map<string, number>()
  for (const c of casesWithYear.value) {
    if (selectedType.value === allPendingCase || c.type === selectedType.value) {
      const y = c.yearReceived || ''
      counts.set(y, (counts.get(y) ?? 0) + 1)
    }
  }
  return counts
})

const yearsInPendingCasesArray = computed(() => {
  const arr = Array.from(yearsInPendingCasesByType.value.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => Number(b.year) - Number(a.year))

  const totalCount = arr.reduce((sum, obj) => sum + obj.count, 0)
  return [{ year: null, count: totalCount }, ...arr]
})

const filterLoading = ref(false)
const showSkeleton = computed(() => filterLoading.value || pending.value)

// this loading time is just for the sake of UX:
// to make it clear to the user that the filters are being applied
watch([selectedType, selectedYear, selectedByDistance], () => {
  filterLoading.value = true
  setTimeout(() => {
    filterLoading.value = false
  }, 300)
})

function yearItemTitle(item: { year: string | null, count: number }) {
  if (item.year === null) {
    return `${t('general.message.all-years')} `
  }
  if (item.year) {
    return `${item.year} (${item.count})`
  }
  return `${t('general.message.unknown-year')} (${item.count})`
}
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
            <!-- TYPE SELECT -->
            <v-col cols="12">
              <v-select
                v-model="selectedType"
                :items="caseTypeAndCounts"
                item-title="text"
                item-value="value"
                variant="outlined"
                :label="`${t('general.message.type')}${t('general.message.colon')}`"
                @update:model-value="selectedYear = null"
              />
            </v-col>
            <!-- YEAR SELECT -->
            <v-col cols="12">
              <v-select
                v-model="selectedYear"
                :items="yearsInPendingCasesArray"
                :item-title="yearItemTitle"
                item-value="year"
                :label="t('general.message.year-selection')"
                @click="selectedByDistance = false"
              />
            </v-col>
            <!-- UPCOMING JUDGMENT CHECKBOX -->
            <v-col cols="12">
              <v-checkbox
                v-model="selectedByDistance"
                :label="`${t('menu.decisions.cases.show-only-upcoming-judgments')}`"
                @click="selectedYear = null"
              />
            </v-col>
            <!-- RESET BUTTON -->
            <v-col>
              <v-btn
                color="secondary"
                @click="() => {
                  selectedType = caseTypeAndCounts[0]?.value;
                  selectedYear = null;
                  selectedByDistance = false
                }"
              >
                {{ t('menu.decisions.cases.reset-filters') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <!-- SKELETON -->
        <v-col
          v-if="showSkeleton"
          cols="12"
          md="9"
        >
          <v-skeleton-loader type="list-item-two-line" />
        </v-col>
        <!-- ERROR -->
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

        <!-- LIST OF PENDING CASE CARDS -->
        <v-col
          v-else-if="hasPendingCases"
          cols="12"
          md="9"
        >
          <PendingCard
            v-for="caseItem in pendingCasesFiltered"
            :key="caseItem.id"
            :case-item="caseItem"
            :is-subscribable="isSubscribable"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss">
h1 {
  font-family: 'Tiempos Headline', serif;
  font-size: 2rem;
  color: var(--v-theme-primary);
  margin-bottom: 1rem;
}
</style>
