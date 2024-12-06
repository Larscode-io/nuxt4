<template>
  <p :style="{ textDecoration: !betweenDates ? 'line-through' : 'none' }">
    {{ description }}<br>
    {{ description }}<br>
    <a
      :href="vacLink"
      target="_blank"
    >
      <v-icon color="rgb(var(--v-theme-pdfRed))"> mdi-file-pdf-box </v-icon>
      Vacature
    </a>
  </p><br>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { parse, isValid, isAfter } from 'date-fns'

const vacLink = computed(() => {
  return `https://www.const-court.be/public/common/${props.lang}/${props.pdf}`
})
const props = defineProps({
  pdf: { type: String, required: true },
  description: { type: String, required: true },
  d1z: { type: String, required: false },
  d2z: { type: String, required: false },
  lang: { type: String, required: true },
})

const parsedDate = (stringDate: string) => {
  const dateFormats = ['MM-dd-yyyy', 'dd-MM-yyyy']
  let parsedDate

  for (const format of dateFormats) {
    parsedDate = parse(stringDate, format, new Date())
    if (isValid(parsedDate)) {
      break
    }
  }

  if (!isValid(parsedDate)) {
    throw new Error('Invalid date format')
  }

  return parsedDate
}
const showDate = parsedDate(props.d1z || '01-01-1999')
const hideDate = parsedDate(props.d2z || '01-01-2999')
const isAfterShowDate = showDate && showDate instanceof Date && isAfter(new Date(), showDate)
const isAfterHideDate = hideDate && hideDate instanceof Date && isAfter(new Date(), hideDate)
const betweenDates = (isAfterShowDate || isAfterHideDate) && !(isAfterShowDate && isAfterHideDate)
</script>
