import { defineEventHandler, setResponseHeader, getRequestHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const today = new Date().toISOString().split('T')[0]

  // Extract subdomain from the Host header
  const host = getRequestHeader(event, 'host') || ''
  const subdomain = host.split('.')[0] // e.g., 'fr' from 'fr.const-court.be'

  // Fallback locale if subdomain is not a valid one
  const locale = ['nl', 'fr', 'de', 'en'].includes(subdomain) ? subdomain : 'nl'
  const langCode = locale.toUpperCase()

  const publicBase = `https://${locale}.const-court.be/public/media`
  const pageBase = `https://${locale}.const-court.be/media/video`

  const descriptions: Record<string, string> = {
    nl: 'Video van het Grondwettelijk Hof',
    fr: 'Vidéo de la Cour constitutionnelle',
    de: 'Video des Verfassungsgerichtshofs',
    en: 'Video of the Constitutional Court'
  }

  const description = descriptions[locale]

  const videoFiles = [
    `FILM1-${langCode}-DEF31032025-SUBTITLES-XX.mp4`,
    `FILM1-${langCode}-DEF31032025-TRANSCRIPT-XX.mp4`,
    `FILM2-${langCode}-DEF31032025-SUBTITLES-XX.mp4`,
    `FILM2-${langCode}-DEF31032025-TRANSCRIPT-XX.mp4`,
    `FILM3-${langCode}-DEF31032025-SUBTITLES-XX.mp4`,
    `FILM3-${langCode}-DEF31032025-TRANSCRIPT-XX.mp4`
  ]

  // todo: loc moet verwijzen naar de pagina waar de video wordt afgespeeld, niet direct naar het bestand
  //       dit kan later worden aangepast als we de video player hebben geïmplementeerd
  //       nu is het een directe link naar het bestand, wat niet ideaal is voor SEO
  //       de pagina zou ook metadata moeten bevatten zoals titel, beschrijving, etc.
  //       voor nu gebruiken we de bestandsnaam als titel en beschrijving, maar dit
  //       is niet optimaal voor SEO en gebruikerservaring
  //       we kunnen dit later verbeteren door een aparte metadata structuur te gebruiken
  //       of door de video player te integreren in de pagina
  //       voor nu is dit een tijdelijke oplossing om de sitemap te genereren
  //       en de video bestanden te indexeren

  // todo: thumbnail_loc is currently commented out, as we don't have thumbnails yet
  // <video:thumbnail_loc>${publicBase}/thumbnails/${slug}.jpg</video:thumbnail_loc>

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videoFiles.map(file => {
    const slug = file.replace('.mp4', '')
    return `  <url>
    <loc>${pageBase}/${slug}</loc>
    <video:video>
      <video:title>${file}</video:title>
      <video:description>${description} (${file})</video:description>
      <video:content_loc>${publicBase}/${locale === 'nl' ? 'n' : locale === 'fr' ? 'f' : locale === 'de' ? 'd' : 'e'}/${file}</video:content_loc>
      <video:publication_date>${today}</video:publication_date>
    </video:video>
  </url>`
  }).join('\n')}
</urlset>`

  setResponseHeader(event, 'Content-Type', 'application/xml')
  return xml
})
