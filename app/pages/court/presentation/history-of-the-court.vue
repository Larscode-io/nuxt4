<template>
  <ContentPage :content-path="`${ContentKeys.presentationJurisdiction}`" />
</template>

<script setup lang="ts">
import ContentPage from '@/components/ContentPage.vue'
import { ContentKeys } from '~/core/constants'
</script>
