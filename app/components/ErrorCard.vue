<template>
  <div class="container">
    <v-row
      class="d-flex"
      align="center"
      justify="center"
    >
      <div
        v-if="statusCode === 404"
        class="col-12 col-md-6"
      >
        <img :src="require('~/assets/img/error-illustration.svg')">
      </div>
      <div :class="klass">
        <h1
          v-if="statusCode === 404"
          class="heading-h1"
        >
          {{ $t(i18nKeys.error.pageNotFound) }}
        </h1>
        <p class="error-description">
          {{ $t(i18nKeys.error.loadingPage) }}
        </p>
        <p class="error-description error-description__technical-code">
          <small> Error: {{ message }} </small>
        </p>
        <v-row
          class="d-flex"
          align="center"
          justify="center"
        >
          <button
            v-if="showRefresh"
            class="button-style full"
            @click="refresh()"
          >
            {{ $t(i18nKeys.general.refresh) }}
          </button>
          <nuxt-link
            v-if="showGoHome"
            class="button-style empty"
            :to="localePath(routePathKeys.home)"
          >
            {{ $t(i18nKeys.general.goHome) }}
          </nuxt-link>
        </v-row>
      </div>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import { RoutePathKeys } from '~~/app/core/constants'

const { t, localePath } = useLanguage()
const route = useRoute()

const props = defineProps({
  error: {
    type: Object, required: false, default: () => ({ message: 'hello' }),
  },
  message: { type: String, required: false, default: '' },
  showRefresh: { type: Boolean, default: true },
  showGoHome: { type: Boolean, default: true },
})

const i18nKeys = {
  error: {
    pageNotFound: 'error.pageNotFound',
    loadingPage: 'error.loadingPage',
  },
  general: {
    refresh: 'general.refresh',
    goHome: 'general.goHome',
  },
}

const statusCode = computed(() => props.error?.statusCode)
const klass = computed(() => statusCode.value === 404 ? 'col-12 col-md-6' : 'col-12 col-md-12')

function refresh() {
  if (window && window.location) {
    window.location.reload()
  }
}
</script>

<style lang="scss">
.error-description {
  padding: 40px 0;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;

  &__technical-code {
    padding: 0;
    font-size: 16px;
    font-weight: 300;
  }
}

.button-style {
  padding: 10px 40px;
  font-size: 1rem;
  line-height: 20px;
  font-weight: 600;
  margin-right: 32px;
  text-decoration: none;
}

.full {
  background: $indigo;
  color: white !important;
}

.empty {
  background: white;
  border: 2px solid $indigo;
  color: $indigo;
}
</style>
