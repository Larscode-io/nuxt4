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

onMounted(async () => {
  try {
    const res = await fetch(href.value, { method: 'HEAD' })
    fileExists.value = res.ok
  }
  catch (err) {
    fileExists.value = false
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
