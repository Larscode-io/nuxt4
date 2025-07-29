// Samenvatting: Gebruik de X-Robots-Tag header (noindex, nofollow) als extra beveiliging tegen indexering door zoekmachines.
// Dit werkt per pagina, ook als robots.txt te laat is, en wordt direct door bots gelezen uit de HTTP-respons.

export default defineEventHandler((event) => {
    const host = getRequestHeader(event, 'host') || ''
    const subdomain = host.split('.')[0]

    const blockAll = ['www', 'staging']

    // Alleen toepassen op HTML-pagina's
    if (blockAll.includes(subdomain) && getRequestHeader(event, 'accept')?.includes('text/html')) {
        setHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
    }
})
