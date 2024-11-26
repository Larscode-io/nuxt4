<template>
  <v-app app>
    <v-app-bar
      ref="appBarRef"
      :elevation="5"
      height="130"
    >
      <nuxt-link :to="localePath('/')">
        <v-btn
          icon
          class="logo-btn"
          width="64"
          height="64"
        >
          <div
            class="logo-container"
            alt=""
          />
        </v-btn>
      </nuxt-link>
      <v-toolbar-title>
        <h1>
          {{ t('general.message.consts-court') }}
        </h1>
      </v-toolbar-title>

      <v-spacer />
      <template v-if="$vuetify.display.mdAndUp">
        <v-container>
          <v-row>
            <v-col
              v-for="(item, index) in translatedItems"
              :key="item.title"
              class="menu-item"
            >
              <div
                v-if="item.subMenu"
                :class="['menu-title']"
                @mouseenter="hoverMenu(index)"
              >
                {{ item.title }}
                <div
                  v-if="hoveredMenu === index && item.subMenu"
                  class="submenu-container"
                  :style="{ top: `${menuHeight}px` }"
                  @mouseleave="hoverMenu(null)"
                >
                  <v-container fluid>
                    <v-row class="d-flex flex-row justify-space-evenly">
                      <v-col
                        v-for="(subItem) in item.subMenu"
                        :key="subItem.title"
                        cols="auto toEnableJustifyInRow"
                      >
                        <div v-if="subItem.subMenu">
                          <span class="submenu-title">{{ subItem.title }}</span>
                          <div
                            v-if="subItem.subMenu"
                            class="mega-menu"
                          >
                            <v-row class="d-flex flex-column">
                              <v-col
                                v-for=" (thirdLevelItem) in subItem.subMenu"
                                :key="thirdLevelItem.title"
                              >
                                <nuxt-link
                                  :to="thirdLevelItem.to ? localePath(thirdLevelItem.to) : '#'"
                                  @click="closeMenu"
                                >
                                  {{ thirdLevelItem.title }}
                                </nuxt-link>
                              </v-col>
                            </v-row>
                          </div>
                        </div>
                        <nuxt-link
                          v-else
                          :to="subItem.to ? localePath(subItem.to) : '#'"
                          @click="closeMenu"
                        >
                          <v-bt>
                            {{ subItem.title }}
                          </v-bt></nuxt-link>
                      </v-col>
                    </v-row>
                  </v-container>
                </div>
              </div>
              <nuxt-link
                v-else
                :to="item.to ? localePath(item.to) : '#'"
              >
                <v-btn :style="{ textTransform: 'none' }">
                  {{ item.title || 'Untitled' }}
                </v-btn>
              </nuxt-link>
            </v-col>
          </v-row>
        </v-container>

        <v-spacer />

        <nuxt-link :to="localePath(RoutePathKeys.informed)">
          <v-btn :style="{ textTransform: 'none' }">
            {{ t('menu.informed') }}
            <v-icon style="margin-left: 8px;">
              mdi-bank
            </v-icon>
          </v-btn>
        </nuxt-link>
      </template>

      <v-app-bar-nav-icon
        v-if="$vuetify.display.mobile"
        variant="text"
        @click.stop="drawer = !drawer"
      />

      <v-menu>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-translate"
            variant="text"
          >
            {{ locale }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(lang) in availableLocales"
            :key="lang.code"
            @click="switchLanguage(lang.code)"
          >
            <v-list-item-title>
              {{ lang.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- mobile menu -->
    <v-navigation-drawer
      v-if="drawer"
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
      temporary
    >
      <v-list :items="drawerItems" />
    </v-navigation-drawer>

    <v-main class="main-content">
      <slot />
    </v-main>

    <v-footer app>
      <!-- Footer content -->
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, onMounted, computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import type { CourtItem } from '@/core/constants'
import ogImageUrl from '~/assets/img/ogImage.jpg'
import { RoutePathKeys } from '~/core/constants'

const { t, locale, ogLocaleAlternate, ogLocale, availableLocales, switchLanguage, localePath } = useLanguage()
const description = computed(() => t('general.banner'))
const ogTitle = computed(() => t('general.message.consts-court'))

useSeoMeta({
  ogTitle,
  ogLocale,
  description,
  ogType: 'website',
  ogLocaleAlternate,
  ogImage: ogImageUrl,
  ogDescription: description,
  ogUrl: 'https://www.const-court.be/',
  title: t('general.message.consts-court'),
})
useHead({
  htmlAttrs: {
    lang: locale.value,
  },
})
const drawer = ref(false)

const { data: courtItems } = await useFetch<CourtItem[]>('/api/menu', {
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
  const x = applyTranslationToTitles(courtItems.value || [])
  return x
})

const drawerItems = ref([
  {
    title: 'Home',
    value: 'home',
  },
  {
    title: 'Profile',
    value: 'profile',
  },
  {
    title: 'Settings',
    value: 'settings',
  },
  {
    title: 'Logout',
    value: 'logout',
  },
])

onMounted(() => {
  if (h.value) {
    menuHeight.value = Number(h.value.height) || 40
  }
})
const menuHeight = ref(0)
const h = useTemplateRef('appBarRef')
provide('menuHeight', menuHeight)

const hoveredMenu = ref<number | null>(null)
function hoverMenu(index: number | null): void {
  hoveredMenu.value = index
}
function closeMenu() {
  hoveredMenu.value = null
}
</script>

<style lang="scss">
.full-width-link {
  display: block;
  width: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-title {
  cursor: pointer;
  position: relative;
  text-align: center;
}

.menu-title-hovered {
  border-bottom: 2px solid #000; /* Adjust the color and thickness as needed */
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
.main-content {
  min-height: calc(100vh - 80px);
  /* Based on the height of app bar */
  padding-bottom: 190px;
  /* Added some padding at the bottom so the Sidebar can highlight also the last item */
}
h1 {
  color: $logoColor;
      font-weight: 600;
      font-size: 1rem;
      font-family: 'Tiempos Headline';
      margin-left: 16px;
}

.logo-btn {
  margin: 8px;
  padding: 0 !important;
}

.logo-container {
  width: 64px;
  height: 64px;
  background: url('~~/app/assets/icons/fed.svg') no-repeat center center;
  background-size: contain;
}
.v-icon {
  transition: transform 0.3s ease;
}
</style>
