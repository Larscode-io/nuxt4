<script setup lang="ts">
import { ref, computed } from 'vue'
import img from '~/assets/img/banner-media.png'
import { ApiUrl } from '~/core/constants'
import { useLanguage } from '@/composables/useLanguage'

const { t, locale } = useLanguage()

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl

interface LegalCase {
  id: number
  description: string
  availablePart: string
  courtVerdict: string
  fileName: string
  filePath: string
  formatedJudmentDate: string
  idsRole: number[]
  judmentDate: string
  keywords: string
  nr: string
  path: string
  summary: string | null
}

// during development, if the apiBaseUrl is not set in .env, the legacy server URL node04 will be used (nuxt.config.ts).
// const { data: pleadings, error, status, refresh } = useLazyFetch<LegalCase[]>(`${baseURL}${ApiUrl.pressPleadings}?lang=${locale.value}`)
// const { data: judgments } = useLazyFetch<LegalCase[]>(`${baseURL}${ApiUrl.pressJudgment}?lang=${locale.value}`)

const { data, error, status, refresh } = useAsyncData(() => {
  return Promise.all([
    $fetch(`${baseURL}${ApiUrl.pressPleadings}?lang=${locale.value}`),
    $fetch(`${baseURL}${ApiUrl.pressJudgment}?lang=${locale.value}`),
  ])
})

const pleadings = computed(() => data.value[0])
const judgments = computed(() => data.value[1])
</script>

<template>
  <div>
    <BannerImage
      :title="t('menu.agenda.title', 2)"
      :description="t('menu.agenda.upcoming-decisions-title-description')"
      :image="img"
      :alt="t('alt.banner.chest')"
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
      <div v-else>
        <v-row
          v-for="{ id, availablePart, nr, description } in pleadings"
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
                <v-list-item-content>
                  <div class=" mb-3">
                    <v-icon color="rgb(var(--v-theme-pdfRed))">
                      mdi-file-pdf-box
                    </v-icon>

                    <h3> {{ nr }} </h3>
                    <h3> {{ availablePart }} </h3>
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
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
        <v-row
          v-for="{ id, availablePart, nr, description } in judgments"
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
                <v-list-item-content>
                  <div class=" mb-3">
                    <v-icon color="rgb(var(--v-theme-pdfRed))">
                      mdi-file-pdf-box
                    </v-icon>

                    <h3> {{ nr }} </h3>
                    <h3> {{ availablePart }} </h3>
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
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>
