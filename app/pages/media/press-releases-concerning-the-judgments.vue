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

const { data: releases, error } = useFetch(`${baseURL}${ApiUrl.pressReleasesConcerningJudgments}?lang=${locale.value}&withArchive=${withArchive.value}`)
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
    const x = el.getBoundingClientRect().top + window.scrollY - menuHeight.value
    window.scrollTo({
      top: x,
      behavior: 'smooth',
    })
  }
}

watchEffect(async () => {
  const { id } = query
  console.log('watchEffect sees a change in query parameter', id)
  scrollToJudgment(Number(id))
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
                  <v-icon
                    :color="'var(--pdf-red)'"
                  >mdi-file-pdf-box</v-icon>

                  <h3>
                    {{ t('general.message.add-judgment-number-label') }}
                    {{ nr }}
                  </h3>
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

<style lang="scss" scoped>
.container {
  padding: 0 !important;
  @include mobile {
    padding: 32px;
  }
}
.no-decoration {
  text-decoration: none;
}
.d-flex {
  max-width: 1260px !important;
  margin: auto;
  margin-bottom: 80px;
  @include mobile {
    margin-bottom: 40px;
    width: 100%;
  }
}
.v-list-item__title {
  overflow: visible;
  white-space: inherit;
  font-size: 1.125rem !important;
  line-height: 20px;
  margin-bottom: 20px !important;
}
.v-list-item__subtitle {
  overflow: visible;
  white-space: inherit;
  margin-bottom: 16px;
  font-size: 0.875rem;
  line-height: 20px;
  font-weight: 400;
}
h3 {
  display: inline;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: inherit;
  line-height: inherit;
  font-family: inherit;
}
</style>
