<template>
  <p>
    {{ description }}<br>
    <a
      :href="vacLink"
      target="_blank"
    >Vacature</a>
  </p><br>
</template>

<script setup>
import { computed } from 'vue'
// pdf: 20240612 - selectieprocedure - administratief - beheerder_NL.pdf
// description: Organisatie van een selectieprocedure voor de aanwerving op contractuele basis voor onbepaalde duur of de detachering van een Nederlandstalig administratief beheerder Personeelsbeleid(niveau B)(m / v / x)
// lang: nl
// d1z: 15-07-2024
// d2z: 16-09-2025
const vacLink = computed(() => {
  return `https://www.const-court.be/public/common/${props.lang}/${props.pdf}`
})
const props = defineProps({
  pdf: { type: String, required: true },
  description: { type: String, required: true },
  d1z: { type: String, required: false },
  d2z: { type: String, required: false },
  lang: { type: String, required: true },
})
</script>
