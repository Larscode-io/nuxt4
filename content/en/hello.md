---
title: Catch-All Page for Markdown Content
year: 2024
---

### Catch-All Page for Markdown Content

The catch-all page in our Nuxt application is designed to dynamically render Markdown content based on the URL path. Utilizing the `[...slug].vue` file, this page captures all routes that do not match more specific paths, allowing for flexible content management.

#### Key Features:

- **Dynamic Routing**: The catch-all page matches any nested route, enabling the seamless addition of new Markdown files without requiring individual route definitions.
  
- **Markdown Rendering**: It leverages Nuxt Content to fetch and display Markdown content stored in the `content/nl, content/fr,...` directories.

- **SEO-Friendly**: By generating clean URLs that correspond to the structure of the content files, this setup enhances search engine optimization.

- **Flexible Structure**: The Markdown content can include various elements such as headings, paragraphs, images, and custom components, providing a rich user experience.

#### Example Usage:

To implement a catch-all page for Markdown content, we created a file named `[...slug].vue` in the `app/pages/` directory with the following structure:

```vue
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
let contentPath = `/${locale.value}/${contentSlug}`

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
```

### How to use Legacy Nuxt 2 Content Loader
The [Legacy Content Loader](/en/legacyContent) page serves as a bridge between our new Nuxt 3 application and the content from our legacy Nuxt 2 website (www.const-court.be). This page is designed to load and render Markdown (.md) files directly from the old website's content structure. By implementing this approach, we can seamlessly integrate existing content during the migration process, ensuring that valuable information remains accessible while we transition to the new Nuxt 3 framework. This method allows us to gradually move content over time, maintaining consistency in our site's information architecture and user experience throughout the migration.
