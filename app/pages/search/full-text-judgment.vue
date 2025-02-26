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
              <ValidationProvider
                v-slot="{ errors }"
                :key="toNameKey($tc(i18nKeys.general.message.searchLabel))"
                :name="toNameKey($tc(i18nKeys.general.message.searchLabel))"
                rules
              >
                <v-text-field
                  v-model="payload.term"
                  name="inputfield"
                  :label="$tc(i18nKeys.general.message.searchLabel)"
                  :error-messages="errors"
                />
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors }"
                key="type"
                name="type"
                rules="required"
              >
                <v-radio-group
                  v-model="payload.sort"
                  row
                  :error="errors && errors.length > 0"
                >
                  <v-radio
                    v-for="sort of sorts"
                    :key="sort.id"
                    :label="sort.label"
                    :value="sort.value"
                    name="type"
                    required
                    :disabled="loading"
                  />
                </v-radio-group>
              </ValidationProvider>

              <section v-if="hasContent" class="col-12 col-md-12">
                <nuxt-content :document="page" class="section-content" />
              </section>

              <v-btn
                name="knop"
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
        <div v-if="hasResults" ref="list" class="mt-6">
          <FullTextSearchJudgmentCard
            v-for="result of formattedSearchResult"
            :key="result.id"
            :search-term="payload.term"
            :pdf-url="result.filePath"
            :date="result.formatedJudmentDate"
            :title="result.fileName"
            :score="result.score"
            :description="result.highlightHTML"
            :page-count="result.pageCount"
          />
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
import { ApiUrl, ContentKeys } from '../../core/constants'
import { to } from '../../core/utilities'
import { i18nKeys } from '../../lang/keys'
import ErrorCard from '../../components/ErrorCard.vue'
import { veeValidateLocalizeMap } from '../../server/vee-validate'
import { searchTabs } from '../../server/constants'
import FullTextSearchJudgmentCard from '../../components/FullTextSearchJudgmentCard.vue'
import EmptyComponent from '../../components/EmptyComponent.vue'
import BannerImage from '~/components/BannerImage.vue'
import img from '~/assets/img/banner-text.png'

export default Vue.extend({
  name: 'FullTextJudgmentSearch',
  components: {
    FullTextSearchJudgmentCard,
    BannerImage,
    ErrorCard,
    ValidationProvider,
    ValidationObserver,
    EmptyComponent,
  },
  data() {
    return {
      img,
      page: null,
      i18nKeys,
      judgmentDatesMenuDatePicker: null,
      searchPendingCaseResponse: null,
      loading: false,
      loaded: false,
      searchError: null,
      searchResponse: null,
      sorts: [
        {
          id: i18nKeys.general.message.sortByScore,
          value: 'score',
          label: this.$t(i18nKeys.general.message.sortByScore),
        },
        {
          id: i18nKeys.general.message.sortByDate,
          value: 'date',
          label: this.$t(i18nKeys.general.message.sortByDate),
        },
        {
          id: i18nKeys.general.message.sortByAlphabetical,
          value: 'alpha',
          label: this.$t(i18nKeys.general.message.sortByAlphabetical),
        },
      ],
      tabs: searchTabs.map((tab) => {
        return {
          id: tab.id,
          to: this.localePath(tab.to),
          label: this.$tc(tab.id, 2),
        }
      }),
      payload: {
        sort: 'score',
      },
    }
  },
  async fetch() {
    const lang = this.$i18n.locale
    localize(lang, veeValidateLocalizeMap[lang])
    let page = null

    try {
      page = await this.$content(
        `${this.$i18n.locale}/${ContentKeys.fullTextSearchExplanation}`,
      ).fetch()
      // eslint-disable-next-line no-empty
    } catch (e) {}

    this.page = page
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
      return !this.payload?.term
    },

    formattedSearchResult() {
      if (!this.searchResponse) {
        return []
      }

      return this.searchResponse
    },
    hasContent() {
      return this.page?.body?.children?.length > 0
    },
    hasResults() {
      return this.formattedSearchResult && this.formattedSearchResult.length > 0
    },
  },
  watch: {
    '$i18n.locale'(lang) {
      localize(lang, veeValidateLocalizeMap[lang])
    },
    sort() {
      this.submit()
    },
  },
  methods: {
    toNameKey(val = '') {
      return val?.toLowerCase()
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

      const url = `${ApiUrl.searchFullTextOfJudgments}?lang=${this.locale}&term=${this.payload.term}&sort=${this.payload.sort}`

      const [error, response] = await to(this.$axios.$get(url, this.payload))

      this.loading = false

      if (error || !response) {
        this.searchError = error || new Error("fout in full-text-judgment")
        return
      }

      this.loaded = true
      this.searchResponse = response
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
  margin-bottom: 80px;
  @include mobile {
    margin-bottom: 40px;
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
