<template>
  <div>
    <v-card :id="`pending-cases-card-${id}`" class="pending-case-card">
      <div class="float-md-right float-lg-right pb-3">
        <v-btn v-if="isSubscribable" depressed elevation="2" medium rounded class="pending-case-btn"
          @click="dialog = true">
          {{ $t(i18nKeys.newsletter.rol.subscribe) }}
        </v-btn>
        <div v-else>
          {{ $tc(i18nKeys.general.message.judgmentDeliveries, 1) }}
        </div>
      </div>
      <div class="row-to-column">
        <h3>
          {{ $tc(i18nKeys.general.message.rollNumber) }}: {{ id }} ({{
            processingLanguage
          }})
        </h3>
      </div>
      <div class="row-to-column">
        <p class="h4">
          {{ $tc(i18nKeys.general.message.receiptDate) }}
        </p>
        <p>{{ receiptDate || emptyValue }}</p>
      </div>
      <div class="row-to-column">
        <p class="h4">
          {{ $tc(i18nKeys.general.message.dateOfHearing) }}
        </p>
        <p>{{ dateOfHearing || emptyValue }}</p>
      </div>
      <div class="row-to-column">
        <p class="h4">
          {{ $tc(i18nKeys.general.message.dateOfJudgment) }}
        </p>
        <p>{{ dateOfJudgment || emptyValue }}</p>
      </div>
      <div class="row-to-column">
        <p class="h4">
          {{ $tc(i18nKeys.general.message.concerning) }}
        </p>
        <p>{{ concerning || emptyValue }}</p>
      </div>
      <div v-if="linkedCaseNumber" class="row-to-column">
        <p class="h4">
          {{ $tc(i18nKeys.general.message.caseJoinedWithCaseNumbers) }}
        </p>
        <p>
          <a :href="`#pending-cases-card-${linkedCaseNumber}`">{{
            linkedCaseNumber
          }}</a>
        </p>
      </div>
      <div v-if="notificationArt74ToOfficialJournalLink &&
          notificationArt74ToOfficialJournalDate
          " class="row-to-column">
        <p class="h4" v-html="$tc(i18nKeys.general.message.notificationArt74BeOfficialJournal)
            .replace('Moniteur belge', '<i>Moniteur belge</i>')
            .replace('Belgisch Staatsblad', '<i>Belgisch Staatsblad</i>')
          " />
        <p>
          <a :href="notificationArt74ToOfficialJournalLink">{{
            notificationArt74ToOfficialJournalDate || emptyValue
          }}</a>
        </p>
      </div>
      <div v-if="joinedCases && joinedCases.length > 0" class="row-to-column">
        <p class="h4">
          {{ $tc(i18nKeys.general.message.joinedCase, joinedCases.length) }}
        </p>
        <p>
          <a v-for="caseNumber of joinedCases" :key="caseNumber" :href="`#pending-cases-card-${caseNumber}`" class="mr-3">
            {{ caseNumber }}</a>
        </p>
      </div>
      <div class="row-to-column">
        <p class="h4">
          {{ $tc(i18nKeys.general.message.keywords, 2) }}
        </p>

        <v-banner elevation="3" class="subtitle my-2">
          {{ keywords || $t(i18nKeys.error.noDataAvailable) }}
        </v-banner>
      </div>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="590" @keydown.esc="dialog = false" @click:outside="dialog = false">
      <v-card class="mx-auto pa-12 pb-8" elevation="8" rounded="lg">
        <v-card-title class="headline">
          {{ $t(i18nKeys.newsletter.rol.titel) }} {{ id }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="user.email" outlined :label="$t(i18nKeys.general.emailPlaceholder)" autofocus
            prepend-inner-icon="mdi-email-outline" @keyup.enter="subscribe" />
          <input id="check00" v-model="user.checkedAllGroups" type="checkbox">
          <label for="check00" class="mb-2">{{ $t(i18nKeys.newsletter.rol.allgroups) }}</label>
          <p v-if="subscriptionResult" class="mt-2 subscription-result">{{ subscriptionResult }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-3" text @click="dialog = false">{{
            $t(i18nKeys.general.message.close)
          }}</v-btn>
          <v-btn color="green darken-3" text @click="subscribe">{{
            $t(i18nKeys.general.subscribe)
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { MailmanUrl, RoutePathKeys } from '../core/constants'
import { EMPTY_VALUE } from '~/server/constants'
import { flatten } from '@/server/utils'

export default {
  name: 'PendingCaseCard',
  props: {
    id: {
      type: Number,
      required: true,
    },
    processingLanguage: {
      type: String,
      required: true,
    },
    receiptDate: {
      type: String,
      required: true,
    },
    dateOfHearing: {
      type: String,
      required: false,
      default: '',
    },
    dateOfJudgment: {
      type: String,
      required: false,
      default: '',
    },
    concerning: {
      type: String,
      required: true,
    },
    linkedCaseNumber: {
      type: String,
      required: false,
      default: '',
    },
    notificationArt74ToOfficialJournalDate: {
      type: String,
      required: false,
      default: '',
    },
    notificationArt74ToOfficialJournalLink: {
      type: String,
      required: false,
      default: '',
    },
    joinedCases: {
      type: Array,
      required: true,
    },
    keywords: {
      type: String,
      required: false,
      default: '',
    },
    isSubscribable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ['subscribe'],
  data() {
    return {
      dialog: false,
      i18nKeys,
      user: {
        email: null,
        checkedAllGroups: false,
      },
      emptyValue: EMPTY_VALUE,
      routePathKeys: RoutePathKeys,
      lookupEncInz: '',
      subscriptionResult: '',
    }
  },
  computed: {
    splittedKeywords() {
      if (!this.keywords) {
        return []
      }
      return flatten(this.keywords.split(' - ').map((key) => key.split('– ')))
    },
  },
  methods: {
    async subscribe() {
      const { email, checkedAllGroups } = this.user;
      try {
        const url = checkedAllGroups
          ? MailmanUrl.rolout
          : `${MailmanUrl.subscribe}/${this.id}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            email,
            'email-button': 'Subscribe',
          }).toString(),
        });
        if (response.ok) {
          const responseText = await response.text();
          const doWeHaveResponse = !!responseText;
          if (doWeHaveResponse && responseText.includes('Your subscription request has been received, and will soon be acted upon')) {
            this.subscriptionResult = t('general.message.mailman.subscriptionSucces');
          } else if (doWeHaveResponse && (responseText.includes('The email address you supplied is not valid') || responseText.includes('You must supply a valid email address'))) {
            this.subscriptionResult = t('general.message.mailman.subscriptionInvalidEmail');
          } else {
            this.subscriptionResult = t('general.message.mailman.subscriptionFailure');
          }
        } else {
          throw new Error('HTTP error, status = ' + response.status);
        }
      } catch (error) {
        console.error(error);
        this.subscriptionResult = 'An error occurred while subscribing.'
      }
    },
  },
}
</script>

<style lang="scss">
.headline {
  word-break: break-word;
}

.pending-case-card {
  color: #3d3a44;
  padding: 40px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08) !important;
  border-radius: 0 !important;
  margin-bottom: 32px;

  @include mobile {
    margin: auto;
    margin-bottom: 20px;
  }
}

.pending-case-btn {
  background-color: $rajahYellow !important;
  color: $textOnRajah;
}

.row-to-column {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 4px;

  h4 {
    color: #3d3a44;
  }

  p.h4 {
    color: #3d3a44;
    width: 200px;
    margin-right: 24px;
    font-size: 16px;
  }

  h3 {
    margin-bottom: 16px;
    margin-top: 4px;
    color: rgba(0, 0, 0, 0.87);
    font-weight: bold;
    font-size: 20px;
  }

  p {
    width: calc(100% - 200px);
  }

  @include mobile {
    flex-direction: column;
    justify-content: flex-start;

    h3,
    h4 {
      width: 100%;
    }

    p {
      width: 100%;
    }
  }
}

.chip-container {
  a {
    text-decoration: none;
  }
}

.subscription-result {
  border: 2px solid black;
  padding: 10px;
}
</style>
