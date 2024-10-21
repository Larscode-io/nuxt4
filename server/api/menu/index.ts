// server/api/menu/index.ts

export default defineEventHandler(async (_event) => {
    return [
        {
            title: 'menu.court.title',
            subMenu: [
                {
                    title: 'menu.court.presentation.title',
                    subMenu: [
                        {
                            to: 'route-path-keys.presentation-situation',
                            title: 'menu.court.presentation.history-of-court'
                        },
                        {
                            to: 'route-path-keys.presentation-organization',
                            title: 'menu.court.presentation.organization'
                        },
                        {
                            to: 'route-path-keys.presentation-jurisdiction',
                            title: 'menu.court.presentation.jurisdiction'
                        },
                        {
                            to: 'route-path-keys.presentation-procedure',
                            title: 'menu.court.presentation.procedure'
                        },
                        {
                            to: 'route-path-keys.presentation-how-the-court-operates',
                            title: 'menu.court.presentation.how-the-court-works'
                        },
                        {
                            to: 'route-path-keys.presentation-accomodation',
                            title: 'menu.court.presentation.building'
                        },
                        {
                            to: 'route-path-keys.presentation-publications-on-the-court',
                            title: 'menu.court.presentation.publication-on-the-court'
                        },
                        {
                            to: 'route-path-keys.presentation-international-relations-of-the-court',
                            title: 'menu.court.presentation.international-relations-of-the-court'
                        },
                        {
                            to: 'route-path-keys.presentation-eproc',
                            title: 'menu.court.presentation.eproc'
                        }
                    ]
                },
                {
                    title: 'menu.court.official-text.title',
                    subMenu: [
                        {
                            to: 'route-path-keys.presentation-basic-texts#1-la-constitution-de-la-belgique-federale',
                            title: 'menu.court.official-text.constitution'
                        },
                        {
                            to: 'route-path-keys.presentation-basic-texts#2-legislation-organique',
                            title: 'menu.court.official-text.organic-legislation'
                        },
                        {
                            to: 'route-path-keys.presentation-basic-texts#3-arrets-organiques',
                            title: 'menu.court.official-text.organic-judgment'
                        },
                        {
                            to: 'route-path-keys.presentation-basic-texts#4-reglements',
                            title: 'menu.court.official-text.regulations-and-directives'
                        }
                    ]
                },
                {
                    title: 'menu.court.publications.title',
                    subMenu: [
                        {
                            to: 'route-path-keys.publication-annual-reports',
                            title: 'menu.court.publications.annual-reports'
                        },
                        {
                            to: 'route-path-keys.publication-brochure',
                            title: 'menu.court.publications.brochure'
                        },
                        {
                            to: 'route-path-keys.publication-studies',
                            title: 'menu.court.publications.studies'
                        },
                        {
                            to: 'route-path-keys.publication-speeches',
                            title: 'menu.court.publications.speeches'
                        }
                    ]
                },
                {
                    title: 'menu.court.job-offers.title',
                    subMenu: [
                        {
                            to: 'route-path-keys.presentation-job-offers',
                            title: 'menu.court.job-offers.offers'
                        }
                    ]
                }
            ]
        },
        {
            title: 'menu.decisions.title',
            subMenu: [
                {
                    to: 'route-path-keys.judgments-pending-cases',
                    title: 'menu.decisions.pending-cases'
                },
                {
                    to: 'route-path-keys.search-judgment',
                    title: 'menu.search.title'
                },
                {
                    to: 'route-path-keys.judgments-home',
                    title: 'menu.decisions.judgment'
                },
                {
                    to: 'route-path-keys.judgments-preliminary-rulings-from-court-justice-eu',
                    title: 'menu.decisions.preliminary-rulings-from-the-court-of-justice-of-the-eu'
                }
            ]
        },
        {
            title: 'menu.agenda.title',
            subMenu: [
                {
                    to: 'route-path-keys.agenda#menu.decisions.title',
                    title: 'menu.agenda.upcoming-decisions'
                },
                {
                    to: 'route-path-keys.agenda#general.message.public-hearing',
                    title: 'menu.agenda.scheduled-public-hearings'
                }
            ]
        },
        {
            title: 'menu.press-and-media.title',
            subMenu: [
                {
                    to: 'route-path-keys.media-general-press-releases',
                    title: 'menu.press-and-media.general-press-releases'
                },
                {
                    to: 'route-path-keys.media-press-releases-concerning-the-judgments',
                    title: 'menu.press-and-media.press-releases-concerning-the-judgments'
                },
                {
                    to: 'route-path-keys.media',
                    title: 'menu.press-and-media.media-unit'
                }
            ]
        },
        {
            title: 'menu.rule.title',
            subMenu: [
                {
                    to: 'route-path-keys.rule-recommendations-to-the-judges-a-quo-and-the-parties',
                    title: 'menu.rule.recommendations-to-the-judges-a-quo-and-the-parties'
                },
                {
                    to: 'route-path-keys.rule-anonymization-policy',
                    title: 'menu.rule.anonymization-policy'
                },
                {
                    to: 'route-path-keys.rule-pleadings-procedure',
                    title: 'menu.rule.pleadings-procedure'
                }
            ]
        },
        {
            to: 'route-path-keys.informed',
            title: 'menu.informed'
        },
        {
            title: 'menu.prize.title',
            subMenu: [
                {
                    to: 'route-path-keys.prize-fr',
                    title: 'menu.prize.title',
                    condition: 'is-french'
                },
                {
                    to: 'route-path-keys.prize-nl',
                    title: 'menu.prize.title',
                    condition: 'is-dutch'
                },
                {
                    to: 'route-path-keys.prize-de',
                    title: 'menu.prize.title',
                    condition: 'is-german'
                }
            ]
        }
    ];
})