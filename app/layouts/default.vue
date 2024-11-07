<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'

import ogImageUrl from '~/assets/img/ogImage.jpg'

const { t, locale, switchLocalePath, availableLocales, switchLanguage, localePath } = useLanguage()
useSeoMeta({
  title: t('general.message.consts-court'),
  description: t('general.banner'),
  ogUrl: 'https://www.const-court.be/',
  ogType: 'website',
  ogTitle: t('general.message.consts-court'),
  ogDescription: t('general.banner'),
  ogImage: ogImageUrl,
})
const router = useRouter()

const config = useRuntimeConfig()
const baseURL = config.app.baseURL || '/' // Default to '/' if baseURL is not set

const drawer = ref(false)

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
</script>

<template>
  <v-app>
    <v-container
      class="pa-0"
      fluid
    >
      <v-app-bar
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
          <v-menu
            v-for="(item, index) in courtItems"
            :key="index"
          >
            <template #activator="{ on, props }">
              <!-- if only one item without subMenu, we activate the link directly -->
              <template v-if="item.to">
                <nuxt-link :to="localePath(item.to)">
                  <v-btn
                    v-bind="props"
                    text
                  >
                    {{ t(item.title) }}
                  </v-btn>
                </nuxt-link>
              </template>
              <!-- if there is a subMenu, we activate the menu -->
              <template v-else>
                <v-btn
                  v-bind="props"
                  text
                >
                  {{ t(item.title) }}
                </v-btn>
              </template>
            </template>
            <recursive-menu
              v-if="item.subMenu"
              :items="item.subMenu"
            />
          </v-menu>

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
              <v-list-item-title>{{ lang.name }}</v-list-item-title>
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

      <v-main>
        <NuxtPage />
      </v-main>
    </v-container>
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
