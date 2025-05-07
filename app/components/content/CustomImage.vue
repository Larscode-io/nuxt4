<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
  width?: string
  height?: string
  contain?: boolean
  cover?: boolean
}>()

const resolvedSrc = ref('')
const { getImageUrl } = useImageMap()

watchEffect(() => {
  resolvedSrc.value = props.src ? getImageUrl(props.src) : ''
})
</script>

<template>
  <div
    class="d-flex justify-center my-6"
    :style="{ width: width || 'auto' }"
  >
    <v-img
      :src="resolvedSrc"
      :alt="alt || ''"
      :height="height || 'auto'"
      :cover="cover"
      :contain="contain"
      class="rounded-lg elevation-1"
      transition="fade-transition"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            indeterminate
            color="grey lighten-1"
          />
        </div>
      </template>
      <template #error>
        <div class="text-center pa-4">
          <v-icon
            size="40"
            color="error"
          >
            mdi-alert-circle
          </v-icon>
          <div>Image failed to load.</div>
        </div>
      </template>
    </v-img>
  </div>
</template>
