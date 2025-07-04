<!-- Content based Page -->

<script setup lang="ts">

const { data: page } = await useAsyncData(
  '/design/visual-audit',
  () => queryCollection('collection_design').first()
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
