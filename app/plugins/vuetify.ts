// plugins/vuetify.ts
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi },
    },

    theme: {
      defaultTheme: 'constCourt',
      themes: {
        constCourt: {
          colors: {
            primary: '#043c72', // logoColor
            secondary: '#0065ca', // indigo
            accent: '#fcbf60', // rajahYellow
            error: '#c32a3a', // errorRed
            info: '#00aae7', // skyBlue
            success: '#3aa82f', // successGreen
            warning: '#d65c0e', // warningOrange

            logoColor: '#043c72',
            indigo: '#0065ca',
            indigoExtraLight: 'rgba(0, 101, 202, 0.14)',
            indigoLight: 'rgba(0, 101, 202, 0.8)',
            indigoMediumLight: 'rgba(0, 101, 202, 0.7)',
            skyBlue: '#00aae7',
            skyBlueExtraLight: 'rgba(0, 170, 231, 0.24)',
            rajahYellow: '#fcbf60',
            rajahLight: 'rgba(254, 201, 118, 0.9)',
            rajahExtraLight: 'rgba(254, 201, 118, 0.2)',
            textOnRajah: '#3d3a44',
            ivoryGrey: '#d9dad9',
            darkGrey: '#777777',
            linkBlue: '#00709d',
            pdfRed: '#c90304',
            dropdown: '#c90304',
            dropdownBg: '#3aa82f',
          },
          variables: {
            // optionally override Vuetify Sass tokens here,
            // e.g. border-radius, font families…
          },
        },
      },
    },

    // ──────────────────────────────────────────────────────────────────────────────
    // OPTIONAL: You can set “defaults” for Vuetify components so you don’t
    // have to write `color="primary"` or `variant="elevated"` everywhere.
    // ──────────────────────────────────────────────────────────────────────────────
    defaults: {
      VBtn: {
        color: 'primary',
        variant: 'elevated',
      },
      VSelect: {
        variant: 'outlined',
        color: 'indigo',
      },
      VCheckbox: {
        color: 'primary',
      },
      VTextField: {
        variant: 'outlined',
        color: 'indigo',
      },
      VAlert: {
        variant: 'flat', // or “outlined” if you prefer border alerts
      },
      // …etc., add any other component defaults you like…
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
