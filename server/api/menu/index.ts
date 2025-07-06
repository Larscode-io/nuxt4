import { RoutePathKeys } from '~/core/constants'

// `to` values must be unique—even if the route is the same—
// as Vuetify uses them to generate internal keys and IDs.
// Add a unique hash (e.g., #x) or query (?q=x) to avoid rendering conflicts.

export default defineEventHandler(async () => {
  return [
    {
      title: 'menu.court.title',
      subMenu: [
        {
          title: 'menu.court.presentation.title',
          subMenu: [
            {
              to: RoutePathKeys.presentationSituation,
              title: 'menu.court.presentation.history-of-court',
            },
            {
              to: RoutePathKeys.presentationOrganization,
              title: 'menu.court.presentation.organization',
            },
            {
              to: RoutePathKeys.presentationJurisdiction,
              title: 'menu.court.presentation.jurisdiction',
            },
            {
              to: RoutePathKeys.presentationProcedure,
              title: 'menu.court.presentation.procedure',
            },
            {
              to: RoutePathKeys.presentationHowTheCourtOperates,
              title: 'menu.court.presentation.how-the-court-works',
            },
            {
              to: RoutePathKeys.presentationAccommodation,
              title: 'menu.court.presentation.building',
            },
            {
              to: RoutePathKeys.presentationPublicationsOnTheCourt,
              title: 'menu.court.presentation.publication-on-the-court',
            },
            {
              to: RoutePathKeys.presentationInternationalRelationsOfTheCourt,
              title: 'menu.court.presentation.international-relations-of-the-court',
            },
            {
              to: RoutePathKeys.presentationEproc,
              title: 'menu.court.presentation.eproc',
            },
          ],
        },
        {
          title: 'menu.court.official-text.title',
          count: 2,
          subMenu: [
            {
              to: `${RoutePathKeys.presentationBasicTexts}`,
              title: 'menu.court.official-text.constitution',
            },
            {
              to: `${RoutePathKeys.presentationBasicTexts}#2`,
              title: 'menu.court.official-text.organic-legislation',
            },
            {
              to: `${RoutePathKeys.presentationBasicTexts}#3-arrets-organiques`,
              title: 'menu.court.official-text.organic-judgment',
            },
            {
              to: `${RoutePathKeys.presentationBasicTexts}#4-reglements`,
              title: 'menu.court.official-text.regulations-and-directives',
            },
          ],
        },
        {
          title: 'menu.court.publications.title',
          subMenu: [
            {
              to: RoutePathKeys.publicationAnnualReports,
              title: 'menu.court.publications.annual-reports',
            },
            {
              to: RoutePathKeys.publicationBrochure,
              title: 'menu.court.publications.brochure',
            },
            {
              to: RoutePathKeys.publicationStudies,
              title: 'menu.court.publications.studies',
            },
            {
              to: RoutePathKeys.publicationSpeeches,
              title: 'menu.court.publications.speeches',
            },
          ],
        },
        {
          title: 'menu.court.job-offers.title',
          count: 2,
          subMenu: [
            {
              to: RoutePathKeys.presentationJobOffers,
              title: 'menu.court.job-offers.offers',
            },
          ],
        },
      ],
    },
    {
      title: 'menu.decisions.title',
      subMenu: [
        {
          to: RoutePathKeys.judgmentsPendingCases,
          title: 'menu.decisions.pending-cases',
          count: 2,
        },
        {
          to: RoutePathKeys.searchJudgment,
          title: 'menu.search.title',
        },
        {
          to: RoutePathKeys.judgmentsHome,
          title: 'menu.decisions.judgment',
          count: 2,
        },
        {
          to: RoutePathKeys.judgmentsPreliminaryRulingsFromCourtJusticeEU,
          title: 'menu.decisions.preliminary-rulings-from-the-court-of-justice-of-the-eu',
        },
      ],
    },
    {
      title: 'menu.agenda.title',
      subMenu: [
        {
          title: 'menu.agenda.upcoming-decisions',
        },
        {
          to: `${RoutePathKeys.agenda}`,
          title: 'menu.agenda.scheduled-public-hearings',
        },
      ],
    },
    {
      title: 'menu.press-and-media.title',
      subMenu: [
        {
          to: RoutePathKeys.mediaGeneralPressReleases,
          title: 'menu.press-and-media.general-press-releases',
        },
        {
          to: RoutePathKeys.mediaPressReleasesConcerningTheJudgments,
          title: 'menu.press-and-media.press-releases-concerning-the-judgments',
        },
        {
          to: RoutePathKeys.media,
          title: 'menu.press-and-media.media-unit',
        },
        {
          to: RoutePathKeys.informed,
          title: 'menu.informed',
        },

      ],
    },
    {
      title: 'menu.rule.title',
      subMenu: [
        {
          to: RoutePathKeys.ruleRecommendationsToTheJudgesAQuoAndTheParties,
          title: 'menu.rule.recommendations-to-the-judges-a-quo-and-the-parties',
        },
        {
          to: RoutePathKeys.ruleAnonymizationPolicy,
          title: 'menu.rule.anonymization-policy',
        },
        {
          to: RoutePathKeys.rulePleadingsProcedure,
          title: 'menu.rule.pleadings-procedure',
        },
      ],
    },
    {
      to: RoutePathKeys.prize,
      title: 'menu.prize.title',
    },
    // {
    //   title: 'DEV',
    //   subMenu: [
    //     {
    //       to: RoutePathKeys.demoMailman,
    //       title: 'Mailman subscription demo',
    //     },
    //     {
    //       to: RoutePathKeys.demoLanguages,
    //       title: 'i18n and languages demo',
    //     },
    //     {
    //       to: RoutePathKeys.authLogin,
    //       title: 'EID authentication demo',
    //     },
    //     {
    //       to: RoutePathKeys.legacyContent,
    //       title: 'LegacyContent demo',
    //     },
    //     {
    //       to: '/demo/sql',
    //       title: 'SQL demo',
    //     },
    //     {
    //       to: '/demo/fm',
    //       title: 'FileMaker demo',
    //     },
    //     {
    //       to: '/demo/Juportal',
    //       title: 'Juportal demo',
    //     },
    //     {
    //       to: '/colorDemo',
    //       title: 'setting Colors',
    //     },
    //   ],
    // },
  ]
})
