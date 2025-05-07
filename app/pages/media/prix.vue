<template>
  <ContentPage
    :content-path="`${ContentKeys.prize}`"
    :img
    :enable-toc="false"
  />
</template>

<script setup lang="ts">
import { ContentKeys } from '@/core/constants'
import img from '~/assets/img/prize-banner.jpg'
</script>
