<!--
App/pages/legacy-content-loader.vue
http://localhost:3002/api/_content/query
-->

<template>
  <div v-if="content">
    <ContentRendererMarkdown :value="content" />
  </div>
</template>

<script setup>
const route = useRoute()
const { locale } = useI18n()
const params = route.params.slug || []
const contentSlug = params.join('/')
const url = `https://www.const-court.be/_content/${locale.value}/presentation-international-relations-of-the-court`
const { data: content } = useAsyncData(`content-${contentSlug}`, async () => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const fetchedContent = await response.json()
    return fetchedContent
  }
  catch (error) {
    console.error('Debug: Error fetching content:', error)
    return null
  }
})
</script>
