// plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import 'vuetify/styles' // import default styles (light and dark themes) if we don't use custom styles
import { aliases, mdi } from 'vuetify/iconsets/mdi'

function getCssVariableValue(variableName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim()
}

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
            lars: getCssVariableValue('--pdf-red'),
            primary: getCssVariableValue('--success-green'),
            scienceBlue: getCssVariableValue('--science-blue'),
            logoColor: getCssVariableValue('--logo-color'),
            indigo: getCssVariableValue('--indigo'),
            indigoExtraLight: getCssVariableValue('--indigo-extra-light'),
            indigoLight: getCssVariableValue('--indigo-light'),
            indigoMediumLight: getCssVariableValue('--indigo-medium-light'),
            skyBlue: getCssVariableValue('--sky-blue'),
            skyBlueExtraLight: getCssVariableValue('--sky-blue-extra-light'),
            rajahYellow: getCssVariableValue('--rajah-yellow'),
            ivoryGrey: getCssVariableValue('--ivory-grey'),
            darkGrey: getCssVariableValue('--dark-grey'),
            linkBlue: getCssVariableValue('--link-blue'),
            errorRed: getCssVariableValue('--error-red'),
            warningOrange: getCssVariableValue('--warning-orange'),
            successGreen: getCssVariableValue('--success-green'),
            rajahLight: getCssVariableValue('--rajah-light'),
            rajahExtraLight: getCssVariableValue('--rajah-extra-light'),
            textOnRajah: getCssVariableValue('--text-on-rajah'),
          },
        },
      },
    },
  })
  nuxtApp.vueApp.use(vuetify)
})

// use colors like this:

// with Vuetify's color prop:
// color="pdfRed"
// <v-icon color="pdfRed">mdi-file-pdf-box</v-icon>

// for non-vuetify elements in style attributes or style sections to define classes
// color="rgb(var(--v-theme-scienceBlue))"
