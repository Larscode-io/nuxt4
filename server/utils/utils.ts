import { nlBE, fr, de, enGB } from 'date-fns/locale'
// dit zijn server constants, niet uit @core/constants
import { DEFAULT_LANGUAGE, Languages } from '../constants'

// /public/stet/n/stet-2016-003n.pdf

export function getPublicPathPDFFilePublicationsAnnualReport(
  lang = DEFAULT_LANGUAGE,
  fileName: string,
) {
  return `/public/jvra/${lang.slice(0, 1)}/${fileName}`
}

export function getPublicPathPDFFilePublicationsStudies(
  lang = DEFAULT_LANGUAGE,
  fileName: string,
) {
  return `/public/stet/${lang.slice(0, 1)}/${fileName}`
}

export function getPublicPathPDFFilePublicationsBrochures(
  lang = DEFAULT_LANGUAGE,
  fileName: string,
) {
  return `/public/brbr/${lang.slice(0, 1)}/${fileName}`
}

export function getPublicPathPDFFilePublicationsGeneralPress(
  lang = DEFAULT_LANGUAGE,
  fileName: string,
) {
  return `/public/pbcp/${lang.slice(0, 1)}/${fileName}`
}

export function getPublicPathPDFFileGeneralPressRelease(
  lang = DEFAULT_LANGUAGE,
  fileName: string,
) {
  return `/public/pbcp/${lang.slice(0, 1)}/${fileName}`
}

export function getPublicPathPDFFile(
  lang = DEFAULT_LANGUAGE,
  fileName: string,
) {
  return `/public/${lang.slice(0, 1)}/${fileName}`
}

export function getFileNameWithLang(filename: string, lang?: string, ext = '.pdf'): string {
  const fileNameWithoutExt = filename.substring(0, filename.indexOf(ext))
  return `${fileNameWithoutExt}${lang?.[0] ?? ''}${ext}`
}

export function flatten(array = []) {
  return [].concat(...array)
}

export const getLocaleForDateFormat = (lang = Languages.FRENCH) => {
  const map = {
    [Languages.FRENCH]: fr,
    [Languages.GERMAN]: de,
    [Languages.DUTCH]: nlBE,
    [Languages.ENGLISH]: enGB,
  }

  return map[lang]
}

export function unique(array = []) {
  return [...new Set(array)]
}

// gebruikt in server/api/newsletter/newsletter-get-upcoming-pleadings.ts
export const sortUpcomingPleadings = (aViews: any[]) => {
  return aViews.sort(
    (a, b) => a.date - b.date || a.hora.toString().localeCompare(b.hora),
  )
}
