<template>
  <div>
    <!-- kleur komende van css variabele -->
    <div :style="{ color: 'var(--indigo)' }">
      This text uses a color from a CSS variable.
    </div>
    <div class="double">
      This text uses a scss class with both a SCSS variable and a CSS variable to set its color.
    </div>
    <h1 :style="{ fontFamily: 'Tiempos Headline, serif' }">
      Hello World
    </h1>
    <h2
      class="heading-h2"
      :style="{ fontFamily: 'Tiempos Headline, serif' }"
    >
      This is a paragraph using the global Tiempos Headline font.
    </h2>
    <!-- use vuetify color, short and concise -->
    <!-- coming from a css variable -->
    <v-icon color="pdfRed">
      mdi-file-pdf-box
    </v-icon>
    <!-- coming from a vuetify only theme color -->
    <v-icon color="primary">
      mdi-file-pdf-box
    </v-icon>
    <div color="primary">
      Vuetify color dont work in non vuetify components
    </div>
    <!-- using vuetify color in a div with a css variable -->
    <div :style="{ color: 'var(--pdf-red)' }">
      Content
    </div>
    <!-- using a class with a vuetify theme color  -->
    <!-- theme colors can be used in a class but as we define theme colors with css variables, we better use css variables directly -->
    <v-icon class="viaVuetify">
      mdi-file-pdf-box
    </v-icon>
    <!-- using a class with a css variable -->
    <v-icon class="xxx">
      mdi-file-pdf-box
    </v-icon>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ExampleComponent',
}
</script>

<style scoped lang="scss">
.double {
  // we use a scss variable
  color: $skyBlue;
  // we use a css variable
  background: var(--indigo);
}
/* use vuetify color */
.viaVuetify {
  color: rgb(var(--v-theme-primary));
}
.xxx {
  color: var(--indigo);
}
</style>
