<template>
  <v-img
    :src="i"
    :alt="alt"
    :max-width="maxWidth"
  />
</template>

<script setup>
import { onMounted, computed } from 'vue'

const props = defineProps({
  alt: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
  lazy: {
    type: String,
    required: false,
  },
  maxWidth: {
    type: String,
    required: true,
  },
})

const i = ref('')

onMounted(() => {
  try {
    i.value = new URL(props.src, import.meta.url).href
  }
  catch (error) {
    console.error('Error loading image URL:', error)
  }
})
</script>
