<!-- Content based Page -->
<template>
  <ContentPage
    :content-path="`${ContentKeys.legalDisclaimer}`"
    :img
    :enable-toc="false"
  />
</template>

<script setup lang="ts">
import { ContentKeys } from '../../core/constants'
import img from '~/assets/img/banner-text.png'
</script>
