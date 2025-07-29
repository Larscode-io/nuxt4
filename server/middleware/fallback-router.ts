// server/middleware/fallback-router.ts
export default defineEventHandler((event) => {
    const host = getRequestHeader(event, 'host') || ''
    const cookie = getRequestHeader(event, 'cookie') || ''
    const url = getRequestURL(event)

    const localeMatch = cookie.match(/i18n_redirected=(\w+)/)
    const locale = localeMatch?.[1]

    const supported = ['nl', 'fr', 'de', 'en']
    let isFallbackHost = false;
    isFallbackHost =
        host.startsWith('www.') ||
        host.startsWith('staging.') ||
        ((host.startsWith('localhost') || host.startsWith('127.0.0.1')) && url.pathname === '/lang')


    // i18n_redirected cookie bestaat én een geldige taal bevat:
    if (isFallbackHost && locale && supported.includes(locale) && url.pathname !== '/lang') {
        return sendRedirect(event, `https://${locale}.const-court.be${url.pathname}`, 302)
    }

    // Je op een fallback host zit en geen i18n_redirected
    if (isFallbackHost && url.pathname === '/') {
        return sendRedirect(event, '/lang', 302)
    }

})
