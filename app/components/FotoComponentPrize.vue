<template>
  <v-row
    justify="center"
    align="center"
  >
    <v-img
      :src="i"
      :alt="alt"
      :max-width="maxWidth"
    />
    <img
      :src="i"
      :alt="alt"
      :max-width="maxWidth"
    >
  </v-row>
</template>

<script setup>
import { onMounted } from 'vue'

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
    console.log('i.value:', i.value)
  }
  catch (error) {
    console.error('Error loading image URL:', error)
  }
})
</script>
