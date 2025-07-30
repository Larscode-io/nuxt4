// server/api/video.xml.ts

import { defineEventHandler, setResponseHeader, getRequestHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const today = new Date().toISOString().split('T')[0]

  // Bepaal de subdomein/locale uit de hostheader
  const host = getRequestHeader(event, 'host') || ''
  const subdomain = host.split('.')[0]
  const locale = ['nl', 'fr', 'de', 'en'].includes(subdomain) ? subdomain : 'nl'
  const langCode = locale.toUpperCase()

  const publicBase = `https://${locale}.const-court.be/public/media`
  const pageBase = `https://${locale}.const-court.be/video`

  const descriptions: Record<string, string> = {
    nl: 'Video van het Grondwettelijk Hof',
    fr: 'Vidéo de la Cour constitutionnelle',
    de: 'Video des Verfassungsgerichtshofs',
    en: 'Video of the Constitutional Court'
  }

  const description = descriptions[locale]

  const videoFiles = [
    `FILM1-${langCode}-DEF31032025-SUBTI-XX.mp4`,
    `FILM1-${langCode}-DEF31032025-TRANS-XX.mp4`,
    `FILM2-${langCode}-DEF31032025-SUBTI-XX.mp4`,
    `FILM2-${langCode}-DEF31032025-TRANS-XX.mp4`,
    `FILM3-${langCode}-DEF31032025-SUBTI-XX.mp4`,
    `FILM3-${langCode}-DEF31032025-TRANS-XX.mp4`
  ]

  const videoMeta = {
    film1: {
      title: {
        nl: 'Rol en bevoegdheid van het Grondwettelijk Hof',
        fr: 'Rôle et compétence de la Cour constitutionnelle',
        de: 'Rolle und Zuständigkeit des Verfassungsgerichtshofs',
        en: 'Role and Powers of the Constitutional Court'
      },
      description: {
        nl: 'In deze video krijgt u inzicht in de rol en bevoegdheden van het Grondwettelijk Hof.',
        fr: 'Cette vidéo explique le rôle et les compétences de la Cour constitutionnelle.',
        de: 'Dieses Video erläutert die Rolle und Zuständigkeiten des Verfassungsgerichtshofs.',
        en: 'This video explains the role and powers of the Constitutional Court.'
      },
      duration: 'PT2M45S'
    },
    film2: {
      title: {
        nl: 'Inleiding van een zaak bij het Grondwettelijk Hof',
        fr: 'Introduction d’une affaire devant la Cour',
        de: 'Einleitung einer Rechtssache vor dem Gerichtshof',
        en: 'Filing a Case at the Constitutional Court'
      },
      description: {
        nl: 'U krijgt inzicht in hoe een zaak wordt gestart bij het Hof.',
        fr: 'Découvrez comment une affaire est introduite devant la Cour.',
        de: 'Ein Überblick, wie ein Verfahren vor dem Gerichtshof eingeleitet wird.',
        en: 'Learn how a case is brought before the Constitutional Court.'
      },
      duration: 'PT2M30S'
    },
    film3: {
      title: {
        nl: 'Werking van het Grondwettelijk Hof',
        fr: 'Fonctionnement de la Cour constitutionnelle',
        de: 'Arbeitsweise des Verfassungsgerichtshofs',
        en: 'Operation of the Constitutional Court'
      },
      description: {
        nl: 'Een overzicht van de praktische werking van het Hof.',
        fr: 'Un aperçu du fonctionnement pratique de la Cour.',
        de: 'Ein Überblick über die praktische Arbeitsweise des Gerichts.',
        en: 'An overview of the practical operation of the Court.'
      },
      duration: 'PT2M20S'
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videoFiles.map((file) => {
    const isTrans = file.includes('TRANS')
    const base = file.match(/FILM[123]/)?.[0].toLowerCase() || 'film1'
    const slug = isTrans ? `${base}-trans` : base

    const meta = videoMeta[base]

    return `  <url>
  <loc>${pageBase}/${slug}</loc>
  <video:video>
    <video:title>${meta.title[locale]}</video:title>
    <video:description>${meta.description[locale]}</video:description>
    <video:content_loc>${publicBase}/${file}</video:content_loc>
    <video:thumbnail_loc>${publicBase}/thumbnails/${base.toUpperCase()}.jpg</video:thumbnail_loc>
    <video:publication_date>${today}</video:publication_date>
    <video:duration>${meta.duration}</video:duration>
  </video:video>
</url>`

  }).join('\n')}
</urlset>`

  setResponseHeader(event, 'Content-Type', 'application/xml')
  return xml
})
