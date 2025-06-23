<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRuntimeConfig, useI18n } from '#imports'

const props = defineProps<{
  lang?: string
  pdf: string
}>()

const config = useRuntimeConfig()
const { locale } = useI18n()

const resolvedLang = computed(() => props.lang || locale.value)
const href = computed(() =>
  `${config.public.basePublicCommonUrl}/${resolvedLang.value}/${props.pdf}`,
)

const fileExists = ref(true)
const isVerified = ref(false)

const isProductionAndSameOrigin = computed(() => {
  if (import.meta.server) return false
  try {
    const baseUrl = new URL(config.public.basePublicCommonUrl)
    return window.location.hostname === baseUrl.hostname
  }
  catch {
    return false
  }
})

onMounted(async () => {
  if (isProductionAndSameOrigin.value) {
    try {
      const res = await fetch(href.value, { method: 'HEAD' })
      fileExists.value = res.ok
      isVerified.value = true
    }
    catch {
      fileExists.value = false
      isVerified.value = true
    }
  }
  else {
    // in dev or cross-origin we skip the fileExists verification
    fileExists.value = true
    isVerified.value = false
  }
})
</script>

<template>
  <p>
    <template v-if="fileExists">
      <a
        :href="href"
        target="_blank"
      >
        <span class="d-inline-flex">
          <v-icon
            class="mr-2"
            color="pdfRed"
          >mdi-file-pdf-box</v-icon>
          <slot>
            No text available for the PDF link
          </slot>
        </span>
      </a>
      <span
        v-if="!isVerified"
        class="text-caption ml-2 text-disabled"
      >
        Link cannot be verified in development mode because of cross-origin issues, on the production site it will be verified and this message will also dissapear.

      </span>
    </template>

    <template v-else>
      <slot name="fallback">
        <span class="text-disabled d-inline-flex">
          <v-icon
            class="mr-2"
            color="grey"
          >mdi-close-circle</v-icon>
          PDF non disponible
          <span class="ml-1 font-mono">
            ( <a
              :href="href"
              target="_blank"
            >{{ href }}</a> )
          </span>
        </span>
      </slot>
    </template>
  </p>
</template>
