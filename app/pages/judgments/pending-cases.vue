<script setup lang="ts">
import { ref } from 'vue'
import img from '~/assets/img/banner-media.png'
import { ApiUrl, PendingCaseType, EMPTY_VALUE } from '~/core/constants'
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

const pendingCasesFilteredByType = computed(() => {
  if (selectedType.value === allPendingCase) {
    return cases.value
  }
  return cases.value?.filter(c => c.type === selectedType.value)
})
const hasPendingCases = computed(() => (pendingCasesFilteredByType.value?.length ?? 0) > 0)
const emptyValue = EMPTY_VALUE
</script>

<template>
  <div>
    <BannerImage
      :title="t('menu.decisions.pending-cases', 2)"
      :description="t('menu.decisions.pending-cases-title-description')"
      :image="img"
      :alt="t('alt.banner.courtroom')"
    />
    <div v-if="status === 'pending'">
      <v-row>
        <v-col>
          <v-skeleton-loader
            v-for="n in 10"
            :key="n"
            type="list-item-two-line"
          />
        </v-col>
      </v-row>
    </div>
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
    <v-container
      v-else
      fluid
    >
      <v-row v-if="hasPendingCases">
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="selectedType"
            :items="caseType"
            item-title="text"
            item-value="value"
            :label="`${t('general.message.type')}${t('general.message.colon')}`"
          />
        </v-col>
        <v-col
          cols="12"
          md="9"
        >
          <v-card
            v-for="{ id, processingLanguage, dateReceived, dateOfHearing, dateDelivered, linkedCaseNumber, joinedCases, keywords, description, art74Link, dateArt74 } in pendingCasesFilteredByType"
            :key="id"
            outlined
            class="mx-auto mb-3 blue-text"
          >
            <v-list-item>
              <div>
                <h3>
                  {{ t('general.message.roll-number') }}: {{ id }} ({{
                    processingLanguage
                  }})
                </h3>
              </div>
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

                    <a :href="`#pending-cases-card-${linkedCaseNumber}`">
                      {{ linkedCaseNumber }}
                    </a>
                  </span>
                </v-col>
              </v-row>
              <v-row v-if="art74Link && dateArt74">
                <v-col cols="12">
                  <span
                    v-html="t('general.message.notification-art74-be-official-journal')
                      .replace('Moniteur belge', '<i>Moniteur belge</i>')
                      .replace('Belgisch Staatsblad', '<i>Belgisch Staatsblad</i>') + ': '"
                  />
                  <a :href="art74Link"> {{ dateArt74 || emptyValue }} </a>
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
        </v-col>
      </v-row>
      <div v-else>
        <v-alert
          type="info"
          dismissible
        >
          <p>{{ t('general.message.no-pending-cases') }}</p>
        </v-alert>
      </div>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.blue-text {
  color: primary
}
</style>
