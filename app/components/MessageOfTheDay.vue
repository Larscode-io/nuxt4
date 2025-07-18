<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import { RoutePathKeys } from '@core/constants'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const dismissedMessageIds = ref<string[]>([])
const dismissedCookie = useCookie<string[]>('dismissedMessages', { default: () => [] })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messages = ref<any[]>([])
const messagesToShow = computed(() => {
  return messages.value.filter((msg) => !isDismissed(msg.id))
})
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
  <div aria-live="polite">
    <div
      v-for="msg in messagesToShow"
      :id="`message-${msg.id}`"
      :key="msg.id"
      class="ma-2 pa-4 rounded-lg elevation-1 text-blue-700"
      style="min-width: 280px; flex: 1 1 300px; background-color: #f5f8fb; display: flex; flex-direction: column; justify-content: space-between; position: relative;"
    >
      <!-- Dismiss button -->
      <button
        aria-label="Close"
        class="btn btn-close"
        style="position: absolute; top: 5px; right: 5px; font-size: 16px; cursor: pointer; background: none; border: none;"
        @click="dismissMessage(msg.id)"
      >
        <v-icon>mdi-close</v-icon>
      </button>

      <!-- Top: image/icon and title -->
      <div class="d-flex align-start mb-2">
        <div class="mr-3">
          <v-icon
            v-if="msg.icon && !msg.image"
            color="#043c72"
            large
            class="mt-1"
          >
            {{ msg.icon }}
          </v-icon>
          <img
            v-else-if="msg.image"
            :src="msg.image"
            alt="image icon"
            style="width: 40px; height: 40px; object-fit: contain;"
          >
        </div>
        <div>
          <h3 class="mb-1" style="color: #043c72; font-size: 1.5rem; font-weight: 500;">
            {{ msg.title }}
          </h3>
        </div>
      </div>

      <!-- Middle: content -->
      <p class="mb-4" style="color: #043c72; font-size: 1.2rem;">
        {{ msg.content }}
      </p>

      <!-- Bottom: link or PDF -->
      <div>
        <div v-if="msg.link">
          <v-hover v-slot="{ hover }">
            <nuxt-link
              v-if="isInternalLink(msg.link)"
              :to="msg.link"
              class="text-decoration-none font-weight-medium"
              style="color: #043c72;"
            >
              <div class="d-inline-flex align-center">
                {{ t('general.message.readMore') }}
                <v-icon :class="hover ? 'ml-2' : 'ml-1'" style="color: #043c72;">mdi-arrow-right</v-icon>
              </div>
            </nuxt-link>

            <a
              v-else
              :href="msg.link"
              target="_blank"
              rel="noopener"
              class="text-decoration-none font-weight-medium"
              style="color: #043c72;"
            >
              <div class="d-inline-flex align-center">
                {{ t('general.message.readMore') }}
                <v-icon :class="hover ? 'ml-2' : 'ml-1'" style="color: #043c72;">mdi-arrow-right</v-icon>
              </div>
            </a>
          </v-hover>
        </div>

        <div v-else-if="msg.pdf" class="mt-2">
          <v-hover v-slot="{ hover }">
            <a
              :href="msg.pdf"
              target="_blank"
              rel="noopener"
              class="text-decoration-none font-weight-medium"
              style="color: #043c72;"
            >
              <div class="d-inline-flex align-center">
                {{ t('general.message.readMore') }}
                <v-icon :class="hover ? 'ml-2' : 'ml-1'" style="color: #043c72;">mdi-arrow-right</v-icon>
              </div>
            </a>
          </v-hover>
        </div>
      <!-- bottom link -->
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
