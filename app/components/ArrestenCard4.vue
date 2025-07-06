<template>
  <v-card
    elevation="2"
    hover
    :hover-elevation="12"
    class="rounded-lg"
    style="background-color: rgba(252,191,118,0.2); border-left: 4px solid #FCBF60;"
  >
    <v-card-title class="d-flex justify-space-between align-start pa-4">
      <span
        class="text-subtitle-2"
        style="color: #777777;"
      >
        {{ formattedDate }}
      </span>
      <NuxtLink
        :to="`/arresten/${arrestNumber}`"
        class="text-subtitle-2 font-medium"
        style="color: var(--v-theme-secondary); text-decoration: none;"
      >
        Arrest nr. {{ arrestNumber }} →
      </NuxtLink>
    </v-card-title>

    <v-card-text class="pa-4">
      <div
        class="text-body-1 font-medium mb-2"
        style="color: #3D3A44;"
      >
        {{ title }}
      </div>
      <ul
        v-if="bulletPoints?.length"
        class="ma-0 mb-2 ps-4"
        style="list-style-type: disc;"
      >
        <li
          v-for="(item, idx) in bulletPoints"
          :key="idx"
          class="text-subtitle-2 mb-1"
          style="color: #333333; line-height: 1.4;"
        >
          {{ item }}
        </li>
      </ul>
    </v-card-text>

    <v-card-actions class="pa-4">
      <v-btn
        text
        color="secondary"
      >
        Lees verder
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'

const props = defineProps<{
  dateString: string
  arrestNumber: string
  title: string
  bulletPoints?: string[]
}>()
const { dateString, arrestNumber, title, bulletPoints } = toRefs(props)

const formattedDate = computed(() => {
  const d = new Date(dateString.value)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
})
</script>
