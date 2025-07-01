<template>
  <v-locale-provider :locale="locale">
    <span class="sr-only" aria-live="polite">
      <!-- todo: dit moet nog i18nized worden -->
      <!-- todo: een useDate composable maken die de locale en i18n gebruikt ? -->
      {{ `Vandaag is ${weekDay(picker)}, ${formatDate(picker)}` }}
    </span>
    <v-date-picker
      v-model="picker"
      class="datePicker"
      :locale="locale"
      readonly
      aria-hidden="true"
      :title="'none'"
      @update:model-value="handleChange"
    />
  </v-locale-provider>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onBeforeUnmount } from 'vue'

const { t, locale } = useLanguage()

const picker = ref(new Date())
function weekDay(date) {
  return new Date(date).toLocaleDateString('nl-BE', { weekday: 'long' })
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })
}

const handleChange = (value) => {
  if (!value) return
  const dateObj = new Date(value)
  emit('change', dateObj)
}

onMounted(() => {
  // dit is een workaround om aria-labels toe te voegen aan de knoppen in de Vuetify date-picker
  // dit dat standaard niet heeft
  // een andere optie is aria-hidden="true" toevoegen aan de date-picker
  // en de datum te tonen in een sr-only element
  // const labelButtons = () => {
  //   // Set aria-label for mode button (year/month toggle)
  //   document.querySelectorAll('.v-date-picker-controls__mode-btn').forEach((btn) => {
  //     if (!btn.hasAttribute('aria-label') || !btn.getAttribute('aria-label')?.trim()) {
  //       const testId = btn.getAttribute('data-testid')
  //       if (testId === 'year-btn') {
  //         btn.setAttribute('aria-label', 'Switch between year and month view')
  //       } else {
  //         btn.setAttribute('aria-label', 'Toggle calendar mode') // fallback
  //       }
  //     }
  //   })
  //   // Set aria-label for month button
  //   document.querySelectorAll('.v-date-picker-controls__month-btn').forEach((btn) => {
  //     if (!btn.hasAttribute('aria-label') || !btn.getAttribute('aria-label')?.trim()) {
  //       btn.setAttribute('aria-label', 'Show month selection')
  //     }
  //   })
  //   // Set aria-label for prev-month button
  //   document.querySelectorAll('button[data-testid="prev-month"]').forEach((btn) => {
  //     if (!btn.hasAttribute('aria-label') || !btn.getAttribute('aria-label')?.trim()) {
  //       btn.setAttribute('aria-label', 'Previous month')
  //     }
  //   })
  //   // Set aria-label for next-month button
  //   document.querySelectorAll('button[data-testid="next-month"]').forEach((btn) => {
  //     if (!btn.hasAttribute('aria-label') || !btn.getAttribute('aria-label')?.trim()) {
  //       btn.setAttribute('aria-label', 'Next month')
  //     }
  //   })
  // }

  // labelButtons() // run immediately in case it's already rendered

  // const observer = new MutationObserver(() => labelButtons())
  // observer.observe(document.body, { childList: true, subtree: true })

  // onBeforeUnmount(() => observer.disconnect())
  nextTick(() => {
    document.querySelectorAll('.v-date-picker-header button').forEach((el) => {
      el.setAttribute('tabindex', '-1')
    })
    document.querySelectorAll('.v-btn').forEach((el) => {
      el.setAttribute('tabindex', '-1')
    })
  })
})
</script>

<style lang="scss">
.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

.datePicker > *:focus {
  outline: 2px solid black;
}

.v-picker {
  margin-bottom: 40px;
  height: fit-content;

  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08) !important;

  &:focus {
    outline: 2px solid black;
  }

  @media (max-width: 600px) {
    width: calc(100% - 32px);
    margin: auto;
    margin-bottom: 20px;
  }

  .v-date-picker__title,
  .v-picker-title,
  .v-date-picker-header {
    display: none;
    max-height: 0px !important;
    max-width: 0px !important;
  }

  .v-date-picker-month__day {
    pointer-events: none;
  }

  .v-date-picker-month__day--selected {
    .v-btn {
      background-color: #82b1ff;
    }
  }

  .v-date-picker-controls {
    margin: 0;
    border-radius: 0;
  }

  .v-date-picker-table {
    padding: 12px;
    height: auto;
  }
}

.v-picker__body .v-btn::before {
  background-color: transparent;
}

.theme--light.v-date-picker-table th {
  color: #666;
}
</style>
