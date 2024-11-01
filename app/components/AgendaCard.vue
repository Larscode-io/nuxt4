<script lang="ts" setup>
import type { Decision } from '@/core/constants'

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
const transform = (items: Decision[]): Decision[] => {
  const parsedDates = (items ?? []).map(item => new Date(item.date))
  const nearestDate = parsedDates.sort((a, b) => a - b)[0]

  // we may not show items that are older than 21 days
  const filteredItems = items.filter((item) => {
    if (!nearestDate) return false
    const itemDate = new Date(item.date)
    return item.distance <= 21 && item.master === null && nearestDate && itemDate.getTime() === nearestDate.getTime()
  })
  // we only want to show maxItems items if the parent component wants to limit the items
  const limitedItems = props.maxItems ? filteredItems.slice(0, props.maxItems) : filteredItems

  const itemsWithShortDescription = limitedItems.map(item => ({
    ...item,
    shortDescription: item.encinz?.substring(0, 90).concat('...'),
  }))

  return itemsWithShortDescription
}

const { data: items, error } = await useFetch<Decision[]>(props.apiUrl, { transform: transform })

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'We have a issue with fetching data in AgendaCard' })
}
</script>

<template>
  <div>
    <v-row>
      <v-col
        v-for="(item, index) in items ?? []"
        :key="index"
        cols="12"
        sm="12"
        md="4"
        xl="2"
      >
        <slot
          name="item"
          :item="item"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped></style>
