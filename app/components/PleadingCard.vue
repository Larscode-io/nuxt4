<script lang="ts" setup>
import type { Pleading } from '@/core/constants'

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

const transform = (items: Pleading[]): Pleading[] => {
  const parsedDates = (items ?? []).map(item => new Date(item.date))
  const nearestDate = parsedDates.sort((a, b) => a - b)[0]

  const filteredItems = items.filter((item) => {
    if (!nearestDate) return false
    const itemDate = new Date(item.date)
    return itemDate.toDateString() === nearestDate.toDateString()
  })

  const limitedItems = props.maxItems ? filteredItems.slice(0, props.maxItems) : filteredItems

  const itemsWithShortDescription = limitedItems.map(item => ({
    ...item,
    shortDescription: item.description?.substring(0, 90).concat('...'),
  }))

  return itemsWithShortDescription
}

const { data, error } = await useFetch<Pleading[]>(props.apiUrl, { transform })

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'We have a issue with fetching data in SessionCard' })
}
</script>

<template>
  <div>
    <v-row>
      <v-col
        v-for="(item, index) in data ?? []"
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
