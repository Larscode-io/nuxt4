// server/routes/video-sitemap.nl.xml.ts
import { defineEventHandler, setResponseHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const baseUrl = 'https://www.const-court.be/public/media'
  const today = new Date().toISOString().split('T')[0]

  // Determine locale from query or default to 'nl'
  const locale = event.context.params?.locale || 'nl'
  const langCode = ['nl', 'fr', 'de', 'en'].includes(locale) ? locale.toUpperCase() : 'NL'

  // Video files with dynamic language code
  const videoFiles = [
    `FILM1-${langCode}-DEF31032025-SUBTITLES-XX.mp4`,
    `FILM1-${langCode}-DEF31032025-TRANSCRIPT-XX.mp4`,
    `FILM2-${langCode}-DEF31032025-SUBTITLES-XX.mp4`,
    `FILM2-${langCode}-DEF31032025-TRANSCRIPT-XX.mp4`,
    `FILM3-${langCode}-DEF31032025-SUBTITLES-XX.mp4`,
    `FILM3-${langCode}-DEF31032025-TRANSCRIPT-XX.mp4`
  ]

  // Descriptions per language
  const descriptions: Record<string, string> = {
    nl: 'Video van het Grondwettelijk Hof',
    fr: 'Vidéo de la Cour constitutionnelle',
    de: 'Video des Verfassungsgerichtshofs',
    en: 'Video of the Constitutional Court'
  }
  const description = descriptions[locale] || descriptions['nl']

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videoFiles.map(file => `  <url>
    <loc>${baseUrl}/${file}</loc>
    <video:video>
      <video:thumbnail_loc>${baseUrl}/thumbnails/${file.replace('.mp4', '.jpg')}</video:thumbnail_loc>
      <video:title>${file}</video:title>
      <video:description>${description} (${file})</video:description>
      <video:content_loc>${baseUrl}/${file}</video:content_loc>
      <video:publication_date>${today}</video:publication_date>
    </video:video>
  </url>`).join('\n')}
</urlset>`

  setResponseHeader(event, 'Content-Type', 'application/xml')
  return xml
})
