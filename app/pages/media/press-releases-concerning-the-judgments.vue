<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { ApiUrl } from '@core/constants'
import img from '@assets/img/banner-media.png'
import { useLanguage } from '@/composables/useLanguage'

const { query } = useRoute()
const { id: queryid } = query

const { t, locale } = useLanguage()

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl
const withArchive = ref(true)

const { data: releases, error }
  = useFetch(`${baseURL}${ApiUrl.pressReleasesConcerningJudgments}?lang=${locale.value}&withArchive=${withArchive.value}`,
  )

if (error.value) {
  console.error(error.value)
}

const getId = (id: string) => {
  return `release-card-${id}`
}

const menuHeight = inject('menuHeight', ref(70))

const scrollToJudgment = (id: string) => {
  const releaseCardIdlabel = getId(id)
  const element = getElement(releaseCardIdlabel)
  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY - menuHeight.value - 10
    window.scrollTo({ top, behavior: 'smooth' })
  }
  else {
    console.error('Element not found for id:', releaseCardIdlabel)
  }
}

const getElement = (idLabel: string) => {
  const element = document.getElementById(idLabel)
  if (element) {
    return element
  }
  else {
    console.error('Element not found')
    return null
  }
}
watch(() => releases.value, (newReleases) => {
  if (newReleases) {
    nextTick(() => {
      if (queryid) {
        scrollToJudgment(queryid)
      }
      else {
        console.error('queryid is not defined so we cannot scroll to the judgment')
      }
    })
  }
})
</script>

<template>
  <div>
    <BannerImage
      :title="t('menu.press-and-media.press-releases-concerning-the-judgments')"
      :description="t('menu.press-and-media.press-releases-concerning-the-judgments-title-description')"
      :image="img"
      :alt="t('alt.banner.flag')"
    />
    <v-container>
      <v-row>
        <v-col>
          <a
            v-for="{ id, nr, title, description, filePath } in releases"
            :id="getId(id)"
            :key="id"
            class="no-decoration mr-3"
            :aria-label="t('aria.label.landing.media.card')"
            :href="filePath"
            rel="noopener noreferrer"
            target="_blank"
          >
            {{ id }}
            <v-card
              class="mx-auto mb-3"
              outlined
            >
              <v-list-item>
                <div class=" mb-3">
                  <div class="d-flex justify-space-between">
                    <v-icon :color="'var(--pdf-red)'">mdi-file-pdf-box</v-icon>

                    <h3>
                      {{ t('general.message.add-judgment-number-label') }}
                      {{ nr }}
                    </h3>
                  </div>
                </div>
                <v-list-item-title class="headline mb-1">{{
                  title
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  description
                }}</v-list-item-subtitle>
              </v-list-item>
            </v-card>
          </a>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
