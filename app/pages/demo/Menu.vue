<!--
The First-Level Menu Items can be simple buttons or buttons that open submenus.
The Second-Level Menu Items are displayed horizontally within the dropdown.
The Third-Level Menu Items (if present) are organized in a grid within their parent second-level item,
allowing for multiple columns.
The dropdown is not absolute to the parent button, but rather to the top of the screen.
-->

<!-- todo: add media queries to adjust the submenu's styling for mobile devices. -->

<script setup>
import { ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()
definePageMeta({
  layout: 'leeg',
})

const menu = [{ title: 'menu.court.title', subMenu: [{ title: 'menu.court.presentation.title', subMenu: [{ to: 'court-presentation-history-of-the-court', title: 'menu.court.presentation.history-of-court' }, { to: 'court-presentation-jurisdiction', title: 'menu.court.presentation.jurisdiction' }, { to: 'court-presentation-procedure', title: 'menu.court.presentation.procedure' }, { to: 'court-presentation-how-the-court-operates', title: 'menu.court.presentation.how-the-court-works' }, { to: 'court-presentation-accomodation', title: 'menu.court.presentation.building' }, { to: 'court-presentation-publications-on-the-court', title: 'menu.court.presentation.publication-on-the-court' }, { to: 'court-presentation-international-relations-of-the-court', title: 'menu.court.presentation.international-relations-of-the-court' }, { to: 'court-presentation-eproc', title: 'menu.court.presentation.eproc' }] }, { title: 'menu.court.official-text.title', count: 2, subMenu: [{ to: 'court-basic-text', title: 'menu.court.official-text.constitution' }, { to: 'court-basic-text', title: 'menu.court.official-text.organic-legislation' }, { to: 'court-basic-text#3-arrets-organiques', title: 'menu.court.official-text.organic-judgment' }, { to: 'court-basic-text#4-reglements', title: 'menu.court.official-text.regulations-and-directives' }] }, { title: 'menu.court.publications.title', subMenu: [{ to: 'court-publications-annual-reports', title: 'menu.court.publications.annual-reports' }, { to: 'court-publications-brochures', title: 'menu.court.publications.brochure' }, { to: 'court-publications-studies', title: 'menu.court.publications.studies' }, { to: 'court-publications-speeches', title: 'menu.court.publications.speeches' }] }, { title: 'menu.court.job-offers.title', count: 2, subMenu: [{ to: 'court-job-offers', title: 'menu.court.job-offers.offers' }] }] }, { title: 'menu.decisions.title', subMenu: [{ to: 'judgments-pending-cases', title: 'menu.decisions.pending-cases', count: 2 }, { to: 'search-judgment', title: 'menu.search.title' }, { to: 'judgments', title: 'menu.decisions.judgment', count: 2 }, { to: 'judgments-preliminary-rulings-from-the-court-of-justice-of-the-european-union', title: 'menu.decisions.preliminary-rulings-from-the-court-of-justice-of-the-eu' }] }, { title: 'menu.agenda.title', subMenu: [{ to: 'agenda#menu.decisions.title', title: 'menu.agenda.upcoming-decisions' }, { to: 'agenda#general.message.public-hearing', title: 'menu.agenda.scheduled-public-hearings' }] }, { title: 'menu.press-and-media.title', subMenu: [{ to: 'media-general-press-releases', title: 'menu.press-and-media.general-press-releases' }, { to: 'media-press-releases-concerning-the-judgments', title: 'menu.press-and-media.press-releases-concerning-the-judgments' }, { to: 'media', title: 'menu.press-and-media.media-unit' }] }, { title: 'menu.rule.title', subMenu: [{ to: 'rule-recommendations-to-the-judges-a-quo-and-the-parties', title: 'menu.rule.recommendations-to-the-judges-a-quo-and-the-parties' }, { to: 'rule-anonymization-policy', title: 'menu.rule.anonymization-policy' }, { to: 'rule-pleadings-procedure', title: 'menu.rule.pleadings-procedure' }] }, { to: 'media-prix', title: 'menu.prize.title' }, { title: 'DEV', subMenu: [{ to: 'demo-mailman', title: 'Mailman subscription demo' }, { to: 'demo-languages', title: 'i18n and languages demo' }, { to: 'auth-login', title: 'EID authentication demo' }, { to: 'legacyContent', title: 'LegacyContent demo' }, { to: '/demo/sql', title: 'SQL demo' }, { to: '/demo/fm', title: 'FileMaker demo' }, { to: '/demo/Juportal', title: 'Juportal demo' }] }]

const hoveredMenu = ref(null)
function hoverMenu(index) {
  hoveredMenu.value = index
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(item, index) in menu"
        :key="item.title"
        class="menu-item"
      >
        <div
          v-if="item.subMenu"
          class="menu-title"
          @mouseenter="hoverMenu(index)"
          @mouseleave="hoverMenu(null)"
        >
          {{ t(item.title) }}
          <div
            v-if="hoveredMenu === index && item.subMenu"
            class="submenu-container"
          >
            <v-container fluid>
              <v-row class="d-flex flex-row justify-space-evenly ">
                <v-col
                  v-for="(subItem) in item.subMenu"
                  :key="subItem.title"
                  cols="auto toEnableJustifyInRow"
                >
                  <div v-if="subItem.subMenu">
                    <span class="submenu-title">{{ t(subItem.title) }}</span>
                    <div
                      v-if="subItem.subMenu"
                      class="mega-menu"
                    >
                      <v-row class="d-flex flex-column">
                        <v-col
                          v-for=" (thirdLevelItem) in subItem.subMenu"
                          :key="thirdLevelItem.title"
                        >
                          <a :href="thirdLevelItem.to">{{ t(thirdLevelItem.title) }}</a>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                  <a
                    v-else
                    :href="subItem.to"
                    class="full-width-link"
                  >{{ t(subItem.title) }}
                  </a>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
        <button v-else>
          {{ t(item.title) }}
        </button>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.full-width-link {
    display: block;
    width: 100%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.menu-title {
    cursor: pointer;
    position: relative;
}

.submenu-container {
    position: fixed;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
    padding: 10px;
}

.menu-item {
    position: relative;
}
.v-row.d-flex.flex-row {
    flex-wrap: nowrap;
}
</style>
