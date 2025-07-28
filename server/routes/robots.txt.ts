// server/routes/robots.txt.ts
export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const host = url.host

  const sitemap = `Sitemap: https://${host}/sitemap.xml`

  const subdomain = host.split('.')[0] // nl, fr, de, en, www, ...

  let disallowRules = 'Disallow: /public/'

  // Enkel toegang geven tot /public/{taal}/ als de subdomein een geldige taalcode is
  const allowedLangs = ['nl', 'fr', 'de', 'en']
  if (allowedLangs.includes(subdomain)) {
    disallowRules = `
Disallow: /public/
Allow: /public/${subdomain}/
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

