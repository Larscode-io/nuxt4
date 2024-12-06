<template>
  <p>
    {{ pdf }}<br>
    {{ description }}<br>
    {{ d1z }}<br>
    {{ d2z }}<br>
    {{ lang }}
  </p>
</template>

<script setup>
// pdf: 20240612 - selectieprocedure - administratief - beheerder_NL.pdf
// description: Organisatie van een selectieprocedure voor de aanwerving op contractuele basis voor onbepaalde duur of de detachering van een Nederlandstalig administratief beheerder Personeelsbeleid(niveau B)(m / v / x)
// lang: nl
// d1z: 07-15-2024
// d2z: 09-16- 2025

const props = defineProps({
  pdf: { type: String, required: true },
  description: { type: String, required: true },
  d1z: { type: String, required: false },
  d2z: { type: String, required: false },
  lang: { type: String, required: false, default: 'nl' },
})
</script>
