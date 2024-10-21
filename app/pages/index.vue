<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl

import { useLanguage } from '@/composables/useLanguage';
const { t, locale, switchLocalePath } = useLanguage();

const { data: combinedData, status } = await useAsyncData(async () => {
  console.log('Fetching data...')
  console.log(baseURL)
  const [judgments, pleadings, decisions] = await Promise.all([
    $fetch<Judgment[]>(`${baseURL}/api/v1/juris/judgments?lang=${locale.value}`),
    $fetch<Pleading[]>(`${baseURL}/api/v1/press/pleadings?lang=${locale.value}`),
    $fetch<Decision[]>(`${baseURL}/api/v1/press/judgments?lang=${locale.value}`)
  ]);
  return { judgments, pleadings, decisions };
});

const judgments = combinedData.value?.judgments?.slice(0, 6) || [];
const pleadings = combinedData.value?.pleadings?.slice(0, 6) || [];
const decisions = combinedData.value?.decisions?.slice(0, 6) || [];

interface Judgment {
  id: number;
  description: string;
  courtVerdict: string;
  nr: string;
  fileName: string;
  path: string;
  judmentDate: string;
  formatedJudmentDate: string;
  filePath: string;
  summary: string;
  idsRole: number[];
  availablePart: string;
  keywords: string;

}
interface Pleading {
  id: number;
  zuluDate: string;
  date: string;
  processingLanguage: string;
  description: string;
  day: string;
  month: string;
  hora: string;
  maxOfDates: string;
}
interface Decision {
  distance: number;
  id: number;
  joinedcases: any[];
  processingLanguage: string;
  description: string;
  day: string;
  month: string;
  nr: string;
  master: any;
  kenmerk: string;
  encinz: string;
  type: string;
  norm: string;
  date: string;
  formatedJudmentDate: string;
  dateLong: string;
}
</script>

<template>
  <div>
      <h1>Welcome to the new Home Page</h1>
      <h1>Built with Nuxt 3 Compatibility Version 4</h1>
      <h2>Here are our recent judgments:</h2>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col class="text-center">
          <div class="d-flex flex-wrap justify-center">
            <DecisionBox v-for="judgment of judgments" :id="judgment.id" :key="judgment.id" class="decisionBox"
              :reference="judgment.nr" :date="judgment.formatedJudmentDate" :zuludate="judgment.judmentDate"
              :title="judgment.courtVerdict" role="button" :description="judgment.description"
              :state="judgment.availablePart" @click-decision="goToJudgmentPage(judgment.id)" />
          </div>
        </v-col>
      </v-row>
    </v-container>
    <div v-if="judgments">
      <ul class="judgment-list">
        <li v-for="({ id, nr, formatedJudmentDate, description }) in judgments" :key="id">
          Nr: {{ nr }}, Date: {{ formatedJudmentDate }}, description: {{ description }}
        </li>
      </ul>
    </div>
    <div v-if="pleadings">
      <h2>Here are our upcoming pleadings:</h2>
      <ul class="pleading-list">
        <li v-for="({ id, day, month, description }) in pleadings" :key="id">
          {{ day }} {{ month }}, Id: {{ id }} Description: {{ description?.slice(0, 50) }}
        </li>
      </ul>
    </div>
    <div v-if="decisions">
      <h2>Here are our upcoming decisions:</h2>
      <ul class="pleading-list">
        <li v-for="({ id, day, month, encinz, nr }) in decisions" :key="id">
          {{ day }} {{ month }}, Id: {{ id }}, En cause: {{ encinz?.slice(0,50)}}, Nr: {{ nr }}
        </li>
      </ul>
    </div>
  </div>
</template>



<style scoped lang="scss">
* {
  box-sizing: border-box;
  font-family: proxima-nova, sans-serif;
  font-weight: 400;
}

.judgment-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  /* Adjust the gap as needed */
}

.judgment-list li {
  border: 1px solid #ccc;
  /* Optional: Add border to each item */
  padding: 10px;
  /* Optional: Add padding to each item */
}

.pleading-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.pleading-list li {
  border: 1px solid #ccc;
  padding: 10px;
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.container {
  padding: 0 !important;

  // @include mobile {
  //   padding: 32px;
  // }
}

.d-flex {
  max-width: 1260px;
  margin: auto;
  margin-bottom: 40px;

  // @include mobile {
  //   margin-bottom: 24px;
  // }
}

// .margins-tablet {
//   @include tablet {
//     margin-left: 16px;
//   }
// }

.decisionBox:focus,
.mediaCard:focus {
  outline: 3px solid black;
}

.v-card--link:focus:before {
  opacity: 0 !important;
}

.agenda-container {
  width: 100%;
  max-width: 760px;
  // margin: 0;
  display: flex;
}

.session-container {
  width: 100%;
}

.v-application--wrap {
  overflow: hidden;
}

// .v-parallax__image {
//   transform: none !important;
//   // top: 50%;
//   // width: 100% !important;
// }

#index-banner {
  width: 100%;
  // background-image: url('~/assets/img/banner-index.jpeg');
  background-size: cover;
  height: 60vh;
  // background-position: 50% 40% indien niet: position: fixed;
  // background-position: 50% 53%; alternatief: banner-index-2
  background-position: 50% 45%;
  background-attachment: fixed;

  // @include tablet {
  //   background-image: url('~/assets/img/banner-index-tablet.png');
  //   background-size: cover;
  //   height: 450px;
  //   background-position: center center;
  //   background-attachment: scroll;
  // }
}

#parallax-banner {
  width: 100%;
  height: 70vh;
  background-image: url('~/assets/img/banner-parallax.png');
  background-size: cover;
  background-attachment: fixed;
  background-position: 50% 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .heading-h2 {
    color: white;
    text-shadow: 0px 0px 3px $logoColor;


    // @include mobile {
    //   font-size: 1.25rem;
    //   width: calc(100% - 32px);
    // }
  }

  // @include tablet {
  //   background: url('~/assets/img/banner-parallax-tablet.png') no-repeat center center scroll;
  //   background-size: cover;
  //   height: 70vh;
  //   // background-position: 0 15%;
  // }
}

#parallax-banner>* {
  z-index: 2;
}

#parallax-banner::after {
  content: '';
  background: $indigoMediumLight;
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 1;
}

#parallax-banner>* {
  z-index: 2;
}

#parallax-banner::after {
  content: '';
  background: $indigoMediumLight;
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 1;
}

.myq:before {
  content: '\201C';
  font-size: 1.5em;
}

.myq:after {
  content: '\201D';
  font-size: 1.5em;
}
</style>
