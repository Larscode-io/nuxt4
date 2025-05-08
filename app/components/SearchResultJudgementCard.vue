<template>
  <div
    :id="String(id)"
    class="search-result-card"
  >
    <a
      class="link-pdf pdf-content no-decoration"
      :href="judgmentFilePath"
      rel="noopener noreferrer"
      target="_blank"
      :aria-label="`${t('general.message.judgment-number')} ${judgmentNumber}, ${t('general.message.date-of-judgment')} ${dateOfJudgment}, ${t('general.message.roll-number')} ${rollNumbers.join(' - ')}, ${t('aria.label.download-ddf')} `"
    >
      <v-icon
        size="24"
        class="mr-4"
        color="red"
        left
      >
        mdi-file-pdf-box
      </v-icon>
      <div class="content">
        <div class="row-to-column">
          <p class="titleSearchResult">{{ t('general.message.judgment-number') }}</p>
          <p>{{ judgmentNumber }}</p>
        </div>
        <div class="row-to-column">
          <p class="titleSearchResult">{{ t('general.message.date-of-judgment') }}</p>
          <p>{{ dateOfJudgment }}</p>
        </div>
        <div
          v-if="rollNumbers && rollNumbers.length > 0"
          class="row-to-column"
        >
          <p class="titleSearchResult">{{ t('general.message.roll-number') }}</p>
          <p>{{ rollNumbers.join(' - ') }}</p>
        </div>
        <div
          v-if="judgmentTypes && judgmentTypes.length > 0"
          class="row-to-column"
        >
          <p class="titleSearchResult">{{ t('general.message.judgment-type') }}</p>
          <ul>
            <li
              v-for="(type, index) in judgmentTypes"
              :key="index"
            >
              {{ type }}
            </li>
          </ul>
        </div>
        <div
          v-if="dateOfBeOfficialJournal"
          class="row-to-column"
        >
          <p class="titleSearchResult">{{ t('general.message.date-of-be-official-journal') }}</p>
          <p>{{ dateOfBeOfficialJournal || emptyValue }}</p>
        </div>
        <div
          v-if="belgianOfficialPage"
          class="row-to-column"
        >
          <p class="titleSearchResult">{{ t('general.message.be-official-journage-page-number') }}</p>
          <p>{{ belgianOfficialPage || emptyValue }}</p>
        </div>
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
import { EMPTY_VALUE } from '../../server/constants'

const { t } = useLanguage()

interface Props {
  id: number
  judgmentNumber: string
  judgmentFilePath: string
  dateOfJudgment: string
  rollNumbers?: string[]
  judgmentTypes?: string[]
  dateOfBeOfficialJournal?: string
  belgianOfficialPage?: string
}

const props = withDefaults(defineProps<Props>(), {
  rollNumbers: () => [],
  judgmentTypes: () => [],
  dateOfBeOfficialJournal: '',
  belgianOfficialPage: '',
})

const emptyValue = EMPTY_VALUE
</script>

<style scoped lang="scss">
.search-result-card {
  color: black !important;
  padding: 40px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08) !important;
  border-radius: 0 !important;
  margin: 32px;

  @media (max-width: 768px) {
    width: calc(100% - 32px);
    margin: auto;
    margin-bottom: 20px;
  }
}

.row-to-column {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 8px;

  .titleSearchResult {
    font-size: 16px;
    color: var(--text-on-rajah);
    width: 200px;
    margin-right: 24px;
    margin-bottom: 16px;
  }

  p,
  ul {
    color: black;
    width: calc(100% - 200px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;

    .titleSearchResult {
      width: 100%;
    }

    p,
    ul {
      width: 100%;
    }
  }

  .link-pdf {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}

a {
  text-decoration: none;
  font-size: 16px;
}

.pdf-content {
  display: flex;
  align-items: flex-start;
}
</style>
