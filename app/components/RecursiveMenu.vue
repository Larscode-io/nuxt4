<template>
  <v-list v-if="items">
    <v-list-item v-for="(item, index) in items" :key="index" :to="item.to">
      <!-- we have a to link so no more subMenu, we activate the link directly -->
      <nuxt-link v-if="item.to" :to="localePath(item.to)">
        <v-list-item-title v-if="item.to">{{ t(item.title) }}</v-list-item-title>
      </nuxt-link>
      <!-- else we have a subMenu so we add a new menu and recursively call this component  -->
      <v-menu v-else>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" elevation="0">{{ t(item.title) }}</v-btn>
        </template>
        <recursive-menu :items="item.subMenu" />
      </v-menu>
    </v-list-item>
  </v-list>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  }
});
import { useLanguage } from '@/composables/useLanguage';
const { t, localePath } = useLanguage();
</script>