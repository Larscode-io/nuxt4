<script setup lang="ts">
import { ref } from 'vue'
import img from '~/assets/img/banner-media.png'
import { ApiUrl, PendingCaseType } from '~/core/constants'
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
      <div v-else-if="hasPendingCases">
        <v-row />
        <v-row>
          <v-col>
            <v-select
              v-model="selectedType"
              :items="caseType"
              item-title="text"
              item-value="value"
              label="Select Type"
            />
          </v-col>
        </v-row>
        <v-row
          v-for="{ id, description, processingLanguage } in pendingCasesFilteredByType"
          :key="id"
          class="justify-center"
        >
          <v-col
            cols="12"
            md="6"
          >
            <v-card
              :id="id"
              class="mx-auto mb-3"
              outlined
            >
              <v-list-item>
                <div class=" mb-3">
                  <v-icon color="rgb(var(--v-theme-pdfRed))">
                    mdi-file-pdf-box
                  </v-icon>

                  <h3>
                    {{ t('general.message.roll-number') }}: {{ id }} ({{
                      processingLanguage
                    }})
                  </h3>
                </div>
                <v-list-item-title class="headline mb-1">
                  {{
                    description
                  }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    description
                  }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </div>
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
