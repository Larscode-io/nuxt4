<template>
  <div class="d-flex justify-space-around align-center flex-wrap">
    <div
      v-if="withImage"
      class="contact-img"
      :style="style"
      :alt="alt"
    />
    <section class="contact-infos">
      <slot />
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  withImage: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
})

const style = computed(() => `background-image: url(${props.image})`)
</script>

<style scoped>
.contact-img {
  width: 400px;
  height: 320px;
  background-size: cover;
  position: relative;
  margin: 0 80px 80px 0;
}
.contact-img::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 20px;
  background: #F4A261; /* Replace $rajahYellow with the actual color */
  display: block;
  bottom: -20px;
  left: 20px;
}
.contact-img::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 100%;
  background: #F4A261; /* Replace $rajahYellow with the actual color */
  display: block;
  right: -20px;
  bottom: -20px;
}
.contact-infos {
  margin-bottom: 16px;
  max-width: 320px;
}
.info-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 4px;
}
</style>
