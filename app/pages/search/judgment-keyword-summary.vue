<template>
  <v-container class="fill-height" fluid>
    <BannerImage
      :title="$t(i18nKeys.menu.search.title)"
      :description="$t(i18nKeys.menu.search.titleDescription)"
      :image="img"
    />
    <v-row
      v-if="$fetchState.pending"
      class="d-flex"
      align="flex-start"
      justify="center"
    >
      <div class="col-12 col-md-12">
        <v-skeleton-loader class="mx-auto" max-width="300" type="article" />
      </div>
    </v-row>
    <v-row
      v-else-if="$fetchState.error"
      class="d-flex"
      align="flex-start"
      justify="center"
    >
      <div class="col-12 col-md-12">
        <ErrorCard
          :message="$t($i18nKeys.error.fetchingData)"
          :show-go-home="false"
        />
      </div>
    </v-row>
    <v-row v-else class="d-flex">
      <div class="col-4 col-xs-9 col-md-4">
        <v-tabs show-arrows vertical left>
          <v-tab
            v-for="tab of tabs"
            :key="tab.id"
            :value="tab.id"
            :to="tab.to"
            nuxt
            style="text-transform: none"
          >
            {{ tab.label }}
          </v-tab>
        </v-tabs>
      </div>
      <div class="col-8 col-xs-8 col-md-8">
        <client-only :placeholder="$i18nKeys.general.message.loading">
          <ValidationObserver ref="observer" slim>
            <form>
              <!--              <ValidationProvider-->
              <!--                v-slot="{ errors }"-->
              <!--                :key="toNameKey($tc(i18nKeys.general.message.judgmentNumber))"-->
              <!--                :name="toNameKey($tc(i18nKeys.general.message.judgmentNumber))"-->
              <!--                rules-->
              <!--              >-->
              <!--                <v-text-field-->
              <!--                  v-model="payload.judgmentNumber"-->
              <!--                  :label="$tc(i18nKeys.general.message.judgmentNumber)"-->
              <!--                  :error-messages="errors"-->
              <!--                  hint="XX/YYYY"-->
              <!--                  :persistent-hint="true"-->
              <!--                  required-->
              <!--                ></v-text-field>-->
              <!--              </ValidationProvider>-->

              <ValidationProvider
                v-slot="{ errors }"
                :key="toNameKey($tc(i18nKeys.general.message.dateOfJudgment))"
                class="d-flex"
                :name="toNameKey($tc(i18nKeys.general.message.dateOfJudgment))"
              >
                <v-text-field
                  v-model.lazy="payload.judgmentDates[0]"
                  v-cleave="{
                    date: true,
                    datePattern: ['d', 'm', 'Y'],
                  }"
                  hint="DD/MM/YYYY"
                  :label="$tc(i18nKeys.general.message.dateOfJudgmentStart)"
                  persistent-hint
                  :error-messages="errors"
                />
                <span class="px-2" />
                <v-text-field
                  v-model.lazy="payload.judgmentDates[1]"
                  v-cleave="{
                    date: true,
                    datePattern: ['d', 'm', 'Y'],
                  }"
                  hint="DD/MM/YYYY"
                  :label="$tc(i18nKeys.general.message.dateOfJudgmentEnd)"
                  persistent-hint
                  :error-messages="errors"
                />
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors }"
                :key="toNameKey($tc(i18nKeys.general.message.keywords))"
                :name="toNameKey($tc(i18nKeys.general.message.keywords))"
                rules
              >
                <v-text-field
                  v-model="payload.keywords"
                  :label="$tc(i18nKeys.general.message.keywords, 2)"
                  :error-messages="errors"
                  required
                />
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors }"
                :key="toNameKey($tc(i18nKeys.general.message.summary))"
                :name="toNameKey($tc(i18nKeys.general.message.summary))"
                rules
              >
                <v-text-field
                  v-model="payload.summary"
                  :label="$tc(i18nKeys.general.message.summary, 2)"
                  :error-messages="errors"
                  required
                />
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors }"
                :key="
                  toNameKey($t(i18nKeys.general.message.lookForEntireSentence))
                "
                :name="
                  toNameKey($t(i18nKeys.general.message.lookForEntireSentence))
                "
                rules
              >
                <v-checkbox
                  v-model="payload.lookForEntirePhrase"
                  :label="$t(i18nKeys.general.message.lookForEntireSentence)"
                  :error-messages="errors"
                  required
                />
              </ValidationProvider>

              <v-btn
                type="submit"
                class="mr-4 submit-button"
                :loading="loading"
                :aria-label="$tc(i18nKeys.aria.label.submit)"
                @click.prevent="submit"
              >
                {{ $t(i18nKeys.general.submit) }}
              </v-btn>
              <v-btn
                v-if="hasResults"
                class="mr-4"
                @click.prevent="print('list')"
              >
                <v-icon left>
                  mdi-printer
                </v-icon>
                {{ $t(i18nKeys.general.message.printList) }}
              </v-btn>
            </form>
          </ValidationObserver>
        </client-only>
        <div v-if="hasResults" class="mt-6">
          <v-expansion-panels ref="list" :value="openedPanels" multiple>
            <v-expansion-panel
              v-for="result in formattedSearchResult"
              :key="result"
            >
              <v-expansion-panel-header>
                <v-row no-gutters>
                  <v-col cols="6">
                    {{ $tc(i18nKeys.general.message.judgmentNumber) }} :
                    <a :href="result.filePath">{{ getId(result.fileName) }}</a>
                  </v-col>
                  <v-col cols="6">
                    {{ $tc(i18nKeys.general.message.dateOfJudgment) }} :
                    {{ result.formatedJudmentDate }}
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div
                  v-for="data of result.summaries"
                  :key="data.summary"
                  class="my-2 p"
                >
                  <ul class="my-2">
                    <li v-for="key of data.keywords" :key="key">
                      {{ key }}
                    </li>
                  </ul>
                  <p class="my-2">
                    <i>{{ data.summary }}</i>
                  </p>
                  <v-divider class="my-2" />
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
        <div v-if="(loaded && !hasResults) || searchError" class="mt-6">
          <EmptyComponent />
        </div>
      </div>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { localize, ValidationObserver, ValidationProvider } from 'vee-validate'
import { ApiUrl } from '../../core/constants'
import { to } from '../../core/utilities'
import { i18nKeys } from '../../lang/keys'
import ErrorCard from '../../components/ErrorCard.vue'
import { veeValidateLocalizeMap } from '../../server/vee-validate'
import { searchTabs } from '../../server/constants'
import EmptyComponent from '../../components/EmptyComponent.vue'
import BannerImage from '~/components/BannerImage.vue'
import img from '~/assets/img/banner-text.png'

export default Vue.extend({
  name: 'JudgmentKeywordSummarySearch',
  components: {
    BannerImage,
    ErrorCard,
    ValidationProvider,
    ValidationObserver,
    EmptyComponent,
  },
  data() {
    return {
      img,
      i18nKeys,
      searchPendingCaseResponse: null,
      loading: false,
      loaded: false,
      searchError: null,
      searchResponse: null,
      tabs: searchTabs.map((tab) => {
        return {
          id: tab.id,
          to: this.localePath(tab.to),
          label: this.$tc(tab.id, 2),
        }
      }),
      payload: {
        judgmentDates: [],
      },
    }
  },
  fetch() {
    const lang = this.$i18n.locale
    localize(lang, veeValidateLocalizeMap[lang])
  },
  head() {
    const title =
      this.$t(this.$i18nKeys.menu.search.title) ||
      this.$tc(this.$i18nKeys.general.message.constsCourt)
    const description = this.$t(this.$i18nKeys.menu.search.title) || ''

    return {
      title,
      htmlAttrs: {
        title,
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
      ],
    }
  },
  computed: {
    locale() {
      return this.$i18n.locale
    },
    isFormInvalid() {
      return (
        !this.payload?.judgmentNumber &&
        !this.payload?.keywords &&
        !this.payload?.summary &&
        (!this.payload?.judgmentDates ||
          this.payload?.judgmentDates?.length === 0)
      )
    },

    formattedSearchResult() {
      if (!this.searchResponse) {
        return []
      }

      return this.searchResponse
    },
    hasResults() {
      return this.formattedSearchResult && this.formattedSearchResult.length > 0
    },
    openedPanels() {
      return this.formattedSearchResult.map((_, i) => i)
    },
  },
  watch: {
    '$i18n.locale'(lang) {
      localize(lang, veeValidateLocalizeMap[lang])
    },
    payload() {
      this.searchResponse = null
      this.searchError = null
    },
  },
  methods: {
    toNameKey(val = '') {
      return val?.toLowerCase()
    },
    getId(val = '') {
      const split = val?.split('-')
      const year = split?.[0]?.trim()
      const id = split?.[1]?.trim()
      return `${id ? `${id}/` : ''} ${year || ''}`
    },
    async submit() {
      const valid = await this.$refs.observer.validate()

      if (!valid) {
        return
      }

      if (this.isFormInvalid) {
        return
      }

      this.loading = true
      this.loaded = false
      this.searchError = null
      this.searchResponse = null

      const [error, response] = await to(
        this.$axios.$post(
          `${ApiUrl.searchByJudgmentKeywordsSummary}?lang=${this.locale}`,
          {
            ...this.payload,
            judgmentDates: this.payload.judgmentDates?.map((date) =>
              date?.split('/')?.reverse()?.join('-'),
            ),
          },
        ),
      )

      this.loading = false

      if (error || !response) {
        this.searchError = error || new Error("fout in judgment-keyword-summary")
        return
      }

      this.loaded = true
      this.searchResponse = response
    },
    closeJudgmentDatesMenuDatePicker() {
      if (this.payload.judgmentDates) {
        this.judgmentDatesMenuDatePicker = false
      }
    },
    print(ref) {
      this.$print(this.$refs[ref])
    },
  },
})
</script>

<style scoped lang="scss">
.container {
  padding: 0 !important;
  @include mobile {
    padding: 32px;
  }
}
.d-flex {
  max-width: 1260px !important;
  margin: auto;
  @include mobile {
    width: 100%;
  }
}

.nuxt-content {
  padding-top: 32px;
}
.submit-button {
  background: $indigo !important;
  color: white;
}

.v-input {
  margin: 32px 0 !important;
}
.d-flex .v-input__slot {
  box-shadow: none !important;
}
</style>
