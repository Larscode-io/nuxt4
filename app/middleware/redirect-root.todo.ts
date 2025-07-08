// TODO: Heractiveer redirect van /nuxt naar /nuxt/nl met 301/302 splitsing
// dat is nodig voor SEO om de juiste taalversie te tonen aan crawlers
// echte gebruikers worden met browser detectie omgeleid naar /nuxt/locale
// en crawlers naar /nuxt/nl met 301 redirect om 1 keuze te maken
// import { defineNuxtRouteMiddleware, useRequestHeaders, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {

  if (to.path === '/nuxt' || to.path === '/nuxt/') {
    const ua = useRequestHeaders()['user-agent'] || ''
    const isBot = /bot|crawl|slurp|spider|facebook|linkedin|preview/i.test(ua)

    return navigateTo('/nuxt/nl', {
      redirectCode: isBot ? 301 : 302,
    })
  }
})
