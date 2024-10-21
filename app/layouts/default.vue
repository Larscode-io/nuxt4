<script setup lang="ts">
import { ref, watch } from 'vue';

import { useRouter } from 'vue-router';
const router = useRouter();

import { useLanguage } from '@/composables/useLanguage';
const { t, locale, switchLocalePath, availableLocales, switchLanguage, localePath } = useLanguage();


const drawer = ref(false);



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
]);

</script>

<template>
  <v-card>
    <v-layout>
      <v-app-bar color="primary" prominent>

        <nuxt-link :to="localePath('/')">
          <v-btn>
            <v-toolbar-title>{{ t('general.message.consts-court') }}</v-toolbar-title>
          </v-btn>
        </nuxt-link>

        <v-spacer></v-spacer>

        <template v-if="$vuetify.display.mdAndUp">

          <v-menu v-for="(item, index) in courtItems" :key="index">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" text>{{ t(item.title) }}</v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(subItem, subIndex) in item.subMenu" :key="subIndex">
                <v-list-item-title>{{ t(subItem.title) }}</v-list-item-title>
                <v-list v-if="subItem.subMenu">
                  <v-list-item v-for="(subSubItem, subSubIndex) in subItem.subMenu" :key="subSubIndex">
                    <v-list-item-title>{{ t(subSubItem.title) }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" text>{{ topNavItems[1].title }}</v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>Submenu 2.1</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Submenu 2.2</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu> -->

          <nuxt-link :to="localePath('demo-mailman')">
            <v-btn>Newsletter</v-btn>
          </nuxt-link>
          <nuxt-link :to="localePath('demo-languages')">
            <v-btn>Languages</v-btn>
          </nuxt-link>
          <nuxt-link :to="localePath('auth-login')">
            <v-btn>CSAM</v-btn>
          </nuxt-link>
          <v-btn icon="mdi-magnify" variant="text"></v-btn>
          <v-btn icon="mdi-bank" variant="text"> </v-btn>
        </template>

        <v-app-bar-nav-icon v-if="$vuetify.display.mobile" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-translate" variant="text">{{ locale }}</v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(lang) in availableLocales" :key="lang.code" @click="switchLanguage(lang.code)">
              <v-list-item-title>{{ lang.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined" temporary>
        <v-list :items="drawerItems"></v-list>
      </v-navigation-drawer>

      <v-main>
        <NuxtPage />
        <v-card-text> The navigation drawer will appear from the bottom on smaller size screens. </v-card-text>
      </v-main>
    </v-layout>
  </v-card>
</template>



<style scoped></style>
