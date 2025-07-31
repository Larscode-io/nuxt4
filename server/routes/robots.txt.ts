// server/routes/robots.txt.ts

// We have SEO-optimized Nuxt 4 site with visibility rules for different subdomains:
// nl.const-court.be	Dutch version (locale = nl)	✅ Yes
// fr.const-court.be	French version (locale = fr)	✅ Yes
// de.const-court.be	German version	✅ Yes
// en.const-court.be	English version	✅ Yes
// www.const-court.be	Locale selector (/lang) — no real content, is only used for locale selection	❌ No
// staging.const-court.be	Testing / previews, should never be indexed or crawled	❌ No

// todo:
// wanneer we www.const-court.be effectief onder Nuxt 4 laat draaien,
// zodat we caching, canonical-URL’s en fallbackregels correct mee afstemmen.

// 📌 Allowing /public/n, /public/f, etc. only on subdomains like nl., fr., de., en.
// ⛔ Denying access to /public/ for everything else — which is good

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const host = url.host
  const subdomain = host.split('.')[0] // e.g. nl, fr, de, en, www, staging

  // Define default rules
  let content = `
User-agent: *
Disallow: /
`.trim()

  // Define subdomains that are allowed to be indexed
  const allowedLangs = ['nl', 'fr', 'de', 'en']

  // If current subdomain is a valid language, allow limited access to /public/ and include sitemap
  if (allowedLangs.includes(subdomain)) {
    const sitemap = `Sitemap: https://${host}/sitemap.xml`
    const videoSitemap = `Sitemap: https://${host}/video.xml`

    content = `
User-agent: *
Disallow: /search/
Disallow: *?term=*
Allow: /public/${subdomain.charAt(0)}/
Disallow: /public/
${sitemap}
${videoSitemap}
`.trim()
  }

  setHeader(event, 'Content-Type', 'text/plain')
  setHeader(event, 'Cache-Control', 'public, max-age=3600') // cache 1u

  return content

})



