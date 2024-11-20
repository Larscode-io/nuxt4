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
          elevation="0"
          style="text-transform: none;"
        >
          {{ t(item.title || 'Untitled') }}
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
            {{ t(item.title || 'Untitled') }}
            <v-icon v-if="item.subMenu">
              mdi-chevron-down
            </v-icon>
          </v-btn>
        </template>
        <recursive-menu :items="item.subMenu" />
      </v-menu>
    </v-list-item>
  </v-list>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage'

const { t, localePath } = useLanguage()
defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
})
const f = (path) => {
  console.log('path', path)
  console.log(localePath(path))
  console.log('x', x)
  return x
}
</script>
