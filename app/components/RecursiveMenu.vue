<template>
  <v-list v-if="items">
    <v-list-item
      v-for="(item, index) in items"
      :key="index"
      :to="item.to"
    >
      <!-- we are in a subMenu but without more subMenus -->
      <!-- we have a to link so no more subMenu, we activate the link directly -->
      <nuxt-link
        v-if="item.to"
        :to="localePath(item.to)"
      >
        <v-btn
          v-if="item.to"
          v-bind="props"
          variant="text"
          style="text-transform: none;"
        >
          {{ t(item.title) }}
        </v-btn>
      </nuxt-link>
      <!-- else we have more subMenus so we add a new menu and recursively call this component  -->
      <v-menu v-else>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            elevation="0"
            style="text-transform: none;"
          >
            {{ t(item.title) }}
          </v-btn>
        </template>
        <recursive-menu :items="item.subMenu" />
      </v-menu>
    </v-list-item>
  </v-list>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage'

defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
})
const { t, localePath } = useLanguage()
</script>
