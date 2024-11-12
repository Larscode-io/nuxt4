<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import type { VAppBar } from 'vuetify/components'
import { useLanguage } from '@/composables/useLanguage'

import ogImageUrl from '~/assets/img/ogImage.jpg'

import { useNuxtApp } from '#app'

const { t, locale, availableLocales, switchLanguage, localePath } = useLanguage()
useSeoMeta({
  title: t('general.message.consts-court'),
  description: t('general.banner'),
  lang: locale,
  icon: '/favicon.ico',
  ogUrl: 'https://www.const-court.be/',
  ogType: 'website',
  ogTitle: t('general.message.consts-court'),
  ogDescription: t('general.banner'),
  ogImage: ogImageUrl,
})
useHead({
  htmlAttrs: {
    lang: locale.value,
  },
})

const drawer = ref(false)
const menuHeight = ref(0)
const { data: courtItems } = await useFetch('/api/menu')

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
const h = useTemplateRef('appBarRef')
provide('menuHeight', menuHeight)

const isLoading = ref(false)

const nuxtApp = useNuxtApp()

nuxtApp.hook('page:start', () => {
  isLoading.value = true
})

nuxtApp.hook('page:finish', () => {
  isLoading.value = false
})
</script>

<template>
  <v-app>
    <v-app-bar
      ref="appBarRef"
      :elevation="5"
      height="80"
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
          <!-- when the item has a to link, that means it's a direct link so we use nuxt-link -->
          <nuxt-link
            v-if="item.to"
            :to="localePath(item.to)"
          >
            <v-btn style="text-transform: none;">
              {{ t(item.title) }}
            </v-btn>
          </nuxt-link>
          <!-- else we have more subMenus so we add a new menu and recursively call this component  -->
          <v-menu v-else>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                style="text-transform: none;"
              >
                {{ t(item.title) }}
              </v-btn>
            </template>
            <!-- items in the subMenu are recursively displayed because it can have more subMenus -->
            <recursive-menu
              v-if="item.subMenu"
              :items="item.subMenu"
            />
          </v-menu>
        </template>

        <v-spacer />

        <v-btn
          icon="mdi-magnify"
          variant="text"
        />
        <v-btn
          icon="mdi-bank"
          variant="text"
        />
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

    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
      temporary
    >
      <v-list :items="drawerItems" />
    </v-navigation-drawer>

    <v-main class="main-content">
      <v-overlay
        :model-value="isLoading"
        class="align-center justify-center"
      >
        <v-progress-circular
          indeterminate
          size="64"
        />
      </v-overlay>

      <NuxtPage />
    </v-main>
  </v-app>
</template>

<style lang="scss">
.main-content {
  min-height: calc(100vh - 80px);
  /* Based on the height of app bar */
  padding-bottom: 190px;
  /* Add some padding at the bottom so the Sidebar can highlight also the last item */
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
</style>
