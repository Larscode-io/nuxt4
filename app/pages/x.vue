<template>
  <div>
    <h1 :style="{ fontFamily: 'Tiempos Headline, serif' }">
      Hello World
    </h1>
    <h2
      class="heading-h2"
      :style="{ fontFamily: 'Tiempos Headline, serif' }"
    >
      This is a paragraph using the global Tiempos Headline font.
    </h2>
    <v-icon color="pdfRed">
      mdi-file-pdf-box
    </v-icon>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ExampleComponent',
}
</script>

<style scoped>
.example {
  color: blue;
}
.custom-redtext {
  color: rgb(var(--v-theme-rajahLight));
}
</style>
