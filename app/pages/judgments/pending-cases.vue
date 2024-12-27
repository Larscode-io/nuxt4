<script setup lang="ts">
import { ref } from 'vue'
import img from '~/assets/img/banner-judgment.png'
import { ApiUrl, RoutePathKeys, PendingCaseType, EMPTY_VALUE } from '~/core/constants'
import { useLanguage } from '@/composables/useLanguage'

const { t, locale, localePath } = useLanguage()

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

interface LegalCase {
  id: number
  processingLanguage: string
  dateReceived: string
  dateOfHearing: string | null
  dateDelivered: string | null
  description: string
  dateArt74: string | null
  art74Link: string | null
  linkedCaseNumber: number | null
  joinedCases: any[] | null
  keywords: string
  requestForSuspensionOrInterlocutoryJudgment: string | null
  type: string
}

// during development, if the apiBaseUrl is not set in .env, the legacy server URL node04 will be used (nuxt.config.ts).
const { data: cases, error, status, refresh } = useLazyFetch<LegalCase[]>(`${baseURL}${ApiUrl.pendingCases}?lang=${locale.value}&withArchive=${withArchive.value}`)
if (error.value) {
  console.error(error.value)
}

// const isSubscribable = distance === null || distance === undefined || distance > 30

const transform = (items: []) => {
  return items.map(({ id, distance }) => {
    return {
      id,
      distance,
    }
  })
}

const { data: pressJudgments, error: pressJudgmentsError, status: pressJudgmentsStatus }
  = useFetch<LegalCase[]>(`${baseURL}${ApiUrl.pressJudgment}?lang=${locale.value}`, {
    transform,
  })

if (pressJudgmentsError.value) {
  console.error(pressJudgmentsError.value)
}
const isSubscribable = (id: number) => {
  // check if id exists in pressJudgments
  const found = pressJudgments.value?.find(j => j.id === id)
  // found will be undefined or an object
  // if found undefine return true
  if (found === undefined) {
    return true
  }
  if (found !== undefined) {
    return found.distance > 30
  }
}
const findDateLongInPressJudgments = (id: number) => {
  const found = pressJudgments.value?.find(j => j.id === id)
  console.log('found', found)
  return found?.dateLong
}

const hasUpcomingJudgment = (id: number) => {
  return Array.isArray(pressJudgments.value) ? pressJudgments.value.find(j => j.id === id)?.distance !== undefined : false
}

const pendingCasesFilteredByType = computed(() => {
  if (selectedType.value === allPendingCase) {
    return cases.value
  }
  return cases.value?.filter(c => c.type === selectedType.value)
})
const pendingCasesFilteredByTypeAndYear = computed(() => {
  if (selectedYear.value === null) {
    return pendingCasesFilteredByType.value
  }
  return pendingCasesFilteredByType.value?.filter(c => c.dateReceived?.split('-')[2] === selectedYear.value)
})

const hasPendingCases = computed(() => (pendingCasesFilteredByType.value?.length ?? 0) > 0)
const emptyValue = EMPTY_VALUE

const yearsInPendingCases = computed(() => {
  const years = new Set<string>()
  const casesPerYear = new Map<string, number>()
  cases.value?.forEach((c) => {
    const dateReceived = c.dateReceived
    if (dateReceived) {
      const year = dateReceived.split('-')[2]
      if (year) {
        if (selectedType.value === allPendingCase) {
          casesPerYear.set(year, (casesPerYear.get(year) ?? 0) + 1)
        }
        else if (c.type === selectedType.value) {
          casesPerYear.set(year, (casesPerYear.get(year) ?? 0) + 1)
        }
        years.add(year)
      }
      else {
        if (selectedType.value === allPendingCase) {
          casesPerYear.set('', (casesPerYear.get('') ?? 0) + 1)
        }
        else if (c.type === selectedType.value) {
          casesPerYear.set('', (casesPerYear.get('') ?? 0) + 1)
        }
      }
    }
  })
  return casesPerYear
})

const yearsInPendingCasesArray = computed(() => {
  return Array.from(yearsInPendingCases.value.entries()).map(([year, count]) => ({ year, count })).sort((a, b) => Number(b.year) - Number(a.year))
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
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col
          v-if="status === 'pending'"
          cols="12"
          md="9"
        >
          <v-skeleton-loader
            :key="n"
            type="list-item-two-line"
          />
        </v-col>
        <div v-else-if="error">
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
        </div>
        <v-col
          v-else-if="hasPendingCases"
          cols="12"
          md="9"
        >
          <transition-group
            tag="div"
          >
            <v-card
              v-for="{ id, processingLanguage, dateReceived, dateOfHearing, dateDelivered, linkedCaseNumber, joinedCases, keywords, description, dateArt74 } in pendingCasesFilteredByTypeAndYear"
              :id="`pending-cases-card-${id}`"
              :key="id"
              outlined
              class="mx-auto mb-3 blue-text"
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
                    <v-tooltip :text="t('general.message.case.soon')">
                      <template #activator="{ props }">
                        <nuxt-link :to="localePath(RoutePathKeys.agenda)">
                          <v-icon
                            v-if="hasUpcomingJudgment(id)"
                            v-bind="props"
                            class="mt-1"
                            color="logoColor"
                          >
                            mdi-calendar
                          </v-icon>
                        </nuxt-link>
                      </template>
                    </v-tooltip>
                    <v-btn :disabled="!isSubscribable(id)">
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
                  <v-col cols="8">
                    <p>{{ description || emptyValue }}</p>
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
                    <v-banner
                      elevation="3"
                      class="my-2 subtitle"
                    >
                      {{ keywords || t('error.no-data-available') }}
                    </v-banner>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-card>
          </transition-group>
        </v-col>
        <v-col v-else>
          <v-alert
            type="info"
            dismissible
          >
            <p>{{ t('general.message.no-pending-cases') }}</p>
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.blue-text {
  color: primary
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
  {
  opacity: 0;
}
</style>
