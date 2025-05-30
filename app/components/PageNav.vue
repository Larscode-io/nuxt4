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
    return 1
  }
  else {
    return newPage
  }
}
</script>

<template>
  <div class="d-flex align-center ga-2">
    <button
      class="v-btn v-btn--outlined"
      aria-label="First page"
      @click="$emit('update:page', cycleThePage(1))"
    >
      <span class="mdi mdi-chevron-double-left" />
    </button>
    <button
      class="v-btn v-btn--outlined"
      aria-label="Previous page"
      @click="$emit('update:page', cycleThePage(props.currentPage - 1))"
    >
      <span class="mdi mdi-chevron-left" />
    </button>
    <span class="text-body-1 font-weight-medium">
      Page {{ props.currentPage }} of {{ props.nrOfPages }}
    </span>
    <button
      class="v-btn v-btn--outlined"
      aria-label="Next page"
      @click="$emit('update:page', cycleThePage(props.currentPage + 1))"
    >
      <span class="mdi mdi-chevron-right" />
    </button>
    <button
      class="v-btn v-btn--outlined"
      aria-label="Last page"
      @click="$emit('update:page', cycleThePage(props.nrOfPages))"
    >
      <span class="mdi mdi-chevron-double-right" />
    </button>
  </div>
</template>
