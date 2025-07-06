// import { RoutePathKeys } from '../core/constants'
// import { i18nKeys } from '../lang/keys'

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

// export const searchTabs = [
//   {
//     id: i18nKeys.general.message.judgment,
//     to: RoutePathKeys.searchJudgment,
//   },
//   {
//     id: i18nKeys.general.message.standard,
//     to: RoutePathKeys.searchStandard,
//   },
//   {
//     id: i18nKeys.general.message.systematicTableContentsLabel,
//     to: RoutePathKeys.searchTableOfContent,
//   },
//   {
//     id: i18nKeys.general.message.judgmentKeywordsSummary,
//     to: RoutePathKeys.searchJudgmentKeywordSummary,
//   },
//   {
//     id: i18nKeys.general.message.fullTextOfJudgments,
//     to: RoutePathKeys.searchFullTextJudgment,
//   },
//   {
//     id: i18nKeys.general.message.keywordsJudgmentsPendingCases,
//     to: RoutePathKeys.searchJudgmentsAndPendingCases,
//   },
// ]
