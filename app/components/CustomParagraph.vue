<template>
  <div
    v-if="ready"
    class="custom-paragraph"
  >
    <ContentSlot
      :use="$slots.default"
      unwrap="p"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  ready: {
    type: Boolean,
    required: false,
    default: true,
  },
})
</script>

<style scoped>
.custom-paragraph {
    border: 2px solid #0065ca;
    padding: 10px;
    background-color: #f0f8ff;
}
</style>
