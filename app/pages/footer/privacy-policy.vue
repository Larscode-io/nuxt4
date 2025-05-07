<!-- Content based Page -->
<template>
  <ContentPage
    :content-path="`${ContentKeys.privacyPolicy}`"
    :img
    :enable-toc="false"
  />
</template>

<script setup lang="ts">
import { ContentKeys } from '../../core/constants'
import img from '~/assets/img/banner-media.png'
</script>
