<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import { RoutePathKeys } from '@core/constants'
import { useCookie } from '#app'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const dismissedMessageIds = ref<string[]>([])
const dismissedCookie = useCookie<string[]>('dismissedMessages', { default: () => [] })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messages = ref<any[]>([])

function isInternalLink(link: string) {
  return typeof link === 'string' && link.startsWith('/')
}

function isDismissed(id: string) {
  return dismissedMessageIds.value.includes(id)
}

function accessLinkUrl(x) {
  const label = typeof x === 'string' ? x : x[locale]
  return label ? x[locale] : ''
}

function dismissMessage(id: string) {
  if (!isDismissed(id)) {
    dismissedMessageIds.value.push(id)
    dismissedCookie.value = dismissedMessageIds.value
  }
}

onMounted(() => {
  const now = new Date()
  messages.value = [
    { id: 'motd-2',
      title: t('motd.video.title'),
      content: t('motd.video.description'),
      link: localePath(RoutePathKeys?.mediaVideopresentaties),
      image: new URL('~/assets/img/prize/40.png', import.meta.url).href,
      expiresAt: '2025-08-30T23:59:59',
    },
    {
      id: 'motd-1',
      title: t('motd.accessibility.title'),
      content: t('motd.accessibility.description1'),
      link: accessLinkUrl({
        [Languages.DUTCH]: 'https://www.beliris.be/nl/projecten/koningsplein.html',
        [Languages.FRENCH]: 'https://www.beliris.be/fr/projets/place-royale.html',
        [Languages.GERMAN]: 'https://www.beliris.be/nl/projecten/koningsplein.html',
        [Languages.ENGLISH]: 'https://www.beliris.be/fr/projets/place-royale.html',
      }),
      icon: 'mdi-crane',
      expiresAt: '2026-08-30T23:59:59',
    },
  ].filter((msg) => !msg.expiresAt || new Date(msg.expiresAt) > now)

  dismissedMessageIds.value = Array.isArray(dismissedCookie.value) ? dismissedCookie.value : []
})
</script>

<template>
  <div
    class="pa-4"
    aria-live="polite"
  >
    <div
      v-for="msg in messages"
      :key="msg.id"
      class="ma-2 pa-4 rounded-lg elevation-1 bg-blue-100 text-blue-700 d-flex flex-column position-relative"
    >
      <button
        class="btn btn-icon position-absolute top-0 right-0 mt-2 mr-2"
        aria-label="Close"
        @click="dismissMessage(msg.id)"
      >
        <v-icon>mdi-close</v-icon>
      </button>

      <div class="d-flex align-start mb-2">
        <v-icon
          v-if="msg.icon && !msg.image"
          color="#043c72"
          size="40"
          class="mt-1 mr-3"
        >
          {{ msg.icon }}
        </v-icon>
        <img
          v-else-if="msg.image"
          :src="msg.image"
          alt=""
          class="rounded-lg mr-3"
          height="40"
        >
        <div>
          <h3 class="text-h6 font-weight-semibold mb-1">
            {{ msg.title }}
          </h3>
          <p class="text-body-1 mb-0">
            {{ msg.content }}
          </p>
        </div>
      </div>

      <div
        v-if="msg.link"
        class="mt-2"
      >
        <v-hover
          v-if="msg.link"
          v-slot="{ isHovering }"
        >
          <nuxt-link
            v-if="isInternalLink(msg.link)"
            :to="msg.link"
            class="text-primary font-weight-medium"
          >
            <div
              class="arrow-hover d-inline-flex align-center "
              style="color: #043c72;"
            >
              {{ t('general.message.read-more') }}
              <v-icon
                style="color: #043c72;"
                :class="{ 'ml-2': isHovering, 'ml-1': !isHovering }"
              >mdi-arrow-right</v-icon>
            </div>
          </nuxt-link>
          <a
            v-else
            :href="msg.link"
            target="_blank"
            rel="noopener"
            class="text-primary font-weight-medium d-inline-flex align-center"
          >
            {{ t('general.message.read-more') }}
            <v-icon :class="isHovering ? 'ml-2' : 'ml-1'">mdi-arrow-right</v-icon>
          </a>
        </v-hover>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.btn {
  cursor: pointer;
}
.btn:hover {
  transform: scale(1.2);
  transition: transform 0.2s ease;
}
</style>
