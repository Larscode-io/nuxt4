<!-- Content based Page -->
<script setup lang="ts">
import { ContentKeys } from '@core/constants'
import img from '~/assets/img/prize-banner.jpg'
</script>

<template>
  <ContentPage
    :content-path="`${ContentKeys.prize}`"
    :img
    :enable-toc="false"
  />
</template>
