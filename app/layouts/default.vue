<script setup lang="ts">
import { ref, useTemplateRef, onMounted } from 'vue'
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
  transform: (data) => {
    return applyTranslationToTitles(data)
  },
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
</script>

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
        <template
          v-for="(item, index) in courtItems"
          :key="index"
        >
          <nuxt-link
            v-if="item.to"
            :to="localePath(item.to)"
          >
            <v-btn class="menu-button">
              {{ item.title || 'Untitled' }}
            </v-btn>
          </nuxt-link>
          <v-menu v-else>
            <!-- top level menu -->
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                class="menu-button"
              >
                {{ item.title }}
                <div
                  v-if="item.subMenu"
                />
              </v-btn>
            </template>
            <!-- sublevel menu's recursive component -->
            <recursive-menu
              v-if="item.subMenu && item.subMenu.length"
              :items="item.subMenu"
            />
          </v-menu>
        </template>
        <v-spacer />

        <nuxt-link
          :to="localePath(RoutePathKeys.informed)"
        >
          <v-btn class="menu-button">
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

<style lang="scss">
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
