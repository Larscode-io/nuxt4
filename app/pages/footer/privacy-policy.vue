<!-- Content based Page -->
<script setup lang="ts">
import { ContentKeys } from '@core/constants'
import img from '@assets/img/banner-media.png'
</script>

<template>
  <ContentPage
    :content-path="`${ContentKeys.privacyPolicy}`"
    :img
    :enable-toc="true"
  />
</template>
