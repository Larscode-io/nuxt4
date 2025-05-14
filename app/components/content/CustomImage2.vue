<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
  width?: string
  height?: string
  contain?: boolean
  cover?: boolean
}>()
</script>

<template>
  <div
    class="d-flex justify-center my-6 position-relative"
    :style="{ width: width || 'auto' }"
  >
    <div
      class="position-relative"
      style="display: inline-block;"
    >
      <img
        :src="`${src}`"
        :alt="alt || ''"
        :width="width || 'auto'"
        :height="height || 'auto'"
        :style="{ objectFit: 'cover' }"
        class="rounded-lg elevation-1"
      >
      <a
        :href="src"
        download
        class="mdi mdi-download position-absolute"
        style="top: 8px; right: 8px; background: none; border: none; cursor: pointer; z-index: 10;"
        aria-label="Download"
      />
    </div>
  </div>
</template>
