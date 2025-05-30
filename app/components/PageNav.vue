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
  <div>
    <button @click="$emit('update:page', cycleThePage(props.currentPage - 1))">
      ﹤
    </button>
    <button>Page {{ props.currentPage }}</button>
    <button @click="$emit('update:page', cycleThePage(props.currentPage + 1))">
      ﹥
    </button>
  </div>
</template>
