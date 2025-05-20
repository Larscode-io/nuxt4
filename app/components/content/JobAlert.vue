<template>
  <!-- ################## -->
  <!-- set v-show to true to see older content -->
  <!-- ################## -->
  <p v-show="betweenDates">
    <a
      :href=" vacLink"
      target="_blank"
    >
      <span
        class="d-inline-flex"
      >
        <v-icon
          class="mr-2"
          color="pdfRed"
        > mdi-file-pdf-box
        </v-icon>
        <slot name="description" />
      </span>
      ({{ formatDistanceToNow(showDate || new Date(), { addSuffix: true, locale: activeLocale(locale) }) }})
    </a>
  </p><br>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { parse, isValid, isAfter, formatDistanceToNow } from 'date-fns'

const { locale, activeLocale } = useLanguage()

const vacLink = computed(() => {
  return `https://www.const-court.be/public/common/${props.lang}/${props.pdf}`
})
const props = defineProps({
  pdf: { type: String, required: false },
  description: { type: String, required: false },
  startDate: { type: String, required: false },
  endData: { type: String, required: false },
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
    throw new Error(`Invalid date: ${stringDate}`)
  }

  return parsedDate
}
const showDate = parsedDate(props.startDate || '01-01-1999')
const hideDate = parsedDate(props.endData || '01-01-2999')
const isAfterShowDate = computed(() => showDate && showDate instanceof Date && isAfter(new Date(), showDate))
const isAfterHideDate = computed(() => hideDate && hideDate instanceof Date && isAfter(new Date(), hideDate))
const betweenDates = computed(() => (isAfterShowDate.value || isAfterHideDate.value) && !(isAfterShowDate.value && isAfterHideDate.value))
</script>
