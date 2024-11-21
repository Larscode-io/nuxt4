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
  const target = e.currentTarget as HTMLElement
  const chevronIcon = target.querySelector('.v-icon') as HTMLElement | null

  if (chevronIcon) {
    if (activeChevron.value && activeChevron.value !== chevronIcon) {
      activeChevron.value.style.transform = ''
    }

    chevronIcon.style.transform = chevronIcon.style.transform === 'rotate(-90deg)' ? '' : 'rotate(-90deg)'
    activeChevron.value = chevronIcon.style.transform ? chevronIcon : null
  }
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
            @click="toggleChevron"
          >
            {{ t(item.title || 'Untitled') }}
            <div
              v-if="item.subMenu"
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
