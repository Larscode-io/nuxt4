<!-- API based page -->
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import img from '~/assets/img/banner-media.png'
import { ApiUrl } from '~/core/constants'
import { useLanguage } from '@/composables/useLanguage'

const { query } = useRoute()
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

const mediaItemsRef = ref(new Map())

const setMediaItemsRef = (id: number, el: ComponentPublicInstance) => {
  mediaItemsRef.value.set(id, el)
}

const menuHeight = inject('menuHeight', ref(70))

const scrollToJudgment = (id: number) => {
  const el = mediaItemsRef.value.get(id) as ComponentPublicInstance | undefined
  if (el) {
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - menuHeight.value - 10,
      behavior: 'smooth',
    })
  }
}

watchEffect(() => {
  scrollToJudgment(Number(query.id))
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
            :key="id"
            :ref="el => setMediaItemsRef(Number(id), el)"
            class="no-decoration mr-3"
            :aria-label="t('aria.label.landing.media.card')"
            :href="filePath"
            rel="noopener noreferrer"
            target="_blank"
          >
            {{ id }}
            <v-card
              :id="getId(id)"
              class="mx-auto mb-3"
              outlined
            >
              <v-list-item>
                <div class=" mb-3">
                  <div class="d-flex justify-space-between">
                    <v-icon
                      :color="'var(--pdf-red)'"
                    >mdi-file-pdf-box</v-icon>

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
