<script setup lang="ts">
const props = defineProps<{
  src: string
  lazySrc?: string
  alt?: string
  width?: string
  height?: string
  contain?: boolean
  cover?: boolean
}>()

const resolvedSrc = ref('')
const resolvedLazySrc = ref('')

const loadImage = async () => {
  console.log('props.src', props)
  const imagePath = '../../assets/img/'
  resolvedSrc.value = new URL(`${imagePath}/${props.src}`, import.meta.url).href
  resolvedLazySrc.value = new URL(`${imagePath}/${props.lazySrc || props.src}`, import.meta.url).href
}
onMounted(loadImage)
</script>

<template>
<div class="d-flex justify-center my-6" :style="{ width: width || 'auto' }">
    <v-img
      :src="resolvedSrc"
      :lazy-src="resolvedLazySrc"
      :alt="alt || ''"
      :height="height || 'auto'"
      :cover="cover"
      :contain="contain"
      s="rounded-lg elevation-1"
      :transition="'fade-transition'"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular indeterminate color="grey lighten-1" />
        </div>
      </template>
      <template #error>
        <div class="text-center pa-4">
          <v-icon size="40" color="error">mdi-alert-circle</v-icon>
          <div>Image failed to load.</div>
        </div>
      </template>
    </v-img>
  </div>
</template>
