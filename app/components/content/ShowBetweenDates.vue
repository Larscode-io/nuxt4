<!-- components/ShowBetweenDates.vue -->

<script setup lang="ts">
import { computed } from 'vue'
import { parse, isValid, isAfter } from 'date-fns'

const props = defineProps({
  startDate: { type: String, required: false },
  endDate: { type: String, required: false },
})

const now = new Date()

const parseDate = (value: string | undefined, fallback: Date) => {
  const formats = ['MM-dd-yyyy', 'dd-MM-yyyy']
  for (const format of formats) {
    const parsed = parse(value ?? '', format, new Date())
    if (isValid(parsed)) return parsed
  }
  return fallback
}

const start = parseDate(props.startDate, new Date('1999-01-01'))
const end = parseDate(props.endDate, new Date('2999-01-01'))

const isVisible = computed(() =>
  isAfter(now, start) && !isAfter(now, end),
)
</script>

<template>
  <slot v-if="isVisible" />
</template>
