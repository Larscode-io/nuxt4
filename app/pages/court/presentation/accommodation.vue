<template>
  <ContentPage
    :content-path="`${ContentKeys.presentationAccommodation}`"
    :img
    :enable-toc="true"
  />
</template>

<script setup lang="ts">
import { ContentKeys } from '../../../core/constants'
import img from '~/assets/img/banner-job.png'
</script>
