<!-- Content based Page -->

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug)

const localeStrippedPath = computed(() => {
  return route.path.replace(/^\/[a-z]{2}(?=\/)/, '')
})

const { data: page } = await useAsyncData(
  `/design/${slug}`,
  () => queryCollection('collection_design')
    .path(localeStrippedPath.value)
    .first()
)

</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <div v-if="page">
          <ContentRenderer :value="page"/>
        </div>
        <p v-else>No content available.</p>
      </v-col>
    </v-row>
  </v-container>
</template>
