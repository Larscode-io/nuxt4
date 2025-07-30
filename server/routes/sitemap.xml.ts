export default defineEventHandler((event) => {
  const host = getRequestHeader(event, 'host') || ''
  const supportedLocales = ['nl', 'fr', 'en', 'de']
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1')

  const domainPrefix = isLocal
    ? 'nl' // standaard locale bij lokale test
    : host.split('.')[0]

  const locale = supportedLocales.includes(domainPrefix) ? domainPrefix : 'nl'
  const baseUrl = isLocal
    ? `http://${host}`
    : `https://${locale}.const-court.be`

  const pathList = [
    '/judgments',
    '/search/judgment',
    '/court/basic-text',
    '/judgments/pending-cases',
    `/public/${locale.charAt(0)}`,
    '/court/presentation/jurisdiction',
    '/court/presentation/organization',
    '/court/presentation/history-of-the-court',
    '/court/presentation/how-the-court-operates',
    '/court/presentation/publications-on-the-court',
    '/media/press-releases-concerning-the-judgments',
  ]

  const today = new Date().toISOString().split('T')[0]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pathList.map(path => {
    const alternates = supportedLocales.map(lang => {
      return `    <xhtml:link rel="alternate" hreflang="${lang}" href="https://${lang}.const-court.be${path}" />`
    }).join('\n')

    return `  <url>
    <loc>${baseUrl}${path}</loc>
${alternates}
    <lastmod>${today}</lastmod>
  </url>`
  }).join('\n')}
</urlset>`

  setResponseHeader(event, 'Content-Type', 'application/xml')
  return xml
})
