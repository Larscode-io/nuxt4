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

const files = ref<string[]>([])
const error = ref<string | null>(null)

async function fetchFiles() {
  const url = `${config.public.basePublicCommonUrl}/${resolvedLang.value}/`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch directory listing')
    }
    // This assumes the server returns a JSON array of filenames
    files.value = await response.json()
  }
  catch (err: any) {
    error.value = err.message
  }
}
onMounted(async () => {
  try {
    const res = await fetch(href.value, { method: 'HEAD' })
    fileExists.value = res.ok
  }
  catch (err) {
    fileExists.value = false
    // if the HEAD request fails, we still want to check the directory listing
    console.error('HEAD request failed:', err)
    // console.log to have a look at Fetch/XHR errors in devtools
    console.error('Fetching directory listing for:', href.value)
    console.error('Looking for files in:', `${config.public.basePublicCommonUrl}/${resolvedLang.value}/`)
    console.error('Analyse in devtools Network tab for more details')
    fetchFiles()
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
          <slot />
        </span>
      </a>
    </template>
    <template v-else>
      <span class="text-disabled d-inline-flex">
        <v-icon
          class="mr-2"
          color="grey"
        >mdi-close-circle</v-icon>
        PDF not available, please check the link (link check only works on production server):
        <span class="ml-1 font-mono">( <a
          :href="href"
          target="_blank"
        >{{ href }}</a> )</span>
      </span>
    </template>
  </p>
</template>
