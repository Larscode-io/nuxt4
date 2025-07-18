<!-- -------------------------------------------------------------------------------- -->
    <!-- DON'T ADD MENU ITEMS IN THIS FILE. -->
<!-- Instead add the title and to properties in the server/api/menu/index.ts file.  -->
<!-- The menu items will be automatically generated from that file. -->
<!-- -------------------------------------------------------------------------------- -->

 <!--
The mobile navigation menu is built using component-based elements that ensure usability
for screen reader and keyboard users. Although the menu does not explicitly use ARIA roles
such as role="list" and role="listitem" due to framework limitations, its semantic structure
and interactive behavior are preserved. Navigation items are focusable, operable via keyboard,
and properly labeled. This implementation meets the accessibility requirements for perceivable
and operable content, even if some automated tools report minor formal issues.
 -->

<script setup lang="ts">
import { ref, useTemplateRef, onMounted, computed, watch, watchEffect } from 'vue'
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
const baseUrl = config.public.basePublicUrl
const ogImage = `${baseUrl}/img/ogImage.jpg`

// the full, canonical URL of the current page
// todo: check if it works without baseUrl (and drop useRuntimeConfig)
const ogUrl = `${baseUrl}${route.fullPath}`.replace(/\/+$/, '')

// todo: checks to do when we don't need /nuxt/ redirect on nginx anymore
// https://opengraph.dev/panel?url=https%3A%2F%2Fnuxt.const-court.be%2F
// https://metatags.io/?url=https%3A%2F%2Fnuxt.const-court.be%2F
// https://search.google.com/test/rich-results?url=https%3A%2F%2Fnuxt.const-court.be%2F
// https://www.linkedin.com/post-inspector/inspect/https:%2F%2Fnuxt.const-court.be%2F

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

const i18nHead = useLocaleHead()

const breadcrumbList = computed(() => {
  const pathWithoutLocale = route.fullPath.replace(/^\/(nl|fr|de|en)/, '')
  const entries = baseBreadcrumbMap[pathWithoutLocale]
  if (!entries) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.nameByLang[locale.value],
      item: `${baseUrl}/${locale.value}/${[...entries.slice(0, index + 1).map((e) => e.key)].filter(Boolean).join('/')}`
    }))
  }
})

watchEffect(() => {
  if (breadcrumbList.value) {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(breadcrumbList.value)
        }
      ]
    })
  }
})

const sameAsLinksByLocale = {
  nl: [
    'https://nl.wikipedia.org/wiki/Grondwettelijk_Hof_(Belgi%C3%AB)',
    'https://www.linkedin.com/company/constitutional-court-of-belgium/',
    'https://www.ejustice.just.fgov.be/cgi/rech.pl?language=nl&bron=Grondwettelijk+Hof&text1=arrest'
  ],
  fr: [
    'https://fr.wikipedia.org/wiki/Cour_constitutionnelle_(Belgique)',
    'https://www.linkedin.com/company/constitutional-court-of-belgium/',
    'https://www.ejustice.just.fgov.be/cgi/rech.pl?language=fr&bron=Cour+Constitutionnelle&text1=arret',
  ],
  de: [
    'https://de.wikipedia.org/wiki/Belgischer_Verfassungsgerichtshof',
    'https://www.linkedin.com/company/constitutional-court-of-belgium/',
    'https://www.ejustice.just.fgov.be/cgi/rech.pl?language=de&bron=Verfassungsgerichtshof&text1=Entscheide',
  ],
  en: [
    'https://en.wikipedia.org/wiki/Constitutional_Court_(Belgium)',
    'https://www.linkedin.com/company/constitutional-court-of-belgium/',
    'https://www.ejustice.just.fgov.be/cgi/rech.pl?language=fr&bron=Cour+Constitutionnelle&text1=arret',
  ],
}

watchEffect(() => {
  useHead({
    htmlAttrs: {
      lang: i18nHead.value.htmlAttrs!.lang,
    },
  })
})

// todo: technische SEO & AI-readiness checklist
useHead({
  meta: [
    // we have server/routes/robots.txt.ts so that will expose the
    // robots.txt file at /robots.txt we can remove the next line
    // { name: 'robots', content: 'noindex, nofollow' },
    { name: 'description', content: description.value ?? '' },
    { property: 'og:title', content: ogTitle.value ?? '' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: ogUrl ?? '' },
    { property: 'og:locale', content: ogLocale ?? '' },
    { property: 'og:locale:alternate', content: ogLocaleAlternate ?? [] },
    { property: 'og:description', content: description.value ?? '' },
    { property: 'og:image', content: ogImage ?? '' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:type', content: 'image/jpeg' },
  ],
  // hreflang:  “dit zijn dezelfde pagina’s in andere talen”
  // canonical: “deze URL is correct voor deze taal versie.”
  link: [
    ...locales.value.map((l) => ({
      rel: 'alternate',
      hreflang: l.language,
      href: `${baseUrl}${switchLocalePath(l.code)}`,
    })),
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${baseUrl}`
    },
    // added canonical link to prevent duplicate content issues
    // https://www.const-court.be/nuxt/ is the canonical URL for the site
    // this is needed because the site is served from /nuxt/ on nginx
    // todo:
    // when the site is served from the root, this can be removed❕❕❕❕❕❕
    // see https://opengraph.dev/ for testing
    // and https://metatags.io/ for testing
    {
      rel: 'canonical',
      // todo:
      // locale inside fullPath does not seem to be reactive
      // <link rel="canonical" href="https://nuxt.const-court.be/nl"> doesn't update with locale changes
      // maybe it doesn't need to be reactive?
      href: `${baseUrl}${route.fullPath}`,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${baseUrl}#website`,
        'url': `${baseUrl}`,
        'name': namesByLocale[locale.value],
        'inLanguage': i18nHead.value.htmlAttrs!.lang
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${ogUrl}#webpage`,
        'url': ogUrl,
        'name': ogTitle.value,
        'isPartOf': {
          '@id': `${baseUrl}#website`,
        },
        'inLanguage': i18nHead.value.htmlAttrs!.lang,
        'dateModified': new Date().toISOString().split('T')[0]
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': ['GovernmentOrganization', 'Courthouse', 'LegalService'],
        'name': namesByLocale[locale.value],
        'alternateName': alternateNames,
        'url': `${baseUrl}${route.fullPath}`,
        sameAs: [sameAsLinksByLocale[locale.value] || 'https://nl.wikipedia.org/wiki/Grondwettelijk_Hof_(Belgi%C3%AB)'],
        'logo': `${baseUrl}/img/logo.svg`,
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': 'BE',
          'postalCode': '1000',
          'streetAddress': t('contact.address-title'),
          'addressLocality': t('contact.address-locality')
        },
        'inLanguage': i18nHead.value.htmlAttrs!.lang,
        'areaServed': {
          '@type': 'Country',
          'name': 'Belgium'
        },
        'contactPoint': [
          {
            '@type': 'ContactPoint',
            'contactType': 'Informatie',
            'telephone': '+32-2-500-12-32',
            'email': 'griffie@const-court.be',
            'availableLanguage': [
              { '@type': 'Language', 'name': 'Dutch', 'alternateName': ['nl', 'Nederlands'] }
            ]
          },
          {
            '@type': 'ContactPoint',
            'contactType': 'Information',
            'telephone': '+32-2-500-12-33',
            'email': 'greffe@const-court.be',
            'availableLanguage': [
              { '@type': 'Language', 'name': 'French', 'alternateName': ['fr', 'Français'] }
            ]
          }
        ],
        'openingHoursSpecification': {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday'
          ],
          'opens': '09:00',
          'closes': '13:00'
        }
      }),
    },
  ],
})

const mobileDrawer = ref(false)

const { data: courtItems } = useFetch<CourtItem[]>('/api/menu', {
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
  if (appBarRef.value && appBarRef.value.$el) {
    menuHeight.value = Number(appBarRef.value.$el.offsetHeight) || 40
  }
  isHydrated.value = true
})
const menuHeight = ref(0)
const appBarRef = ref()
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
    try {
      const newLocalePath = switchLanguage(lang as Languages)
      navigateTo(newLocalePath)
      mobileDrawer.value = false
    }
    catch (error) {
      console.error('Error changing language:', error)
    }
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
    <nav aria-label="Main Navigation non-mobile">

      <v-app-bar
        ref="appBarRef"
        class="elevation-3"
        :height="130"
        aria-label="Main Navigation"
      >
        <nuxt-link
          class="mx-2 p-0 border-0 bg-transparent"
          aria-label="Home"
          :to="localePath('/')"
        >
          <v-img
            src="/img/fed.svg"
            aspect-ratio="1"
            class="ml-2"
            width="64"
            height="64"
            alt="Logo"
            @click="hoverMainMenu(null)"
            @mouseenter="hoverMainMenu(null)"
          />
        </nuxt-link>
        <h1 :aria-label="t('aria.label.menu.homelink')">
          {{ t('general.message.consts-court') }}
        </h1>

        <template v-if="isHydrated && mdAndUp">
          <v-container
            style="width: auto; max-width: 100%;"
            class="auto-width"
          >
            <ul class="d-flex pa-0 ma-0 list-none" style="list-style: none;">
              <li v-for="(item, index) in translatedItems" :key="item.title" class="px-2">
                <button
                  v-if="item.subMenu"
                  :id="`menu-${item.title}-level1`"
                  aria-haspopup="menu"
                  class="cursor-pointer position-relative"
                  :aria-label="toSlug(`${item.title}`)"
                  tabindex="0"
                  :aria-expanded="hoveredMenu === index"
                  :aria-controls="`menu-${item.title}-${index}`"
                  @mouseenter="hoverMainMenu(index)"
                  @click="toggleMenu"
                  @keydown.enter.prevent="toggleMenu"
                  @keydown.space.prevent="toggleMenu"
                >
                  {{ item.title }}
                  <div
                    v-if="hoveredMenu === index && item.subMenu"
                    class="position-fixed left-0 right-0 bg-white elevation-2 pa-2"
                    :style="{ top: `${menuHeight}px` }"
                    @mouseleave="hoverMainMenu(null)"
                  >
                    <v-container fluid>
                      <v-row
                        :aria-label="toSlug(`${item.title}`)"
                        class="d-flex flex-row justify-space-evenly"
                      >
                        <v-col
                          v-for="(subItem) in item.subMenu"
                          :key="subItem.title"
                          cols="auto toEnableJustifyInRow"
                        >
                          <div
                            v-if="subItem.subMenu"
                            class="_mega-menu"
                          >
                            <v-row class="flex flex-column">
                              <v-col class="align-start font-weight-bold pa-1 pb-5">
                                {{ subItem.title }}
                              </v-col>
                              <v-col
                                v-for="(thirdLevelItem) in subItem.subMenu"
                                :key="thirdLevelItem.title"
                                class="align-start pa-1"
                              >
                                <nuxt-link
                                  :to="thirdLevelItem.to ? localePath(thirdLevelItem.to) : '#'"
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
                                :aria-label="subItem.title"
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
                </button>
                <nuxt-link
                  v-else
                  :to="item.to ? localePath(item.to) : '#'"
                  :aria-label="toSlug(`${item.title}`)"
                  @mouseenter="hoverMainMenu(index)"
                  @focus="hoverMainMenu(index)"
                >
                  {{ item.title || 'Untitled' }}
                </nuxt-link>
              </li>
            </ul>
          </v-container>
        </template>
        <div style="margin-left: auto">
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
                <!-- WCAG: lang.name is not in the page locale, so we use lang.language for the HTML lang attribute -->
                <v-list-item-title :lang="lang.language">
                  {{ lang.code.toLocaleUpperCase() }} {{ lang.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-app-bar>
    </nav>

    <!--
      The mobile navigation menu is built using component-based elements that ensure usability
      for screen reader and keyboard users. Although the menu does not explicitly use ARIA roles
      such as role="list" and role="listitem" due to framework limitations, its semantic structure
      and interactive behavior are preserved. Navigation items are focusable, operable via keyboard,
      and properly labeled. This implementation meets the accessibility requirements for perceivable
      and operable content, even if some automated tools report minor formal issues.
    -->

    <v-navigation-drawer
      v-model="mobileDrawer"
      aria-label="Mobile Navigation Drawer"
      role="navigation"
      fixed
      app
      color="var(--indigo)"
      mobile
      class="text-white"
    >
      <v-list
        dense
        aria-label="Main MOBILE menu"
        role="list"
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
            :key="`level2group-${index}-x`"
            :raw-id="`mobileMenu1-${String(item.title)}-level2-${index}`"
            ripple
          >
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                :id="`v-list-group--id-mobileMenu1-${String(item.title)}-level2-${index}`"
                role="listitem"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>

            <template
              v-for="(subItem, subIndex) in item.subMenu"
              :key="`subItem-${index}-${subIndex}`"
            >
              <v-list-group
                v-if="subItem.subMenu && subItem.subMenu.length"
                :key="`level3group-${index}-${subIndex}`"
                :raw-id="`mobileMenu2-${String(item.title)}-${String(subItem.title)}-level3-${index}`"
                ripple
              >
                <template #activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    :id="`v-list-group--id-mobileMenu2-${String(item.title)}-${String(subItem.title)}-level3-${index}`"
                    role="listitem"
                  >
                    <v-list-item-title>{{ subItem.title }}</v-list-item-title>
                  </v-list-item>
                </template>

                <v-list-item
                  v-for="(subSubItem, subSubIndex) in subItem.subMenu"
                  :id="`mobileMenu3-${String(item.title)}-${String(subItem.title)}-${String(subSubItem.title)}-level4-${index}-${subIndex}`"
                  :key="`subSubItem-${index}-${subIndex}-${subSubIndex}`"
                  role="listitem"
                  :to="subSubItem.to ? localePath(subSubItem.to) : '#'"
                  :aria-label="subSubItem.title"
                >
                  <v-list-item-title color="white">
                    {{ subSubItem.title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list-group>

              <v-list-item
                v-else
                :to="subItem.to ? localePath(subItem.to) : '#'"
                :aria-label="subItem.title"
              >
                <v-list-item-title>{{ subItem.title }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-list-group>

          <v-list-item
            v-else
            :to="item.to ? localePath(item.to) : '#'"
            :aria-label="item.title"
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
        <v-row  class="align-center justify-space-between pa-6">
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
              aria-describedby="tooltip text"
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

ul.list-none {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
}
</style>
