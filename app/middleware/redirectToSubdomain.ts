export default defineNuxtRouteMiddleware((to, from) => {
    const host = useRequestHeaders()['host']
    const cookie = useCookie<string>('i18n_redirected')
    const redirected = cookie.value

    // Enkel redirecten op nuxt.const-court.be
    if (host !== 'nuxt.const-court.be') {
        console.warn('Redirect middleware only works on nuxt.const-court.be')
        console.warn('Redirect middleware only works on nuxt.const-court.be')
        console.warn('Redirect middleware only works on nuxt.const-court.be')
        console.warn('Redirect middleware only works on nuxt.const-court.be')
        return
    }

    const subdomainMap = {
        nl: 'nl.const-court.be',
        fr: 'fr.const-court.be',
        en: 'en.const-court.be',
        de: 'de.const-court.be'
    }

    // 1. Als cookie er is en geldig, redirect daarheen
    if (redirected && subdomainMap[redirected]) {
        return navigateTo(`https://${subdomainMap[redirected]}${to.fullPath}`, { redirectCode: 302 })
    }

    // 2. Geen cookie? Dan op basis van accept-language header
    const acceptLang = useRequestHeaders()['accept-language']
    const preferred = acceptLang?.slice(0, 2)

    if (preferred && subdomainMap[preferred]) {
        return navigateTo(`https://${subdomainMap[preferred]}${to.fullPath}`, { redirectCode: 302 })
    }

    // 3. Fallback: stuur naar NL
    return navigateTo(`https://nl.const-court.be${to.fullPath}`, { redirectCode: 302 })
})
