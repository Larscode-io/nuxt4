<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import img from '~/assets/img/banner-media.png'
import { ApiUrl } from '~/core/constants'
import { useLanguage } from '@/composables/useLanguage'

import type { GeneralPressJudgment } from '@/core/constants'
import type { Judgment } from '~/core/constants'

const { t, locale } = useLanguage()
const baseURL = useRuntimeConfig().public.apiBaseUrl

const { query } = useRoute()

const OLDEST_YEAR = 1985
const currentYear = new Date().getFullYear()
const year = computed(() => Number(query.year) || new Date().getFullYear())
const years = ref(range(OLDEST_YEAR, currentYear).reverse())

const selected = ref(year.value)

const { data: judgments, error, status, refresh }
  = useFetch<Judgment[]>(() => `${baseURL}${ApiUrl.judgments}`,
    {
      query: {
        lang: locale.value,
        year: selected,
      },
      watch: [selected],
    })
if (error.value) {
  console.error(error.value)
}

const transform = (data: GeneralPressJudgment[]) => {
  return data.filter((release: { nr: string }) => release.nr.split('/')[1] === String(year.value))
}

const { data }
  = useLazyFetch<GeneralPressJudgment[]>(() => `${baseURL}${ApiUrl.pressReleasesConcerningJudgments}`,
    {
      query: {
        lang: locale.value,
        withArchive: true,
      },
      transform,
    })

const findRelease = (rid: number): GeneralPressJudgment | undefined => data.value?.find((release: GeneralPressJudgment) => Number(release.id) === rid)

const judgementItemsRef = ref(new Map<number, ComponentPublicInstance | undefined>())
const setJudgementItemsRef = (id: number, el: ComponentPublicInstance) => {
  judgementItemsRef.value.set(id, el)
}

const menuHeight = inject('menuHeight', ref(70))

const scrollToJudgment = (id: number) => {
  const instance = judgementItemsRef.value.get(id) as ComponentPublicInstance | undefined
  const el = instance?.$el
  if (el) {
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - menuHeight.value - 10,
      behavior: 'smooth',
    })
  }
}

watchEffect(() => {
  if (query.id) {
    scrollToJudgment(Number(query.id))
  }
})
</script>

<template>
  <div>
    <BannerImage
      :title="t('menu.decisions.judgment', 2)"
      :description="t('menu.decisions.title-description')"
      :image="img"
      :alt="t('alt.banner.courtroom')"
    />

    <v-alert
      v-if="error"
      type="error"
      dismissible
    >
      <v-row>
        <v-col>
          <p>Error: {{ error.message }}</p>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-btn @click="refresh">
            Retry
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>
    <v-container
      v-else
      fluid
    >
      <v-row>
        <v-col
          cols="12"
          md="2"
          xl="3"
        >
          <div class="pa-4">
            <v-select
              v-model="selected"
              :items="years"
              item-value="value"
              variant="outlined"
              :label="`${t('general.message.year-selection')}${t('general.message.colon')}`"
            />
          </div>
        </v-col>

        <v-col v-if="status === 'pending'">
          <v-skeleton-loader type="list-item-two-line" />
          <v-skeleton-loader type="list-item-two-line" />
          <v-skeleton-loader type="list-item-two-line" />
        </v-col>

        <v-col
          v-else-if="status === 'success'"
          cols="12"
          md="9"
        >
          <v-card
            v-if="judgments?.length === 0"
            class="pa-4"
          >
            <v-card-text>
              {{ t('error.no-judgment') }}
            </v-card-text>
          </v-card>
          <v-card
            v-for="{ formatedJudmentDate, courtVerdict, nr, description, availablePart, idsRole, keywords, id: idx } in judgments"
            v-else
            :id="`judgment-card-${idx}`"
            :key="idx"
            :ref="(el) => el && setJudgementItemsRef(idx, el as ComponentPublicInstance)"
          >
            <v-list-item>
              <div class="top-infos">
                <div class="d-flex justify-space-between">
                  <p>
                    {{ formatedJudmentDate }}
                  </p>
                  <p>{{ courtVerdict }}</p>
                </div>
              </div>
              <h3 class="py-4">
                <a
                  :href="findRelease(idx)?.filePath"
                  rel="noopener noreferrer"
                  target="_blank"
                  :aria-label="t('aria.label.download-pdf')"
                >
                  <v-icon
                    color="var(--pdf-red)"
                    large
                  >
                    mdi-file-pdf-box
                  </v-icon>
                </a>
                {{ nr }}
              </h3>
              <span
                class="
                    subtitle
                    my-2"
                v-html="description || t('error.no-data-available')"
              />
              <span
                class="subtitle my-2"
                style="display: block; color: var(--pdf-red);"
                v-html="availablePart || t('error.no-data-available')"
              />
              <span
                v-if="idsRole"
                class="py-4"
              >
                <h4> {{
                  `${t('general.message.roll-number')}${t('general.message.colon')} ${idsRole.join(' - ')} `
                }}</h4>
              </span>
              <p class="subtitle my-2">
                {{ `${t('general.message.keywords', 2)}${t('general.message.colon')}` }}
              </p>

              <div class="elevation-2 my-2 subtitle border pa-2">
                {{ keywords || t('error.no-data-available') }}
              </div>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
