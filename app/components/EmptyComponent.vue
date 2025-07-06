<template>
  <v-sheet
    class="d-flex flex-column align-center justify-center"
    color="grey-lighten-4"
    elevation="0"
    height="200"
  >
    <v-icon
      size="48"
      color="grey"
    >
      mdi-information-outline
    </v-icon>
    <div class="mt-2 text-grey">
      {{ message }}
    </div>
  </v-sheet>
</template>

<script setup>
defineProps({
  message: { type: String, default: null },
  showIcon: { type: Boolean, default: true },
})
</script>
