<!--
app/pages/[...slug].vue
A catch-all route for Nuxt Content that dynamically renders content based on the URL path of content stored in the content/ directory.

/api/_content/query
The endpoint provided by Nuxt Content that allows you to query your content programmatically.
-->

<template>

<ContentRenderer :value="data">
    <template #default="{ value }">
      <h1>{{ value.title }}</h1>
      <p>{{ value.description }}</p>
      <p>Year: {{ value.year }}</p>
      <ContentRendererMarkdown :value="value.body" />
    </template>
</ContentRenderer>

<!-- <ContentDoc :path="contentSlug" :locale /> -->
<!-- <ContentRendererMarkdown :value="data" /> -->
<!-- <ContentRendererMarkdown :value="data.body" /> -->

</template>
  
<script setup>
const route = useRoute()
const { locale } = useI18n()
const params = route.params.slug || []
const contentSlug = params.join('/')
const _contentPath = `/${locale.value}/${contentSlug}`

const { data } = await useAsyncData(`content-${contentSlug}`, async () => {
  try {
    const fetchedContent = await queryContent(contentSlug)
      .where({ _locale: locale.value })
      .findOne()
    return fetchedContent
  } catch (error) {
    console.error('Debug: Error fetching content:', error)
    return null
  }
})

if (!data.value) {
  console.log('Debug: Content not found, throwing 404 error')
  throw createError({ statusCode: 404, statusMessage: 'Content not found' })
}
</script>
