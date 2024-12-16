<script setup lang="ts">
import { ref, useTemplateRef, onMounted, computed } from 'vue'
import { useDisplay } from 'vuetify'
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
  return applyTranslationToTitles(courtItems.value || [])
})

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

const { mdAndUp, mobile, smAndDown } = useDisplay()

const expandedItems = ref<Record<string, boolean>>({})
const expandedSubItems = ref<Record<string, boolean>>({})

const toggleExpand = (title) => {
  expandedItems.value[title] = !expandedItems.value[title]
}

const handleNavigation = (link) => {
  // Implement your navigation logic here, e.g., using Vue Router
  // router.push(link);
}
</script>

<template>
  <v-app app>
    <v-app-bar
      ref="appBarRef"
      class="elevation-3"
      :height="130"
      role="navigation"
      aria-label="Main Navigation"
    >
      <nuxt-link :to="localePath('/')">
        <button
          class="mx-2 p-0 border-0 bg-transparent"
          aria-label="Home"
        >
          <img
            src="~/assets/icons/fed.svg"
            :style="{ width: '64px', height: '64px' }"
            alt="Logo"
            @click="hoverMenu(null)"
            @mouseenter="hoverMenu(null)"
          >
        </button>
      </nuxt-link>
      <v-toolbar-title>
        <h1 :aria-label="t('aria.label.menu.homelink')">
          {{ t('general.message.consts-court') }}
        </h1>
      </v-toolbar-title>

      <v-spacer />
      <template v-if="mdAndUp">
        <v-container>
          <v-row role="menu">
            <v-col
              v-for="(item, index) in translatedItems"
              :key="item.title"
              class="position-relative"
              role="menuitem"
            >
              <div
                v-if="item.subMenu"
                :id="`menu-${item.title}`"
                class="cursor-pointer position-relative text-center"
                :aria-label="`level 1 menu title ${item.title}`"
                role="link"
                tabindex="0"
                :aria-expanded="hoveredMenu === index"
                :aria-controls="`submenu-${index}`"
                @mouseenter="hoverMenu(index)"
                @click="toggleMenu"
              >
                {{ item.title }}
                <div
                  v-if="hoveredMenu === index && item.subMenu"
                  :id="`submenu-${index}`"
                  class="position-fixed left-0 right-0 bg-white elevation-2 pa-2"
                  :style="{ top: `${menuHeight}px` }"
                  @mouseleave="hoverMenu(null)"
                >
                  <v-container fluid>
                    <v-row
                      :aria-labelledby="`menu-${item.title}`"
                      class="d-flex flex-row justify-space-evenly"
                    >
                      <v-col
                        v-for="(subItem) in item.subMenu"
                        :key="subItem.title"
                        cols="auto toEnableJustifyInRow"
                        role="menuitem"
                      >
                        <div
                          v-if="subItem.subMenu"
                          class="_mega-menu"
                        >
                          <v-row class="flex flex-column">
                            <v-col
                              class="font-weight-bold pa-1 pb-5"
                              align="start"
                              aria-label="level 2 menu title"
                            >
                              {{ subItem.title }}
                            </v-col>
                            <v-col
                              v-for="(thirdLevelItem) in subItem.subMenu"
                              :key="thirdLevelItem.title"
                              align="start"
                              class="pa-1"
                            >
                              <nuxt-link
                                :to="thirdLevelItem.to ? localePath(thirdLevelItem.to) : '#'"
                                aria-label="`level 3 menu item ${thirdLevelItem.title}"
                                @click="handleMenuClick"
                              >
                                {{ thirdLevelItem.title }}
                              </nuxt-link>
                            </v-col>
                          </v-row>
                        </div>
                        <v-row v-else>
                          <v-col>
                            <nuxt-link
                              :to="subItem.to ? localePath(subItem.to) : '#'"
                              :aria-label="`level 2 menu item ${subItem.title}`"
                              role="link"
                              tabindex="0"
                              @click="handleMenuClick"
                            >
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
                :aria-label="`top menu item ${item.title}`"
                role="link"
                tabindex="0"
                @mouseenter="hoverMenu(index)"
              >
                {{ item.title || 'Untitled' }}
              </nuxt-link>
            </v-col>
          </v-row>
        </v-container>

        <v-spacer />

        <nuxt-link :to="localePath(RoutePathKeys.informed)">
          <v-btn
            :style="{ textTransform: 'none' }"
            :aria-label="t('aria.label.landing.informed')"
            @mouseenter="hoverMenu(null)"
          >
            {{ t('menu.informed') }}
            <v-icon style="margin-left: 8px;">
              mdi-bank
            </v-icon>
          </v-btn>
        </nuxt-link>
      </template>

      <v-app-bar-nav-icon
        v-if="mobile"
        aria-label="Toggle Navigation Drawer"
        @click.stop="drawer = !drawer"
      />

      <v-menu>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-translate"
            variant="text"
            :aria-label="t('aria.label.language')"
            @mouseenter="hoverMenu(null)"
          >
            {{ locale }}
          </v-btn>
        </template>
        <v-list role="menu">
          <v-list-item
            v-for="(lang) in availableLocales"
            :key="lang.code"
            role="menuitem"
            :aria-label="lang.name"
            @click="switchLanguage(lang.code)"
          >
            <v-list-item-title>
              {{ lang.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      aria-label="Mobile Navigation Drawer"
      role="navigation"
      :location="smAndDown ? 'left' : undefined"
      mini-variant
      fixed
      app
    >
      <v-list
        nav
        dense
      >
        <v-list-item to="/">
          <v-icon>mdi-home</v-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <template
          v-for="(item, index) in translatedItems"
          :key="`item-${index}`"
        >
          <v-list-group
            v-if="item.subMenu && item.subMenu.length"
            :value="expandedItems[item.title]"
            @click="() => { expandedItems.value[item.title] = !expandedItems.value[item.title] }"
          >
            <template #activator="{ props }">
              <v-list-item v-bind="props">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>

            <template
              v-for="(subItem, subIndex) in item.subMenu"
              :key="`subItem-${index}-${subIndex}`"
            >
              <v-list-group
                v-if="subItem.subMenu && subItem.subMenu.length"
                :value="expandedItems[subItem.title]"
                @click="() => { expandedSubItems.value[item.title] = !expandedSubItems.value[item.title] }"
              >
                <template #activator="{ props }">
                  <v-list-item v-bind="props">
                    <v-list-item-title>{{ subItem.title }}</v-list-item-title>
                  </v-list-item>
                </template>

                <v-list-item
                  v-for="(subSubItem, subSubIndex) in subItem.subMenu"
                  :key="`subSubItem-${index}-${subIndex}-${subSubIndex}`"
                  @click="handleNavigation(subSubItem.to)"
                >
                  <v-list-item-title>{{ subSubItem.title }}</v-list-item-title>
                </v-list-item>
              </v-list-group>

              <v-list-item
                v-else
                @click="handleNavigation(subItem.to)"
              >
                <v-list-item-title>{{ subItem.title }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-list-group>

          <v-list-item
            v-else
            @click="handleNavigation(item.to)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main class="main-content">
      <slot />
    </v-main>
    <footer>
      <v-container fluid>
        <v-row class="d-flex justify-space-between">
          <v-col cols="auto">
            <nuxt-link
              class="pa-2"
              :to="localePath(RoutePathKeys.courtContacts)"
              aria-label="Contact"
            >
              {{ t('menu.footer.contact') }}
            </nuxt-link>
            <nuxt-link
              class="pa-2"
              :to="localePath(RoutePathKeys.legalDisclaimer)"
              aria-label="Legal Disclaimer"
            >
              {{ t('menu.footer.disclaimer') }}
            </nuxt-link>
            <a
              href="https://www.const-court.be/public/"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="t('aria.label.menu.footer.documentenserver')"
              aria-describedby="tooltiptext"
              class="pa-2"
            >
              {{ t('menu.footer.documents-download') }}
            </a>

            <nuxt-link
              class="pa-2"
              :to="localePath(RoutePathKeys.privacyPolicy)"
              aria-label="Privacy Policy"
            >
              {{ t('menu.footer.term-of-use-privacy-policy2') }}
            </nuxt-link>
          </v-col>
          <v-col cols="auto">
            <div class="d-flex align-center">
              <span class="mr-2">{{ t('menu.footer.twitter') }}</span>
              <nuxt-link
                to="https://x.com/ConstCourtBE"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="t('aria.label.landing.twitter')"
                class="mr-2"
              >
                <img
                  src="~/assets/img/twitter.svg"
                  :style="{ width: '32px', height: '32px' }"
                  alt="Twitter"
                >
              </nuxt-link>
              <nuxt-link
                to="https://www.linkedin.com/company/const-court-be"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="t('aria.label.landing.linkedin')"
              >
                <img
                  src="~/assets/img/linkedin.svg"
                  :style="{ width: '32px', height: '32px' }"
                  alt="LinkedIn"
                >
              </nuxt-link>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </footer>
  </v-app>
</template>

<style lang="scss">
h1 {
  color: $logoColor;
      font-weight: 600;
      font-size: 1rem;
      font-family: 'Tiempos Headline';
      margin-left: 16px;
}
</style>
