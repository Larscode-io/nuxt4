<template>
  <v-card :id="`judgment-card-${id}`" class="judgement-card mx-auto my-4">
    <div class="top-infos">
      <p>{{ date }}</p>
      <p>{{ title }}</p>
    </div>
    <h3>
      <a v-if="pdfUrl" :href="pdfUrl" rel="noopener noreferrer" target="_blank"
        :aria-label="tc(i18nKeys.aria.label.downloadPdf)">
        <v-icon v-if="pdf_exists" color="red" large>
          mdi-file-pdf-box
        </v-icon>
        <v-icon v-else large>
          mdi-file-pdf-box theme--light
        </v-icon>
      </a>
      <v-icon v-if="summary && isEnglish" color="grey" large :aria-label="tc(i18nKeys.aria.label.downloadPdf)"
        @click="showSummary = true">
        mdi-file
      </v-icon>
      {{ reference }}
    </h3>
    <span class="subtitle my-2" v-html="description || t(i18nKeys.error.noDataAvailable)" />
    <span class="state my-2" v-html="state || t(i18nKeys.error.noDataAvailable)" />
    <span v-if="idsRole && idsRole.length" class="py-4">
      {{ `${tc(i18nKeys.general.message.rollNumber)}${t(i18nKeys.general.message.colon)} ${idsRole.join(' - ')}` }}
    </span>
    <span v-else class="py-4">
      {{ t(i18nKeys.error.noDataAvailable) }}
    </span>
    <p class="subtitle my-2">
      {{ `${tc(i18nKeys.general.message.keywords, 2)}${t(i18nKeys.general.message.colon)}` }}
    </p>
    <v-banner elevation="3" class="subtitle my-2">
      <span v-html="keywords || t(i18nKeys.error.noDataAvailable)" />
    </v-banner>
    <p class="subtitle my-2">
      <a v-if="pressReleaseFilePath" :href="pressReleaseFilePath" style="text-decoration: underline;"
        class="d-inline-block mt-3" rel="noopener noreferrer" target="_blank"
        :aria-label="tc(i18nKeys.aria.label.downloadPdf)">
        {{ tc(i18nKeys.general.message.pressReleases, 1) }}
      </a>
    </p>
    <v-dialog v-model="showSummary" scrollable max-width="600px">
      <v-card class="mx-auto my-4">
        <v-card-title class="headline">
          {{ tc(i18nKeys.general.message.summary) }}
        </v-card-title>
        <v-card-text>{{ summary }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text :aria-label="tc(i18nKeys.aria.label.chip.filter)" @click="showSummary = false">
            {{ t(i18nKeys.general.message.close) }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import { i18nKeys } from '~/lang/keys'

// Define props
interface Props {
  date: string
  id: number
  pdfUrl: string
  summary?: string
  title: string
  description: string
  state: string
  reference: string
  keywords?: string
  idsRole: string[]
  pressReleaseFilePath?: string
}
const props = defineProps<Props>()

// Define emits (voor de 'click' event)
const emit = defineEmits<{ (e: 'click', id: number): void }>()

// i18n setup
const { t, locale } = useI18n()

// Lokale state
const showSummary = ref(false)
const pdf_exists = ref(false)

// Computed property: Bepaal of de huidige taal Engels is
const isEnglish = computed(() => locale.value === Languages.ENGLISH)

// Controleer of het PDF-bestand bestaat bij mount
onMounted(async () => {
  try {
    pdf_exists.value = await pdfFileExists(props.pdfUrl)
  } catch (error) {
    console.log("Error checking PDF existence:", error)
  }
})

// Methode om een string te voorzien van superscript (optioneel)
function filter_sup(str: string): string {
  const regex = /#\[(?<xxx>.*?)\]#/g
  return str.replace(regex, `<sup>$<xxx></sup>`)
}

// Emit een 'click' event met het id (indien nodig)
function navigate(id: number) {
  emit('click', id)
}
</script>

<style lang="scss">
.judgement-card {
  padding: 20px;
  position: relative;
  background-position: 154%;
  box-shadow: none;
  transition: all 0.3s ease-in-out;
  border-radius: 0 !important;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08) !important;
  margin: 16px;
  margin-bottom: 32px;

  @include tablet-landscape {
    width: calc(100% - 64px);
  }

  @include tablet {
    width: calc(100% - 64px);
  }

  @include mobile {
    width: calc(100% - 32px);
    margin: auto;
    margin-bottom: 20px;
  }

  .top-infos {
    display: flex;
    justify-content: space-between;

    p {
      font-size: 1rem;
      line-height: 24px;
    }

    p:first-of-type {
      position: relative;

      &:before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
        background-color: white;
      }
    }
  }

  h3 {
    font-size: 1.125rem;
    line-height: 20px;
    text-align: left;
    margin-bottom: 20px;

    a {
      color: transparent;
    }
  }

  .subtitle {
    text-align: left;
    margin-bottom: 8px;
    font-size: 0.875rem;
    line-height: 20px;
    font-weight: 400;
    word-break: break-word;
  }

  .state {
    font-size: 0.875rem;
    line-height: 20px;
    color: $errorRed;
    font-style: italic;
    display: block;
  }

  .v-chip {
    cursor: pointer;
    background-color: $rajahExtraLight !important;
    color: $rajahYellow;
    transition: all 0.2s ease-in-out;

    .v-chip__content {
      font-weight: 600;
      font-size: 0.875rem !important;
    }

    &:hover {
      background: $rajahYellow !important;
      color: white !important;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }
  }

  .chip-container {
    a {
      text-decoration: none;
    }
  }

  .py-4 {
    font-size: 0.875rem;
    line-height: 20px;
  }

  .flex-container {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
