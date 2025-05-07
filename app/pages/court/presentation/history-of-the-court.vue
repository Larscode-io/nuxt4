<template>
  <ContentPage
    :content-path="`${ContentKeys.presentationSituation}`"
    :img
    :enable-toc="true"
  />
</template>

<script setup lang="ts">
import { ContentKeys } from '@/core/constants'
import img from '~/assets/img/newsletter-background-opt.png'
</script>
