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
          width="64"
          height="64"
          class="mx-2 pa-0"
        >
          <v-img
            src="~/assets/icons/fed.svg"
            class="logo-container d-flex align-center justify-center"
            width="64"
            height="64"
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
              class="position-relative"
            >
              <div
                v-if="item.subMenu"
                class="cursor-pointer position-relative text-center"
                @mouseenter="hoverMenu(index)"
                @click="toggleMenu"
              >
                <!-- 1st level -->
                {{ item.title }}
                <div
                  v-if="hoveredMenu === index && item.subMenu"
                  class=" position-fixed left-0 right-0 bg-white elevation-2 pa-2 "
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
                        <!-- 2nd level with 3rd level in a mega menu -->
                        <div v-if="subItem.subMenu">
                          <div
                            v-if="subItem.subMenu"
                            class="_mega-menu"
                          >
                            <v-row class="flex flex-column">
                              <!-- 2n level title -->

                              <v-col
                                class="font-weight-bold pa-1 pb-5"
                                align="start"
                              >
                                {{ subItem.title }}
                              </v-col>
                              <v-col
                                v-for=" (thirdLevelItem) in subItem.subMenu"
                                :key="thirdLevelItem.title"
                                align="start"
                                class="pa-1"
                              >
                                <nuxt-link
                                  :to="thirdLevelItem.to ? localePath(thirdLevelItem.to) : '#'"
                                  @click="handleMenuClick"
                                >
                                  <!-- 3th level -->
                                  {{ thirdLevelItem.title }}
                                </nuxt-link>
                              </v-col>
                            </v-row>
                          </div>
                        </div>
                        <v-row v-else>
                          <v-col>
                            <nuxt-link
                              :to="subItem.to ? localePath(subItem.to) : '#'"
                              @click="handleMenuClick"
                            >
                              <!-- 2nd level -->
                              {{ subItem.title }}
                            </nuxt-link>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-container>
                </div>
              </div>
              <nuxt-link
                v-else
                :to="item.to ? localePath(item.to) : '#'"
              >
                <!-- 1st level but no submenu -->
                {{ item.title || 'Untitled' }}
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

function handleMenuClick() {
  closeMenu()
  toggleMenu()
}
function toggleMenu() {
  hoveredMenu.value = hoveredMenu.value === null ? 0 : null
}
</script>

<style lang="scss">
h1 {
  color: $logoColor;
      font-weight: 600;
      font-size: 1rem;
      font-family: 'Tiempos Headline';
      margin-left: 16px;
}
</style>
