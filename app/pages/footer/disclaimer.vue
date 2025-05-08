<!-- Content based Page -->
<script setup lang="ts">
import { ContentKeys } from '@core/constants'
import img from '~/assets/img/banner-text.png'
</script>

<template>
  <ContentPage
    :content-path="`${ContentKeys.legalDisclaimer}`"
    :img
    :enable-toc="false"
  />
</template>
