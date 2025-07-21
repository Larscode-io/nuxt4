<script setup lang="ts">
import { ref, watchEffect, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { ApiUrl } from '@core/constants'
import type { Judgment } from '@core/constants'
import img from '@assets/img/banner-media.png'
import { useLanguage } from '@/composables/useLanguage'

import type { GeneralPressJudgment } from '@/core/constants'

const { t, locale } = useLanguage()
const basePublicUrl = useRuntimeConfig().public.basePublicUrl

const { query } = useRoute()

const OLDEST_YEAR = 1985
const currentYear = new Date().getFullYear()
const year = computed(() => Number(query.year) || new Date().getFullYear())
const years = ref(range(OLDEST_YEAR, currentYear).reverse())

const selected_year = ref(year.value)
const selected_month = ref<number>(0)

watch(selected_year, () => {
  selected_month.value = 0
})

const { data: judgments, error, pending, status, refresh }
  = useFetch<Judgment[]>(() => `${ApiUrl.judgments}`,
    {
      query: {
        lang: locale.value,
        year: selected_year,
      },
    })
if (error.value) {
  console.error(error.value)
}

const judgmentsWithMonth = computed(() => {
  return judgments.value?.map( (j) => {
    const realDate = new Date(j.judmentDate)
    const monthNumber = realDate.getMonth() // here 0 represents for January, 11 for December
    return {
      ...j,
      // convert to 1-based month
      // so that 1 represents January,... and 12 represents December
      // month 0 will serve as "all months" in a filter
      month: monthNumber + 1,
    }
  }) || []
})

const judgmentsFilteredByMonth = computed(() => {
  if(! judgmentsWithMonth.value) {
    return []
  }
  return judgmentsWithMonth.value.filter((j) => {
    if (
      selected_month.value !== 0 && j.month !== selected_month.value ) {
      return false
    }
    // other filters can be applied here, e.g. by court or verdict
    return true
  })
})

const allMonths = computed(() => t('general.message.all-months') || 'All Months')
const monthsInNames = computed(() => {
  if (!judgments.value) {
    return [{ value: 0, title: allMonths.value }]
  }
  const seen = new Set<number>()
  const months = judgments.value.reduce<{ value: number, title: string }[]>((acc, judgment: Judgment) => {
    const realDate = new Date(judgment.judmentDate)
    const monthNumber = realDate.getMonth() + 1
    if (!seen.has(monthNumber)) {
      seen.add(monthNumber)
      acc.push({ value: monthNumber, title: realDate.toLocaleString(locale.value, { month: 'long' }) })
    }
    return acc
  }, [])
  return [{ value: 0, title: allMonths.value }, ...months]
})
const labelMonthSelection = computed(() =>
  `${t('general.message.month-selection')}${t('general.message.colon')}` || 'Select Month'
)
const labelYearSelection = computed(() =>
  `${t('general.message.year-selection')}${t('general.message.colon')}`
)

const transform = (data: GeneralPressJudgment[]) => {
  return data.filter((release: { nr: string }) => release.nr.split('/')[1] === String(year.value))
}

const { data }
  = useLazyFetch<GeneralPressJudgment[]>(() => `${ApiUrl.pressReleasesConcerningJudgments}`,
    {
      query: {
        lang: locale.value,
        withArchive: true,
      },
      transform,
    })
// watch data and log it to console
watch(data, (newData) => {
  console.info('Press releases data:', newData)
}, { immediate: true })

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

const handleJudgmentHover = async (nr: String) => {
  try {
    const { exists: existFile} = await $fetch('/api/check-file', {
      query: { url: `${basePublicUrl}${nr}` },
    })
    console.info(existFile ? `File exists for judgment ${nr}` : `File does not exist for judgment ${nr}`)
  }
  catch (error: unknown) {
    console.error(`Error checking file for judgment ${nr}:`, error)
  }
}

const filterLoading = ref(false)
const showSkeleton = computed(() => filterLoading.value || pending.value)

// this loading time is just for the sake of UX:
// to make it clear to the user that the filters are being applied
watch([ selected_year, selected_month ], () => {
  filterLoading.value = true
  setTimeout(() => {
    filterLoading.value = false
  }, 300)
})

const findReleaseFilePath = (idx: number) => {
  const release = findRelease(idx)
  return release ? release.filePath : ''
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
              v-model="selected_year"
              :items="years"
              variant="outlined"
              :label="labelYearSelection"
              :disabled="years.length === 0"
            />
          </div>
          <div class="pa-4">
            <v-select
              v-model="selected_month"
              :items="monthsInNames"
              variant="outlined"
              :label="labelMonthSelection"
              :disabled="monthsInNames.length === 0"
            />
          </div>
        </v-col>
        <v-col v-if="showSkeleton">
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
            v-for="{ formatedJudmentDate, courtVerdict, nr, description, availablePart, idsRole, keywords, id: idx, filePath }
              in judgmentsFilteredByMonth"
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
              <!-- @mouseenter="handleJudgmentHover( filePath )" -->
              <h3 class="py-4">
                <a
                  :href="filePath"
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
              <!-- eslint-disable vue/no-v-html -->
              <span
                class="
                    subtitle
                    my-2"
                v-html="description || t('error.no-data-available')"
              />
              <!-- eslint-disable vue/no-v-html -->
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
              <span v-if="findReleaseFilePath(idx)">
                <a
                  :href="findReleaseFilePath(idx)"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="t('general.message.press-releases')"
                  style="display: block; text-decoration: none;"
                >
                  <h4 style="margin: 0;">
                    {{ t('general.message.press-releases') }}
                  </h4>
                </a>
              </span>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col
          v-else
          cols="12"
          md="9"
        >
          <v-alert
            type="error"
            dismissible
          > fout bij laden van gegevens
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
