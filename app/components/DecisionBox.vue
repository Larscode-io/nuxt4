<script setup lang="ts">
import type { Judgment } from '@/core/constants'

const props = defineProps({
  apiUrl: {
    type: String,
    required: true,
  },
  maxItems: {
    type: Number,
    required: false,
  },
})
const transform = (items: Judgment[]): Judgment[] => {
  return items.map(item => ({
    ...item,
    shortDescription: item.description?.substring(0, 90).concat('...'),
  })).slice(0, props.maxItems ?? items.length)
}

let apiUrl = props.apiUrl
const currentYear = new Date().getFullYear()
if (!apiUrl.includes('year=')) {
  apiUrl += `&year=${currentYear}`
}
const fallbackYear = currentYear - 1
let theYearWeUse = currentYear

let { data: items, error } = await useFetch<Judgment[]>(apiUrl, { transform })
if (error.value || (items.value?.length ?? 0) === 0) {
  // If there is no data for the current year, we fetch the data for the previous year
  theYearWeUse = fallbackYear
  apiUrl = apiUrl.replace(`year=${currentYear}`, `year=${fallbackYear}`);
  ({ data: items, error } = await useFetch<Judgment[]>(apiUrl, { transform }))
}

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'We have a issue with fetching data in DecisionBox' })
}
</script>

<template>
  <v-row>
    <v-col style="padding: 16px" v-for="(item, index) in items" :key="index" cols="12" sm="6" md="4" xl="4">
      <slot name="item" :item="item" :year="theYearWeUse" />
    </v-col>
  </v-row>
</template>
