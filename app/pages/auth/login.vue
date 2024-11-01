<template>
  <div style="text-align: center; margin-top: 50px;">
    <h1>Login</h1>
    <NuxtLink :to="localePath('/auth/login', locale)">
      Go to login page
    </NuxtLink>
    <NuxtLink :to="localePath('/auth/otherPage', locale)">
      Go to another page
    </NuxtLink>
    <div style="color: darkblue;">
      <a
        href="https://iamapps.int.belgium.be/sma/generalinfo?redirectUrl=/sma/"
        target="_blank"
      >
        Create a test profile before authenticating (One time only)
      </a>
      <p>Authenticate and you will be redirected to <code style="color: darkred;">app/pages/auth/callback.vue</code></p>
    </div>
    <p>
      <strong>Authorization URL:</strong>
      <br>
      <code>{{ authorizationUrl }}</code>
    </p>
    <button
      style="padding: 10px 20px; font-size: 16px; cursor: pointer;"
      @click="navigateTo(authorizationUrl)"
    >
      Login with OpenID@FAS-Fedict
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import { useRoute } from 'vue-router'

const route = useRoute()
const intendedDestination = route.query.intendedDestination || '/http://nowhere.be'

import { useLanguage } from '@/composables/useLanguage';
const { locale, localePath } = useLanguage();


const authorizationUrl = ref('')
authorizationUrl.value = await $fetch(`/auth/generateAuthUrl?intendedDestination=${intendedDestination}`)
function navigateTo(url) {
  window.location.href = url
}
</script>
