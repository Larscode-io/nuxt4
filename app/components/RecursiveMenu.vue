<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'

const { localePath } = useLanguage()
interface MenuItem {
  title?: string
  to?: string
  subMenu?: MenuItem[]
}

defineProps<{
  items: MenuItem[]
}>()
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
      <!-- bottom level menu because we have direct link in item.to, so no more subMenus -->
      <nuxt-link
        v-if="item.to"
        :to="localePath(item.to) || 'https://item.to.noLocale'"
      >
        <v-btn
          v-if="item.to"
          elevation="0"
          style="text-transform: none;"
        >
          {{ item.title || 'Untitled' }}
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
            {{ item.title || 'Untitled' }}
            <div
              v-if="item.subMenu"
            >
              <v-icon>
                mdi-chevron-down
              </v-icon>
            </div>
          </v-btn>
        </template>
        <recursive-menu
          v-if="item.subMenu"
          :items="item.subMenu"
        />
      </v-menu>
    </v-list-item>
  </v-list>
</template>

<style lang="scss" scoped>
    .v-icon {
      transition: transform 0.2s linear;
    }
</style>
