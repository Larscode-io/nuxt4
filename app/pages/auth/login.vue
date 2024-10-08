<!--
Helper page to authenticate with OpenID@FAS-Fedict
- app/pages/auth/callback.vue
- server/api/routes/auth/tok.ts
 -->

<template>
  <div style="text-align: center; margin-top: 50px;">
    <h1>Login</h1>
    <div style="color: darkblue;">
      <p>Authenticate and you will be redirected to <code style="color: darkred;">app/pages/auth/callback.vue</code></p>
      <p>Change the path from <code style="color: darkred;">nuxt/nl/auth/callback</code> to <code style="color: darkred;">/nuxt/auth/tok</code> in the browser URL</p>
      <p>Press 'Enter' to call the API, which will return a token</p>
      <p>The file <code style="color: darkred;">/server/api/routes/auth/tok.ts</code> is exposed in the browser as <code style="color: darkred;">/api/auth/tok</code></p>
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

const authorizationUrl = ref('')

const config = useRuntimeConfig()
function _generateRandomState() {
  return Math.random().toString(36).substring(2)
}

// .vue pages can only have access to config.public.something properties at runtime
// we should not see config.something being used because that are secrets and should not be exposed to the client
const base = `${config.public.authorizeUri}`
const clientId = `${config.public.clientId}`
const scope = 'openid profile egovnrn roles enterprise'
const responseType = 'code'
const redirectUri = `${config.public.redirectUri}`
const acrValues = 'urn:be:fedict:iam:fas:citizen:Level300'
const state = 'af0ifjsldkj'
// const state = generateRandomState()
const nonce = '1244546'

// document.cookie = `auth_state=${state}; path=/`

authorizationUrl.value = base +
  '?client_id=' + clientId +
  '&scope=' + scope +
  '&response_type=' + responseType +
  '&redirect_uri=' + redirectUri +
  '&acr_values=' + acrValues +
  '&state=' + state +
  '&nonce=' + nonce

function navigateTo(url) {
  window.location.href = url
  // Internal routes: use router.push('/path')
}
</script>

