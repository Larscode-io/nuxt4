// plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import '@mdi/font/css/materialdesignicons.css' is done in nuxt.config.ts
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      themes: {
        light: {
          colors: {
            pdfRed: '#c90304',
            scienceBlue: '#0065ca',
          },
        },
      },
    },
  })
  nuxtApp.vueApp.use(vuetify)
})

// use colors like this:

// .custom-redtext {color: rgb(var(--v-theme-pdfRed)); }
// :style="{ color: 'rgb(var(--v-theme-pdfRed))' }"

// with Vuetify's color prop:
// color="pdfRed"
// <v-icon color="pdfRed">mdi-file-pdf-box</v-icon>

// for non-vuetify elements:
// color="rgb(var(--v-theme-scienceBlue))"

// however if we define $indigo in an scss file, we can use it like this:
// color="$indigo" inside a style attribute inside script setup but not in a style tag in a vue file
// because the style tag is not processed by the scss preprocessor
// therefore if we define $indigo in vuetify theme, we can use it in a style tag in a vue file
// inside the template section because the template section is processed by the scss preprocessor
