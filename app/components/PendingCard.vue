<!-- src/components/PendingCaseCard.vue -->
<template>
  <v-card
    :id="`pending-cases-card-${caseItem.id}`"
    outlined
    class="mx-auto mb-3"
  >
    <v-list-item>
      <!-- ROW 1: Roll-number & subscribe button -->
      <v-row>
        <v-col cols="9">
          <h3>
            {{ t('general.message.roll-number') }}: {{ caseItem.id }} ({{ caseItem.processingLanguage }})
          </h3>
        </v-col>
        <v-col
          cols="3"
          class="d-flex justify-end"
        >
          <div v-if="!isSubscribable(caseItem.id)">
            <v-chip
              color="var(--logo-color)"
              class="mr-2"
            >
              {{ t('general.message.judgment-deliveries') }}
            </v-chip>
          </div>
          <v-btn v-else>
            {{ t('newsletter.rol.subscribe') }}
          </v-btn>
        </v-col>
      </v-row>

      <!-- ROW 2: Receipt date -->
      <v-row>
        <v-col cols="4">
          {{ t('general.message.receipt-date') }}
        </v-col>
        <v-col cols="8">
          {{ caseItem.dateReceived || emptyValue }}
        </v-col>
      </v-row>

      <!-- ROW 3: Date of hearing -->
      <v-row>
        <v-col cols="4">
          {{ t('general.message.date-of-hearing', 2) }}
        </v-col>
        <v-col cols="8">
          {{ caseItem.dateOfHearing || emptyValue }}
        </v-col>
      </v-row>

      <!-- ROW 4: Date of judgment -->
      <v-row>
        <v-col cols="4">
          {{ t('general.message.date-of-judgment') }}
        </v-col>
        <v-col cols="8">
          {{ caseItem.dateDelivered || emptyValue }}
        </v-col>
      </v-row>

      <!-- ROW 5: Description (“subject matter”) -->
      <v-row>
        <v-col cols="4">
          {{ t('general.message.concerning') }}
        </v-col>
        <!-- eslint-disable vue/no-v-html -->
        <v-col cols="8">
          <p v-html="caseItem.description || emptyValue" />
        </v-col>
      </v-row>

      <!-- ROW 6: Linked case number (if any) -->
      <v-row v-if="caseItem.linkedCaseNumber">
        <v-col cols="12">
          <span>{{ t('general.message.case-joined-with-case-numbers') }}
            <a
              :href="`#pending-cases-card-${caseItem.linkedCaseNumber}`"
              :aria-label="`Link to pending case card ${caseItem.linkedCaseNumber}`"
            >
              <span class="link">{{ caseItem.linkedCaseNumber }}</span>
            </a>
          </span>
        </v-col>
      </v-row>

      <!-- ROW 7: Art. 74 notification (if any) -->
      <v-row v-if="caseItem.dateArt74">
        <v-col cols="12">
          <!-- eslint-disable vue/no-v-html -->
          <span
            v-html="t('general.message.notification-art74-be-official-journal')
              .replace('Moniteur belge', '<i>Moniteur belge</i>')
              .replace('Belgisch Staatsblad', '<i>Belgisch Staatsblad</i>') + ': '"
          />
          {{ caseItem.dateArt74 || emptyValue }}
        </v-col>
      </v-row>

      <!-- ROW 8: Joined cases list (if any) -->
      <v-row v-if="caseItem.joinedCases && caseItem.joinedCases.length > 0">
        <v-col cols="12">
          <span>
            {{ t('general.message.joined-case', caseItem.joinedCases.length) + ': ' }}
            <a
              v-for="caseNumber of caseItem.joinedCases"
              :key="caseNumber"
              :href="`#pending-cases-card-${caseNumber}`"
              class="mr-3"
            >
              {{ caseNumber }}
            </a>
          </span>
        </v-col>
      </v-row>

      <!-- ROW 9: Keywords -->
      <v-row>
        <v-col
          cols="12"
          md="2"
          class="mt-2"
        >
          {{ t('general.message.keywords', 2) }}
        </v-col>
        <v-col
          cols="12"
          md="10"
        >
          <div class="elevation-2 my-2 subtitle border pa-2">
            {{ caseItem.keywords || t('error.no-data-available') }}
          </div>
        </v-col>
      </v-row>
    </v-list-item>
  </v-card>
</template>

<script setup lang="ts">
import type { Decision } from '@core/constants'
import { EMPTY_VALUE } from '@core/constants'

/**
 * Props:
 * - caseItem: the Decision object, plus our computed yearReceived
 * - isSubscribable: function that tells if subscription button should show
 */
defineProps<{
  caseItem: Decision & { yearReceived: string }
  isSubscribable: (id: number) => boolean
}>()

const { t } = useLanguage()
const emptyValue = EMPTY_VALUE
</script>
