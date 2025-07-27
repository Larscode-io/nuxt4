<script setup lang="ts">
const i18nRedirected = useCookie<string | null>('i18n_redirected')
const gdprAccepted = useCookie<string | null>('GDPR:accepted')
const dismissedMessages = useCookie<string | null>('dismissedMessages')

// optioneel: migratie-flags tonen?
const gdprMigrated = useCookie<string | null>('GDPR:migrated')
const i18nMigrated = useCookie<string | null>('i18n:migrated')

const show = computed(() => {
  return i18nRedirected.value || gdprAccepted.value || dismissedMessages.value || gdprMigrated.value || i18nMigrated.value
})
</script>

<template>
  <div v-if="show" class="fixed bottom-0 right-0 bg-white text-black shadow-lg p-4 text-sm z-50 max-w-xs border border-gray-200 rounded">
    <h3 class="font-bold mb-2">🍪 Cookie Debug</h3>
    <ul class="space-y-1">
      <li><strong>i18n_redirected:</strong> {{ i18nRedirected ?? '(niet gezet)' }}</li>
      <li><strong>GDPR:accepted:</strong> {{ gdprAccepted ?? '(niet gezet)' }}</li>
      <li><strong>dismissedMessages:</strong> {{ dismissedMessages ?? '(niet gezet)' }}</li>
      <li><strong>GDPR:migrated:</strong> {{ gdprMigrated ?? '(niet gezet)' }}</li>
      <li><strong>i18n:migrated:</strong> {{ i18nMigrated ?? '(niet gezet)' }}</li>
    </ul>
  </div>
</template>
