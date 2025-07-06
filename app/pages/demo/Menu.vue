<!--
The First-Level Menu Items can be simple buttons or buttons that open submenus.
The Second-Level Menu Items are displayed horizontally within the dropdown.
The Third-Level Menu Items (if present) are organized in a grid within their parent second-level item,
allowing for multiple columns.
The dropdown is not absolute to the parent button, but rather to the top of the screen.
-->

<!-- todo: add media queries to adjust the submenu's styling for mobile devices. -->

<script setup lang="ts">
import { ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import type { CourtItem } from '@/core/constants'

const { t } = useLanguage()
definePageMeta({
  layout: 'leeg',
})

const { data: courtItems } = await useFetch <CourtItem[]> ('/api/menu', {
})

function applyTranslationToTitles(menu: CourtItem[]) {
  return menu.map((item: CourtItem) => {
    const translatedTitle = item.count !== undefined ? t(item.title, item.count) : t(item.title)
    const translatedItem = { ...item, title: translatedTitle }
    if (item.subMenu) {
      translatedItem.subMenu = applyTranslationToTitles(item.subMenu)
    }
    return translatedItem
  })
}
const translatedItems = computed(() => {
  return applyTranslationToTitles(courtItems.value || [])
})
const hoveredMenu = ref(null)
function hoverMenu(index) {
  hoveredMenu.value = index
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(item, index) in translatedItems"
        :key="item.title"
        class="menu-item"
      >
        <div
          v-if="item.subMenu"
          class="menu-title"
          @mouseenter="hoverMenu(index)"
          @mouseleave="hoverMenu(null)"
        >
          {{ t(item.title) }}
          <div
            v-if="hoveredMenu === index && item.subMenu"
            class="submenu-container"
          >
            <v-container fluid>
              <v-row class="d-flex flex-row justify-space-evenly ">
                <v-col
                  v-for="(subItem) in item.subMenu"
                  :key="subItem.title"
                  cols="auto toEnableJustifyInRow"
                >
                  <div v-if="subItem.subMenu">
                    <span class="submenu-title">{{ t(subItem.title) }}</span>
                    <div
                      v-if="subItem.subMenu"
                      class="mega-menu"
                    >
                      <v-row class="d-flex flex-column">
                        <v-col
                          v-for=" (thirdLevelItem) in subItem.subMenu"
                          :key="thirdLevelItem.title"
                        >
                          <a :href="thirdLevelItem.to">{{ t(thirdLevelItem.title) }}</a>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                  <a
                    v-else
                    :href="subItem.to"
                    class="full-width-link"
                  >{{ t(subItem.title) }}
                  </a>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
        <button v-else>
          {{ t(item.title) }}
        </button>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.full-width-link {
    display: block;
    width: 100%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.menu-title {
    cursor: pointer;
    position: relative;
}

.submenu-container {
    position: fixed;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
    padding: 10px;
}

.menu-item {
    position: relative;
}
.v-row.d-flex.flex-row {
    flex-wrap: nowrap;
}
</style>
