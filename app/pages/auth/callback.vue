<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
// import { useAuth } from '~/composables/useAuth'

const { locale } = useI18n()
const localePath = useLocalePath()

const route = useRoute()
const { handleCallback } = useAuth()
const { code = '', state = '', scope = '', iss = '', client_id = '' } = route.query
const missingParams = [code, state, scope, iss, client_id].some(param => !param)

interface _Response {
  aud: string
  sub: string
  prefLanguage: string
  mail: string
  surname: string
  givenName: string
  roles: string
  subname: string
  iss: string
  egovNRN: string
  fedid: string
  assurance_level: string
}

const response = ref<_Response | null>(null)

onMounted(async () => {
  if (import.meta.client) {
    try {
      const tokenResponse = await $fetch(`/auth/exchangeCodeForToken?code=${code}&state=${state}&scope=${scope}&iss=${iss}&client_id=${client_id}`)
      const { statusCode, body: { access_token, intendedDestination } } = tokenResponse
      //
      handleCallback(access_token, intendedDestination)

      if (statusCode === 200 && access_token) {
        const userInfoResponse = await $fetch(`/auth/getUserInfo?access_token=${access_token}`)
        const { statusCode: userInfoStatusCode, body } = userInfoResponse

        if (userInfoStatusCode === 200) {
          response.value = body as _Response
        }
        else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          response.value = { statusCode: userInfoStatusCode, body } as any
        }
      }
      else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.value = { statusCode, body: tokenResponse.body } as any
      }
    }
    catch (error) {
      console.error('Fetch error:', error)
      const errorMessage = typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message: string }).message
        : String(error)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.value = { statusCode: 500, body: errorMessage } as any
    }
  }
})
</script>

<template>
  <div>
    <NuxtLink :to="localePath('/auth/login', locale)">
      Go to login page
    </NuxtLink>
    <NuxtLink :to="localePath('/auth/otherPage', locale)">
      Go to another page
    </NuxtLink>
    <div v-if="route.query && missingParams">
      <h1>One or more missing parameters</h1>
      <p>code: {{ route.query.code }}</p>
      <p>state: {{ route.query.state }}</p>
      <p>scope: {{ route.query.scope }}</p>
      <p>iss: {{ route.query.iss }}</p>
      <p>client_id: {{ route.query.client_id }}</p>
    </div>
    <div v-else>
      <h1>Callback received code parameters from the auth server:</h1>
      <p>code: {{ route.query.code }}</p>
      <p>state: {{ route.query.state }}</p>
      <p>scope: {{ route.query.scope }}</p>
      <p>iss: {{ route.query.iss }}</p>
      <p>client_id: {{ route.query.client_id }}</p>
      <div v-if="response">
        <div v-if="response && 'statusCode' in response && Number(response.statusCode) === 500">
          <h2>Bad Response</h2>
          <p>statusCode: {{ response.statusCode }}</p>
          <p>body: {{ response.body }}</p>
        </div>

        <div v-else-if="response && 'egovNRN' in response">
          <h2>Good Response</h2>
          <p>aud: {{ response.aud }}</p>
          <p>sub: {{ response.sub }}</p>
          <p>prefLanguage: {{ response.prefLanguage }}</p>
          <p>mail: {{ response.mail }}</p>
          <p>surname: {{ response.surname }}</p>
          <p>givenName: {{ response.givenName }}</p>
          <p>roles: {{ response.roles }}</p>
          <p>subname: {{ response.subname }}</p>
          <p>iss: {{ response.iss }}</p>
          <p>egovNRN: {{ response.egovNRN }}</p>
          <p>fedid: {{ response.fedid }}</p>
          <p>assurance_level: {{ response.assurance_level }}</p>
        </div>

        <div v-else>
          <h2>Unknown Response</h2>
          <p>response: {{ response }}</p>
        </div>
      </div>
      <div v-else>
        <h2>No response yet...</h2>
      </div>
    </div>
  </div>
</template>
