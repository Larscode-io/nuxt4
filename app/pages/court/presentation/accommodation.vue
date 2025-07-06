<script setup lang="ts">
import img from '@assets/img/banner-job.png'
import { ContentKeys } from '@core/constants'
</script>

<template>
  <ContentPage
    :content-path="`${ContentKeys.presentationAccommodation}`"
    :img
    :enable-toc="true"
  />
</template>
