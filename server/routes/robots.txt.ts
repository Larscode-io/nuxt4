// server/routes/robots.txt.ts
// this will expose the robots.txt file at /robots.txt

export default defineEventHandler((event) => {
  const host = getRequestURL(event).host
  const isStaging = host.includes('nuxt.const-court.be')

  // Disallow: /search/
  // Sitemap: https://www.const-court.be/sitemap.xml
  const production = `
User-agent: *
  `.trim()

  // Disallow: /
  const staging = `
User-agent: *
  `.trim()

  setHeader(event, 'Content-Type', 'text/plain')
  return isStaging ? staging : production
})
