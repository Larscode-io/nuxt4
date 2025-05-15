// plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import 'vuetify/styles'
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
            skyBlue: '#00aae7',
            logoColor: '#043c72',
            myCustomRed: '#C90304',
          },
          variables: {
          },
        },
      },
    },
  })
  nuxtApp.vueApp.use(vuetify)
})
