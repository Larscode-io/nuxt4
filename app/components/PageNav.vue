<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  nrOfPages: {
    type: Number,
    required: true,
  },
})

defineEmits(['update:page'])

const cycleThePage = (newPage) => {
  console.log('PageNav want to go to: ', newPage)
  if (newPage < 1) {
    return props.nrOfPages
  }
  else if (newPage > props.nrOfPages) {
    console.log('PageNav want to go to: ', newPage, 'but we go to 1')
    return 1
  }
  else {
    console.log('PageNav want to go to: ', newPage, 'and we go to that page')
    return newPage
  }
}
</script>

<template>
  <div class="d-flex align-center ga-2">
    <button
      class="v-btn v-btn--outlined"
      aria-label="Previous page"
      @click="$emit('update:page', cycleThePage(props.currentPage - 1))"
    >
      <span class="mdi mdi-chevron-left" />
    </button>
    <span class="text-body-1 font-weight-medium">
      Page {{ props.currentPage }}
    </span>
    <button
      class="v-btn v-btn--outlined"
      aria-label="Next page"
      @click="$emit('update:page', cycleThePage(props.currentPage + 1))"
    >
      <span class="mdi mdi-chevron-right" />
    </button>
  </div>
</template>
