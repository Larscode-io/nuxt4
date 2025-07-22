<script setup lang="ts">
import { computed, watch } from 'vue'
import img from '@assets/img/banner-media.png'
import { ApiUrl } from '@core/constants'
import { useLanguage } from '@/composables/useLanguage'

const { t, locale } = useLanguage()

import type { Pleading, PressJudgment } from '@core/constants'

const fetchData = () => Promise.all([
  $fetch<Pleading[]>(`${ApiUrl.pressPleadings}?lang=${locale.value}`),
  $fetch<PressJudgment[]>(`${ApiUrl.pressJudgment}?lang=${locale.value}`),
])

const { data, error, status, refresh } = useAsyncData<[Pleading[], PressJudgment[]]>(fetchData, { watch: [locale] })

const JUDGMENT_DISTANCE_LIMIT = 52
const judgments = computed(() =>
  Array.isArray(data.value?.[1])
    ? data.value[1].filter((i) => i.distance < JUDGMENT_DISTANCE_LIMIT)
    : []
)

const pleadings = computed(() =>
  Array.isArray(data.value?.[0])
    ? data.value[0]
    : []
)

import { onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

function scrollToHash(retries = 10) {
  const hash = window.location.hash
  if (hash) {
    const el = document.querySelector(hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else if (retries > 0) {
      setTimeout(() => scrollToHash(retries - 1), 100)
    }
  }
}

onMounted(async () => {
  await nextTick()
  scrollToHash()

})

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
        <h2 id="decisions">Pleadings</h2>
        <SessionCardDetail
          v-for="pleading of pleadings"
          :id="pleading.id"
          :key="pleading.id"
          :title="t('general.message.public-hearing')"
          :lang="pleading.processingLanguage"
          :day="pleading.day"
          :month="pleading.month"
          :time="pleading.hora || '14-17h'"
          :location="t('general.brussels')"
          :concerning="t('general.message.concerning')"
          :colon="t('general.message.colon')"
          :description="pleading.description"
        />

        <h2 id="hearings">Judgments</h2>
        <AgendaCardDetail
          v-for="judgment in judgments"
          :id="judgment.id"
          :key="judgment.id"
          :nr="judgment.nr"
          :childCaseNumbers="judgment.joinedcases"
          :title="
            t('menu.agenda.upcoming-decisions-nr', { count: judgment.joinedcases.length >= 1 ? 2 : 1 })
          "
          :day="judgment.day"
          :month="judgment.month"
          :concerning="t('general.message.concerning')"
          :description="judgment.encinz"
          :colon="t('general.message.colon')"
        />
      </div>
    </v-container>
  </div>
</template>
