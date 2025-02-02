// import { RoutePathKeys } from '../core/constants'
// import { i18nKeys } from '../lang/keys'

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

/* export const searchTabs = [
  {
    id: 'general.message.judgment',
    to: RoutePathKeys.searchJudgment,
  },
  {
    id: 'general.message.standard',
    to: RoutePathKeys.searchStandard,
  },
  {
    id: 'general.message.systematic-table-contents-label',
    to: RoutePathKeys.searchTableOfContent,
  },
  {
    id: 'general.message.judgment-keywords-summary',
    to: RoutePathKeys.searchJudgmentKeywordSummary,
  },
  {
    id: 'general.message.full-text-of-judgments',
    to: RoutePathKeys.searchFullTextJudgment,
  },
  {
    id: 'general.message.keywords-judgments-pending-cases',
    to: RoutePathKeys.searchJudgmentsAndPendingCases,
  },
] */
