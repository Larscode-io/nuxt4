<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'

const { t, localePath } = useLanguage()
defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
})
const activeChevron = ref<HTMLElement | null>(null)

const toggleChevron = (e: Event) => {
  const target = e.target as HTMLElement
  if (activeChevron.value && activeChevron.value !== target) {
    activeChevron.value.style.transform = ''
  }
  target.style.transform = target.style.transform === 'rotate(-90deg)' ? '' : 'rotate(-90deg)'
  activeChevron.value = target.style.transform ? target : null
}
</script>

<template>
  <v-list v-if="items">
    <v-list-item
      v-for="(item, index) in items"
      :key="index"
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
            <div
              v-if="item.subMenu"
              @click="toggleChevron"
            >
              <v-icon>
                mdi-chevron-down
              </v-icon>
            </div>
          </v-btn>
        </template>
        <recursive-menu :items="item.subMenu" />
      </v-menu>
    </v-list-item>
  </v-list>
</template>
