export default defineEventHandler((event) => {
    const host = getRequestHeader(event, 'host') || ''
    const cookie = getRequestHeader(event, 'cookie') || ''
    const url = getRequestURL(event)

    const localeMatch = cookie.match(/i18n_redirected=(\w+)/)
    const locale = localeMatch?.[1]

    const supported = ['nl', 'fr', 'de', 'en']
    const isFallbackHost =
        host.startsWith('www.') ||
        host.startsWith('yyy.') ||
        host.startsWith('localhost') ||
        host.startsWith('127.0.0.1')

    console.log('Locale:', locale)
    console.log('Host:', host)
    console.log('URL:', url.pathname)
    console.log('Cookie:', cookie)
    console.log('Supported locales:', supported)

    if (isFallbackHost && locale && supported.includes(locale)) {
        return sendRedirect(event, `https://${locale}.const-court.be${url.pathname}`, 302)
    }

    if (isFallbackHost && url.pathname === '/') {
        return sendRedirect(event, '/lang', 302)
    }

})
