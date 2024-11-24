// plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
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
            customRed: '#C90304',
          },
        },
      },
    },
  })
  // .custom-redtext {color: rgb(var(--v-theme-customRed)); }
  // :style="{ color: 'rgb(var(--v-theme-customRed))' }"
  // in vuetify elements: color = "rgb(var(--v-theme-customRed))"
  nuxtApp.vueApp.use(vuetify)
})
