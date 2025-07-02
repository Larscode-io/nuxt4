<script setup lang="ts">
const { data } = await useFetch('/api/swr-example')
</script>

<template>
  <div>
    <p>{{ data?.message }}</p>
    <p>{{ data?.updatedAt }}</p>
  </div>
</template>
