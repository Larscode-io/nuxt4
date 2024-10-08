<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const { code, state, scope, iss, client_id } = route.query
</script>

<template>
  <div>
    <h1>Callback</h1>
    <p>code: {{ code }}</p>
    <p>state: {{ state }}</p>
    <p>scope: {{ scope }}</p>
    <p>iss: {{ iss }}</p>
    <p>client_id: {{ client_id }}</p>
  </div>
</template>

