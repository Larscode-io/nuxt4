// server/routes/robots.txt.ts
// todo:
// wanneer we www.const-court.be effectief onder Nuxt 4 laat draaien,
// zodat we caching, canonical-URL’s en fallbackregels correct mee afstemmen.

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const host = url.host

  const sitemap = `Sitemap: https://${host}/sitemap.xml`

  const subdomain = host.split('.')[0] // nl, fr, de, en, www, etc.

  // Standaard: verbied toegang tot /public/
  let disallowRules = 'Disallow: /public/'

  // Enkel toegang geven tot /public/{taalcode}/ als subdomein exact nl, fr, de of en is
  const allowedLangs = ['nl', 'fr', 'de', 'en']
  if (allowedLangs.includes(subdomain)) {
    disallowRules = `
Disallow: /public/
Allow: /public/${subdomain.charAt(0)}/
`.trim()
  }

  const content = `
User-agent: *
${disallowRules}
${sitemap}
`.trim()

  setHeader(event, 'Content-Type', 'text/plain')
  return content
})


