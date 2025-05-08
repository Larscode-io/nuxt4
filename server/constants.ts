import { RoutePathKeys } from '~/core/constants'

export enum Languages {
  ENGLISH = 'en',
  FRENCH = 'fr',
  DUTCH = 'nl',
  GERMAN = 'de',
}
export type LanguageKeys = Languages.GERMAN | Languages.DUTCH | Languages.FRENCH

export const DEFAULT_LANGUAGE = Languages.DUTCH
export const DEFAULT_PAGE_SIZE = 30
export const DEFAULT_PAGE_NUMBER = 1

export enum HttpErrorResponseCode {
  UNKNOWN_SERVER_ERROR = '',
}

export const HttpErrorResponseCodeToTranslateLabelKey = {}

export const EMPTY_VALUE = '----'
