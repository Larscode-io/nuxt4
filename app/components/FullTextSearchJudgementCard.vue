<template>
  <div class="judgment-card">
    <div class="top-infos">
      <p>{{ date }}</p>
      <p v-if="score">
        {{ score.toPrecision(3) }}
      </p>
    </div>
    <h3 class="mt-4">
      <a
        :href="pdfUrlWithSearch"
        class="mr-2"
        rel="noopener noreferrer"
        target="_blank"
      >
        <v-icon
          size="36"
          color="red"
          left
        >
          mdi-file-pdf-box
        </v-icon>
      </a>

      {{ title }}
    </h3>
    <!-- eslint-disable vue/no-v-html -->
    <span
      class="subtitle my-2"
      v-html="description || t('error.noDataAvailable')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Define props with TypeScript interface
interface Props {
  searchTerm?: string
  date: string
  id: number
  pdfUrl: string
  title: string
  description: string
  score: number
  pageCount: number
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  searchTerm: '',
})

// Computed property for PDF URL with search
const pdfUrlWithSearch = computed(() => {
  return `${props.pdfUrl}#search=${props.searchTerm}`
})
</script>

<style lang="scss">
.judgment-card {
    padding: 20px;
    position: relative;
    background-position: 154%;
    box-shadow: none;
    transition: all 0.3s ease-in-out;
    border-radius: 0;
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08);
    margin: 16px;
    margin-bottom: 32px;

    @media (max-width: 768px) {
        width: calc(100% - 32px);
        margin: auto;
        margin-bottom: 20px;
    }

    .top-infos {
        display: flex;
        justify-content: space-between;

        p {
            font-size: 1.25rem;
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
        font-size: 1.25rem;
        line-height: 24px;
        text-align: left;
        margin-bottom: 20px;

        a {
            color: transparent;
        }
    }

    .subtitle {
        text-align: left;
        margin-bottom: 8px;
        font-size: 1rem;
        font-weight: 400;
        word-break: break-word;
    }

    .state {
        font-size: 1rem;
        line-height: 20px;
        color: var(--error-red);
        font-style: italic;
        display: block;
    }

    .v-chip {
        background-color: var(--rajah-extra-light) !important;
        color: var(--rajah-yellow);

        .v-chip__content {
            font-weight: 600;
        }
    }

    em {
        background: var(--rajah-light);
    }
}
</style>
