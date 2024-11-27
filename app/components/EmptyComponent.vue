<template>
  <v-card
    class="empty-card"
    outlined
  >
    <div
      v-if="showIcon"
      class="empty-icon"
    />
    <div class="infos-container">
      <p>
        {{
          props.message || (locale === Languages.ENGLISH || locale === Languages.GERMAN ? t('error.no-result-for-en-de') : t('error.no-result'))
        }}
      </p>
    </div>
  </v-card>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage'
import { Languages } from '~/core/constants'

const { t, locale } = useLanguage()
console.log(Languages.ENGLISH)
const props = defineProps({
  message: { type: String, default: null },
  showIcon: { type: Boolean, default: true },
})
</script>

<style scoped lang="scss">
.empty-card {
  max-width: 700px;
  background: white;
  /*box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08) !important;*/
  padding: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: auto;
  margin-bottom: 24px;

  @include mobile {
    flex-direction: column;
    width: 100%;
  }

  .empty-icon {
    width: 160px;
    height: 160px;
    background-image: url('../assets/img/empty-doc.svg');
    background-position: center center;
    background-size: contain;
  }

  .infos-container {
    max-width: 270px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    p {
      font-weight: 600;
      font-size: 1.25rem;
      text-align: center;
    }

    a {
      font-size: 1rem;
      text-align: center;
      color: $linkBlue;
    }
  }
}
</style>
