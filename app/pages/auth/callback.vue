<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()

const { code = '', state = '', scope = '', iss = '', client_id = '' } = route.query
const url = ref(`/auth/tok?code=${code}&scope=${scope}&iss=${iss}&state=${state}&client_id=${client_id}`)
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

const response = ref<_Response | { statusCode: number, body: string } | null>(null)

onMounted(async () => {
  if (import.meta.client) {
    try {
      response.value = await $fetch<_Response>(url.value)
    }
    catch (error) {
      console.error('Fetch error:', error)
    }
  }
})
</script>

<template>
  <div v-if="route.query && missingParams">
    <h1>One or more missing parameters</h1>
    <p>code: {{ route.query.code }}</p>
    <p>state: {{ route.query.state }}</p>
    <p>scope: {{ route.query.scope }}</p>
    <p>iss: {{ route.query.iss }}</p>
    <p>client_id: {{ route.query.client_id }}</p>
  </div>
  <div v-else>
    <h1>Callback received these parameters from the auth server:</h1>
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
</template>

