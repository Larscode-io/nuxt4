export enum Languages {
  ENGLISH = 'en',
  FRENCH = 'fr',
  DUTCH = 'nl',
  GERMAN = 'de',
}

export const languageLabels: Record<Languages, string> = {
  [Languages.DUTCH]: 'Nederlands',
  [Languages.FRENCH]: 'Français',
  [Languages.GERMAN]: 'Deutsch',
  [Languages.ENGLISH]: 'English',
}
// Usage: console.log(languageLabels[Languages.DUTCH]); // outputs: Nederlands

export const REDIRECT_URI_WHEN_401 = 'auth/login'
export const DEFAULT_PAGE_SIZE = 30
export const DEFAULT_PAGE_NUMBER = 1

export enum HttpErrorResponseCode {
  UNKNOWN_SERVER_ERROR = '',
}

export const HttpErrorResponseCodeToTranslateLabelKey = {}

export enum CookieKeys {
  FEDID = 'x-const-court-fedid',
  ACCESS_TOKEN = 'x-const-court-access-token',
}

export enum CSAMLocalStorageKeys {
  STATE = 'const-court-csam-state',
  NONCE = 'const-court-csam-nonce',
}

export enum ApiUrl {

  publicationsAnnualReports = '/api/v1/publications/annual-reports',
  publicationsBrochures = '/api/v1/publications/brochures',
  publicationsStudies = '/api/v1/publications/studies',

  pressPleadings = '/api/v1/press/pleadings',
  pressJudgment = '/api/v1/press/judgments',

  pressGeneralRelease = '/api/v1/media/general-press-releases',
  pressGeneral = '/api/v1/media/general-press',
  pressReleasesConcerningJudgments = '/api/v1/media/press-releases-concerning-judgments',

  judgments = '/api/v1/juris/judgments',
  pendingCases = '/api/v1/juris/pending-cases',
  arcticlesConstReferredByConstCourt = '/api/v1/juris/articles-const-referred-by-const-court',
  questionsReferred = '/api/v1/juris/questions-referred',

  judgmentTypes = '/api/v1/search/judgment-types',
  applicantList = '/api/v1/search/applicant-list',
  applicantTypes = '/api/v1/search/applicant-types',
  jurisdictionList = '/api/v1/search/jurisdictions',
  jurisdictionAreaList = '/api/v1/search/jurisdiction-areas',

  searchJudgmentByRollNumberApplicantJurisdiction = '/api/v1/search/by-judgment-and-applicant',
  searchFullTextOfJudgments = '/api/v1/search/full-text-judgments',
  searchPendingCases = '/api/v1/search/pending-cases',
  searchJudgments = '/api/v1/search/judgments',
  searchForTableOfContent = '/api/v1/search/table-of-content',
  searchByControlledStandard = '/api/v1/search/by-controlled-standard',
  searchByReferenceStandard = '/api/v1/search/by-reference-standard',
  searchByJudgmentKeywordsSummary = '/api/v1/search/by-judgment-keywords-summary',

  upcomingVerdicts = '/api/v1/newsletter/get-upcoming-verdicts',
  upcomingVerdictsTable = '/api/v1/newsletter/get-upcoming-verdicts-table',
  upcomingPleadings = '/api/v1/newsletter/get-upcoming-pleadings',
  searchEncInz = '/api/v1/newsletter/get-encinz',

  openJobs = '/api/v1/film/vaca',
}

export enum MailmanUrl {
  subscribe = 'https://mailman.const-court.be/mailman/subscribe',
  options = 'https://mailman.const-court.be/mailman/options',
  rolout = 'https://mailman.const-court.be/mailman/subscribe/rolout',
}

export enum ContentKeys {
  presentationSituation = 'presentation-situation',
  presentationJurisdiction = 'presentation-jurisdiction',
  presentationOrganizationJudge = 'presentation-organization-judge',
  presentationOrganizationOfficeStaff = 'presentation-organization-office-staff',
  presentationOrganizationReferendar = 'presentation-organization-referendar',
  presentationOrganizationClerk = 'presentation-organization-clerk',
  presentationOrganizationCurrentMembership = 'current-membership',
  presentationOrganizationCurrentMembershipEmeritus = 'current-membership-emeritus',
  presentationOrganizationCurrentMembershipHistoric = 'current-membership-historic',
  presentationHowTheCourtOperates = 'presentation-how-the-court-operates',
  presentationProcedure = 'presentation-procedure',
  presentationAccomodation = 'presentation-accomodation',
  presentationPublicationsOnTheCourt = 'presentation-publications-on-the-court',
  presentationInternationalRelationsOfTheCourt = 'presentation-international-relations-of-the-court',
  presentationEproc = 'presentation-eproc',
  presentationBasicTexts = 'basic-texts',
  presentationBasicTextsReferenceArbitration = 'basic-texts-reference-arbitration',
  presentationBasicTextsOrganicLawSpecialLawOf6January1989OnTheConstitutionalCourt = 'basic-texts-organic-law-special-law-of-6-january-1989-on-the-constitutional-court',
  presentationJobOffers = 'job-offers',
  mediaMediaUnit = 'media-media-unit',
  mediaPictures = 'media-pictures',
  ruleRecommendationsToTheJudgesAQuoAndTheParties = 'rule-recommendations-to-the-judges-a-quo-and-the-parties',
  ruleAnonymizationPolicy = 'rule-anonymization-policy',
  rulePleadingsProcedure = 'rule-pleadings-procedure',
  ruleOthersInfo = 'rule-others-info',
  fullTextSearchExplanation = 'full-text-search-explanation',
  informed = 'stay-informed',

}

export enum RoutePathKeys {
  home = '/',
  mailing = 'mailing-email',
  presentationSituation = 'court-presentation-history-of-the-court',
  presentationJurisdiction = 'court-presentation-jurisdiction',
  presentationOrganization = 'court-presentation-organization',
  presentationOrganizationMember = 'court-presentation-members-id',
  presentationHowTheCourtOperates = 'court-presentation-how-the-court-operates',
  presentationProcedure = 'court-presentation-procedure',
  presentationAccomodation = 'court-presentation-accomodation',
  presentationPublicationsOnTheCourt = 'court-presentation-publications-on-the-court',
  presentationInternationalRelationsOfTheCourt = 'court-presentation-international-relations-of-the-court',
  presentationEproc = 'court-presentation-eproc',
  presentationBasicTexts = 'court-basic-text',
  presentationJobOffers = 'court-job-offers',
  publicationAnnualReports = 'court-publications-annual-reports',
  publicationBrochure = 'court-publications-brochures',
  publicationStudies = 'court-publications-studies',
  publicationSpeeches = 'court-publications-speeches',
  contact = 'contacts',
  agenda = 'agenda',
  legalDisclaimer = 'disclaimer',
  privacyPolicy = 'privacy-policy',
  judgmentsHome = 'judgments',
  judgmentsPendingCases = 'judgments-pending-cases',
  judgmentsPreliminaryRulingsFromCourtJusticeEU = 'judgments-preliminary-rulings-from-the-court-of-justice-of-the-european-union',
  media = 'media',
  search = 'search',
  searchJudgment = 'search-judgment',
  searchFullTextJudgment = 'search-full-text-judgment',
  searchJudgmentsAndPendingCases = 'search-judgments-and-pending-cases',
  searchStandard = 'search-standard',
  searchTableOfContent = 'search-table-of-content',
  searchJudgmentKeywordSummary = 'search-judgment-keyword-summary',
  mediaGeneralPressReleases = 'media-general-press-releases',
  mediaPressReleasesConcerningTheJudgments = 'media-press-releases-concerning-the-judgments',
  courtBasicTextTableOfTheArticlesOfTheConstitutionReferredToByTheConstitutionalCourt = 'court-basic-text-table-of-the-articles-of-the-constitution-referred-to-by-the-constitutional-court',
  ruleRecommendationsToTheJudgesAQuoAndTheParties = 'rule-recommendations-to-the-judges-a-quo-and-the-parties',
  ruleAnonymizationPolicy = 'rule-anonymization-policy',
  rulePleadingsProcedure = 'rule-pleadings-procedure',
  ruleOthersInfo = 'rule-others-info',
  informed = 'stay-informed',
  // PRIZE - Page : To delete - START
  prizeEN = 'prize',
  prizeFR = 'prix',
  prizeNL = 'prijs',
  prizeDE = 'preis',
  // PRIZE - Page : To delete - END
  demoMailman = 'demo-mailman',
  demoLanguages = 'demo-languages',
  authLogin = 'auth-login',
  legacyContent = 'legacyContent',
  hello = 'hello',
}

export enum MediaType {
  pressReleaseForJudgments = 'pressReleaseForJudgments',
  generalPressRelease = 'generalPressRelease',
}

export enum PendingCaseType {
  actionForCancellation = 'ActionForCancellation',
  questionsReferred = 'QuestionsReferred',
}

export enum OrganizationMemberRole {
  president = 'president',
  judge = 'judge',
  legalSecretaries = 'legalSecretaries',
  registrars = 'registrars',
}

export const DISCOURS_WORDS_FOR_FILTERING = [
  'Speech',
  'Speeches',
  'Rede',
  'Reden',
  'Discours',
  'Discours',
  'Toespraak',
  'Toespraken',
]

export interface Judgment {
  id: number
  description: string
  courtVerdict: string
  nr: string
  fileName: string
  path: string
  judmentDate: string
  formatedJudmentDate: string
  filePath: string
  summary: string
  idsRole: number[]
  availablePart: string
  keywords: string
}

export interface GeneralPressJudgment {
  id: number
  title: string
  description: string
  fileName: string
  filePath: string
  archived: boolean
}

export interface GeneralPressRelease {
  id: number
  title: string
  description: string
  fileName: string
  filePath: string
  archived: boolean
}

export interface Pleading {
  id: number
  zuluDate: string
  date: string
  processingLanguage: string
  description: string
  day: string
  month: string
  hora: string
  maxOfDates: string
  shortDescription: string
}

export interface Decision {
  distance: number
  id: number
  joinedcases: any[]
  processingLanguage: string
  description: string
  day: string
  month: string
  nr: string
  master: any
  kenmerk: string
  encinz: string
  type: string
  norm: string
  date: string
  formatedJudmentDate: string
  dateLong: string
  shortDescription: string
}

export interface GeneralPressRelease {
  id: number
  title: string
  description: string
  fileName: string
  filePath: string
  archived: boolean
}

export interface GeneralPressJudgment {
  id: number
  nr: string
  title: string
  description: string
  judmentDate: string
  formatedJudmentDate: string
  fileName: string
  path: string
  filePath: string
  archived: boolean
  picId: null
}
