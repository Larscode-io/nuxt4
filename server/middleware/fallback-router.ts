export default defineEventHandler((event) => {
    const host = getRequestHeader(event, 'host') || ''
    const cookie = getRequestHeader(event, 'cookie') || ''
    const url = getRequestURL(event)

    const localeMatch = cookie.match(/i18n_redirected=(\w+)/)
    const locale = localeMatch?.[1]

    const supported = ['nl', 'fr', 'de', 'en']
    const isFallbackHost = host.startsWith('www.') || host.startsWith('yyy.')

    if (isFallbackHost && supported.includes(locale)) {
        return sendRedirect(event, `https://${locale}.const-court.be${url.pathname}`, 302)
    }

    // Als user geen cookie heeft en nog op '/' zit, redirect naar /lang
    if (isFallbackHost && url.pathname === '/') {
        return sendRedirect(event, '/lang', 302)
    }

    // Anders: niks doen, pagina wordt getoond
})
