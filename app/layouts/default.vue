<!-- -------------------------------------------------------------------------------- -->
    <!-- DON'T ADD MENU ITEMS IN THIS FILE. -->
<!-- Instead add the title and to properties in the server/api/menu/index.ts file.  -->
<!-- The menu items will be automatically generated from that file. -->
<!-- -------------------------------------------------------------------------------- -->

<script setup lang="ts">
import { ref, useTemplateRef, onMounted, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
import type { CourtItem } from '@core/constants'
import { RoutePathKeys } from '@core/constants'

const { locales, locale } = useI18n()

const route = useRoute()
const { t, ogLocaleAlternate, ogLocale, availableLocales, switchLanguage, switchLocalePath } = useLanguage()
const localePath = useLocalePath()
const description = computed(() => t('general.banner'))
const ogTitle = computed(() => t('general.message.consts-court'))

const config = useRuntimeConfig()
const baseUrl = config.public.apiBaseUrl
const ogImage = `${baseUrl}/img/ogImage.jpg`
const ogUrl = `${baseUrl}${route.fullPath}`.replace(/\/+$/, '')
console.log('OG image:', ogImage)
console.log('OG image:', ogImage)
console.log('OG image:', ogImage)
console.log('OG image:', ogImage)
console.log('OG image:', ogImage)

useSeoMeta({
  ogUrl,
  ogTitle,
  ogImage,
  ogLocale,
  description,
  ogType: 'website',
  ogLocaleAlternate,
  ogDescription: description,
})

const namesByLocale = {
  nl: 'Grondwettelijk Hof',
  fr: 'Cour constitutionnelle',
  de: 'Verfassungsgerichtshof',
  en: 'Constitutional Court',
}

const alternateNames = Object.entries(namesByLocale)
  .filter(([code]) => code !== locale.value)
  .map(([, name]) => name)

useHead({
  htmlAttrs: { lang: locale.value },
  link: [
    ...locales.value.map(l => ({
      rel: 'alternate',
      hreflang: l.language,
      href: `https://www.const-court.be${switchLocalePath(l.code)}`,
    })),
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: 'https://www.const-court.be/',
    },
    {
      rel: 'canonical',
      href: `https://www.const-court.be${route.fullPath}`,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'GovernmentOrganization',
        'name': namesByLocale[locale.value],
        'alternateName': alternateNames, // andere talen
        'url': `https://www.const-court.be${route.fullPath}`,
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': 'BE',
        },
        'inLanguage': locale.value,
      }),
    },
  ],
})

const mobileDrawer = ref(false)

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

const isHydrated = ref(false)

onMounted(() => {
  if (h.value) {
    menuHeight.value = Number(h.value.height) || 40
  }
  isHydrated.value = true
})
const menuHeight = ref(0)
const h = useTemplateRef('appBarRef')
provide('menuHeight', menuHeight)

const hoveredMenu = ref<number | null>(null)

function hoverMainMenu(index: number | null): void {
  hoveredMenu.value = index
  // Close the mobile drawer if it is open
  if (mobileDrawer.value) {
    mobileDrawer.value = false
  }
}
function closeMenu() {
  hoveredMenu.value = null
}

function handleMenuClick() {
  closeMenu()
  toggleMenu()
  // Close the mobile drawer if it is open
  if (mobileDrawer.value) {
    mobileDrawer.value = false
  }
}

function toggleMenu() {
  hoveredMenu.value = hoveredMenu.value === null ? 0 : null
}

function changeLanguage(lang: string) {
  if (lang !== locale.value) {
    const x = switchLanguage(lang)
    navigateTo(x)
    mobileDrawer.value = false
  }
}
const { lgAndUp, mdAndUp, smAndDown } = useDisplay()

watch(smAndDown, (value) => {
  if (isHydrated.value && !value) {
    mobileDrawer.value = false
  }
})
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
          <v-img
            src="~/assets/icons/fed.svg"
            aspect-ratio="1"
            class="ml-2"
            width="64"
            height="64"
            alt="Logo"
            @click="hoverMainMenu(null)"
            @mouseenter="hoverMainMenu(null)"
          />
        </button>
      </nuxt-link>
      <h1 :aria-label="t('aria.label.menu.homelink')">
        {{ t('general.message.consts-court') }}
      </h1>

      <ClientOnly>
        <template v-if="isHydrated && mdAndUp">
          <v-container
            style="width: auto; max-width: 100%;"
            class="auto-width"
          >
            <v-row
              class="justify-center align-center"
              role="menu"
            >
              <v-col
                v-for="(item, index) in translatedItems"
                :key="item.title"
                class="position-relative"
                cols="auto"
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
                  @mouseenter="hoverMainMenu(index)"
                  @click="toggleMenu"
                >
                  {{ item.title }}
                  <div
                    v-if="hoveredMenu === index && item.subMenu"
                    :id="`submenu-${index}`"
                    class="position-fixed left-0 right-0 bg-white elevation-2 pa-2"
                    :style="{ top: `${menuHeight}px` }"
                    @mouseleave="hoverMainMenu(null)"
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
                  @mouseenter="hoverMainMenu(index)"
                >
                  {{ item.title || 'Untitled' }}
                </nuxt-link>
              </v-col>
            </v-row>
          </v-container>
        </template>
      </ClientOnly>
      <div style="margin-left: auto">
        <ClientOnly>
          <nuxt-link
            v-if="isHydrated && lgAndUp"
            :to="localePath(RoutePathKeys.informed) || '#'"
          >
            <v-btn
              :style="{ textTransform: 'none' }"
              :aria-label="t('aria.label.landing.informed')"
              @mouseenter="hoverMainMenu(null)"
            >
              {{ t('menu.informed') }}
              <v-icon style="margin-left: 8px;">
                mdi-bank
              </v-icon>
            </v-btn>
          </nuxt-link>
          <v-app-bar-nav-icon
            v-if="isHydrated && !mdAndUp"
            aria-label="Toggle Navigation Drawer"
            @click.stop="mobileDrawer= !mobileDrawer"
          />
        </ClientOnly>

        <v-menu>
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-translate"
              variant="text"
              :aria-label="t('aria.label.language')"
              @mouseenter="hoverMainMenu(null)"
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
              @click="changeLanguage(lang.code)"
            >
              <v-list-item-title>
                {{ lang.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- -------------------------------------------------------------------------------- -->
    <!-- DON'T ADD MENU ITEMS IN THIS FILE. -->
    <!-- Instead add the title and to properties in the server/api/menu/index.ts file.  -->
    <!-- The menu items will be automatically generated from that file. -->
    <!-- -------------------------------------------------------------------------------- -->
    <v-navigation-drawer
      v-model="mobileDrawer"
      aria-label="Mobile Navigation Drawer"
      role="navigation"
      fixed
      app
      color="indigo"
      mobile
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
            ripple
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
                ripple
              >
                <template #activator="{ props }">
                  <v-list-item v-bind="props">
                    <v-list-item-title>{{ subItem.title }}</v-list-item-title>
                  </v-list-item>
                </template>

                <v-list-item
                  v-for="(subSubItem, subSubIndex) in subItem.subMenu"
                  :key="`subSubItem-${index}-${subIndex}-${subSubIndex}`"
                >
                  <nuxt-link
                    :to="subSubItem.to ? localePath(subSubItem.to) : '#'"
                    aria-label="subSubItem.title"
                  >
                    <v-list-item-title color="white">
                      {{ subSubItem.title }}
                    </v-list-item-title>
                  </nuxt-link>
                </v-list-item>
              </v-list-group>

              <nuxt-link
                v-else
                :to="subItem.to ? localePath(subItem.to) : '#'"
                aria-label="subItem.title"
              >
                <v-list-item>
                  <v-list-item-title>{{ subItem.title }}</v-list-item-title>
                </v-list-item>
              </nuxt-link>
            </template>
          </v-list-group>

          <nuxt-link
            v-else
            :to="item.to ? localePath(item.to) : '#'"
            aria-label="item.title"
          >
            <v-list-item>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </nuxt-link>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main class="main-content">
      <slot />
    </v-main>
    <footer>
      <v-container fluid>
        <v-row
          class="align-center justify-space-between pa-6"
        >
          <v-col cols="auto">
            <nuxt-link
              class="pr-10 pl-10"
              :to="localePath(RoutePathKeys.courtContacts) || '#'"
              aria-label="Contact"
            >
              {{ t('menu.footer.contact') }}
            </nuxt-link>
            <nuxt-link
              class="pr-10"
              :to="localePath(RoutePathKeys.legalDisclaimer) || '#'"
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
              class="pl-10"
              :to="localePath(RoutePathKeys.privacyPolicy) || '#'"
              aria-label="Privacy Policy"
            >
              {{ t('menu.footer.term-of-use-privacy-policy2') }}
            </nuxt-link>
          </v-col>
          <v-col cols="auto">
            <div class="d-flex align-center pr-10">
              <span class="mr-2">{{ t('menu.footer.twitter') }}</span>
              <nuxt-link
                to="https://www.linkedin.com/company/const-court-be"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="t('aria.label.landing.linkedin')"
              >
                <img
                  src="~/assets/img/linkedin.svg"
                  :style="{ width: '32px', height: '32px' }"
                  class="ml-2"
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

// make mobile drawer text white
a {
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
