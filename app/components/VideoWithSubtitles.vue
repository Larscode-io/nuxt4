<template>
  <div class="d-flex flex-column align-center justify-center w-100 overflow-hidden">
    <video
      :key="videoKey"
      class="w-100"
      style="height: auto; border: 1px solid #ccc;"
      controls
      playsinline
    >
      <source :src="videoSrc" type="video/mp4" />
    </video>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps({
  videoId: {
    type: String,
    required: false,
    default: '',
  },
})

const accessible = ref(false)
const videoKey = ref(0) // Force reload when source changes

const translations = {
  en: 'Accessible version (hearing impaired)',
  fr: 'Version accessible (malentendants)',
  de: 'Barrierefreie Version (hörgeschädigt)',
  nl: 'Toegankelijke versie (slechthorenden)',
}
const { t, locale } = useLanguage()

const accessibleLabel = computed(() => translations[locale.value] || translations.en)
const videoFilename = computed(() => {
  const version = accessible.value ? 'TRANS' : 'SUBTI'
  const label = 'DEF31032025'
  return `${props.videoId}-${locale.value.toUpperCase()}-${label}-${version}-XX.mp4`
})

const videoSrc = computed(() => {
  return `https://www.const-court.be/public/media/${videoFilename.value}`
})

// Watchers
watch([locale, accessible], () => {
  updateVideoSrc()
})

// Methods
const updateVideoSrc = () => {
  videoKey.value++ // trigger the reload video when locale or version changes
}
</script>

<style scoped>

</style>
