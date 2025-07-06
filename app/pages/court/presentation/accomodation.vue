<template>
  <ContentPage :content-path="`${ContentKeys.presentationAccomodation}`" />
</template>

<script setup lang="ts">
import ContentPage from '@/components/ContentPage.vue'
import { ContentKeys } from '~/core/constants'
</script>
