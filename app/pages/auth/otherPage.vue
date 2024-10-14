<script setup lang="ts">
// import { useAuth } from '~/composables/useAuth'

const { token, destination } = useAuth()
const info = ref(null)
const f = async () => {
  const userInfoResponse = await $fetch(`/auth/getUserInfo?access_token=${token.value}`)
  const { statusCode, body } = userInfoResponse
  info.value = body
}
</script>

<template>
  <div>
    <h1>Other page</h1>
    <NuxtLink :to="localePath('/auth/login', locale)">
      Go to login page
    </NuxtLink>
    <NuxtLink :to="localePath('/auth/otherPage', locale)">
      Go to another page
    </NuxtLink>
    <div>
      <h1>Fetch User Info</h1>
      <div> {{ token || `no token` }} </div>
      <div> {{ destination || `login without intendedDestination` }} </div>
      <button @click="f">
        Get user info
      </button>
      <div v-if="info">
        <pre> {{ info }} </pre>
      </div>
    </div>
  </div>
</template>
