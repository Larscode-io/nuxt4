import { RoutePathKeys } from '~/core/constants'

// server/api/menu/index.ts
// use this api as folows: const { data: courtItems } = await useFetch('/api/menu')

export default defineEventHandler(async (_event) => {
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
              to: RoutePathKeys.presentationAccomodation,
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
          subMenu: [
            {
              to: `${RoutePathKeys.presentationBasicTexts}#1-la-constitution-de-la-belgique-federale`,
              title: 'menu.court.official-text.constitution',
            },
            {
              to: `${RoutePathKeys.presentationBasicTexts}#2-legislation-organique`,
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
        },
        {
          to: RoutePathKeys.searchJudgment,
          title: 'menu.search.title',
        },
        {
          to: RoutePathKeys.judgmentsHome,
          title: 'menu.decisions.judgment',
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
          to: `${RoutePathKeys.agenda}#menu.decisions.title`,
          title: 'menu.agenda.upcoming-decisions',
        },
        {
          to: `${RoutePathKeys.agenda}#general.message.public-hearing`,
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
      to: RoutePathKeys.informed,
      title: 'menu.informed',
    },
    {
      title: 'menu.prize.title',
      subMenu: [
        {
          to: RoutePathKeys.prizeFR,
          title: 'menu.prize.title',
          condition: 'is-french',
        },
        {
          to: RoutePathKeys.prizeNL,
          title: 'menu.prize.title',
          condition: 'is-dutch',
        },
        {
          to: RoutePathKeys.prizeDE,
          title: 'menu.prize.title',
          condition: 'is-german',
        },
        {
          title: 'DEV',
          subMenu: [
            {
              to: RoutePathKeys.demoMailman,
              title: 'menu.demo-mailman',
            },
            {
              to: RoutePathKeys.demoLanguages,
              title: 'menu.demo-languages',
            },
            {
              to: RoutePathKeys.authLogin,
              title: 'menu.auth-login',
            },
            {
              to: RoutePathKeys.legacyContent,
              title: 'menu.legacy-content',
            },
          ],
        },
      ],
    },

  ]
})
