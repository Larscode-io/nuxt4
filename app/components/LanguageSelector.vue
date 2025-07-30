<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'

interface Language {
  code: string
  name: string
  title: string
  description: string
  buttonText: string
  cookieText: string
}

const { t } = useLanguage()
const localeCookie = useCookie('i18n_redirected', {
  path: '/',
  domain: '.const-court.be',
  maxAge: 60 * 60 * 24 * 365, // 1 year
  sameSite: 'lax',
  secure: true
})

const languages: Language[] = [
  {
    code: 'nl',
    name: t('general.language.dutch'),
    title: t('entry.select'),
    description: t('entry.subtitle'),
    buttonText: t('general.language.dutch'),
    cookieText: t('entry.cookie-hint')
  },
  {
    code: 'fr',
    name: t('general.language.french'),
    title: t('entry.select'),
    description: t('entry.subtitle'),
    buttonText: t('general.language.french'),
    cookieText: t('entry.cookie-hint')
  },
  {
    code: 'de',
    name: t('general.language.german'),
    title: t('entry.select'),
    description: t('entry.subtitle'),
    buttonText: t('general.language.german'),
    cookieText: t('entry.cookie-hint')
  },
  {
    code: 'en',
    name: t('general.language.english'),
    title: t('entry.select'),
    description: t('entry.subtitle'),
    buttonText: t('general.language.english'),
    cookieText: t('entry.cookie-hint')
  }
]

function chooseLanguage(langCode: string) {
  localeCookie.value = langCode
  window.location.href = `https://${langCode}.const-court.be`
}
</script>

<template>
  <v-container class="d-flex justify-center align-center min-height-screen">
    <v-row justify="center" class="w-100">
      <v-col cols="12" md="10" lg="8">
        <v-card class="elevation-4 pa-8" color="surface">
          <v-card-title class="text-center text-h4 mb-6" style="color: var(--v-theme-primary)">
            {{ t('entry.select') }}
          </v-card-title>

          <v-row>
            <v-col
              v-for="lang in languages"
              :key="lang.code"
              cols="12"
              sm="6"
              lg="3"
            >
              <v-card
                class="language-card pa-6 text-center h-100 d-flex flex-column"
                elevation="2"
                hover
                @click="chooseLanguage(lang.code)"
              >
                <div class="flex-grow-1">
                  <h2 class="text-h5 mb-4" style="color: var(--v-theme-primary)">
                    {{ lang.title }}
                  </h2>

                  <p class="text-body-2 mb-4" style="color: var(--v-theme-darkGrey)">
                    {{ lang.description }}
                  </p>
                </div>

                <div>
                  <v-btn
                    color="rajahYellow"
                    size="large"
                    variant="elevated"
                    class="mb-3 font-weight-bold"
                    block
                    @click.stop="chooseLanguage(lang.code)"
                  >
                    {{ lang.buttonText }}
                  </v-btn>

                  <p class="text-caption" style="color: var(--v-theme-darkGrey)">
                    {{ lang.cookieText }}
                  </p>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="my-6"></v-divider>

          <div class="text-center">
            <v-chip
              color="skyBlue"
              variant="outlined"
              class="ma-1"
              small
            >
              {{ t('general.banner') }}
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.min-height-screen {
  min-height: 100vh;
}

.language-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.language-card:hover {
  border-color: var(--v-theme-skyBlue);
  transform: translateY(-2px);
}

.v-btn {
  color: var(--v-theme-textOnRajah) !important;
}
</style>
