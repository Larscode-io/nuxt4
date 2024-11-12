<template>
  <v-row class="d-flex justify-center align-center">
    <v-img
      v-if="iSrc"
      :src="iSrc"
      :alt
      :max-width
    />
  </v-row>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  alt: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
  maxWidth: {
    type: String,
    required: true,
  },
})

const iSrc = ref('')

const loadImage = async () => {
  const imagePath = props.src || ''
  const images2 = import.meta.glob('../assets/img/prize/*.png', { eager: true, import: 'default' })
  iSrc.value = images2[imagePath] || 'Image not available'
}

onMounted(loadImage)
</script>
