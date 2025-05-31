<template>
  <v-container class="flex-column align-start flex-nowrap" fluid>
    <BannerImage
      v-if="page"
      :title="page.title"
      :description="page.description"
      :image="img"
    />
    <v-row
      v-if="$fetchState.pending"
      class="d-flex"
      align="flex-start"
      justify="center"
    >
      <div class="col-12 col-md-12">
        <v-skeleton-loader
          class="mx-auto"
          max-width="300"
          type="article"
        />
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
    <v-row v-else class="d-flex" align="flex-start" justify="center">
      <div class="col-12 col-md-12">
        <section>
          <nuxt-content :document="page" class="section-content" />
        </section>
      </div>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import ErrorCard from '../../../components/ErrorCard.vue';
import img from '~/assets/img/newsletter-background-opt.png';
import BannerImage from '~/components/BannerImage.vue';
import { ContentKeys } from '~/core/constants';

export default Vue.extend({
  name: 'SpecialLawOf6January1989OnTheConstitutionalCourt',
  components: { BannerImage, ErrorCard },
  data() {
    return {
      img,
      page: null
    };
  },
  async fetch() {
    const page = await this.$content(
      `${this.$i18n.locale}/${ContentKeys.presentationBasicTextsOrganicLawSpecialLawOf6January1989OnTheConstitutionalCourt}`
    ).fetch();

    if (!page) {
      throw new Error('No Content');
    }

    this.page = page;
  },
  head() {
    const title =
      this.page?.title?.trim() ||
      this.$tc(this.$i18nKeys.general.message.constsCourt);
    const description = this.page?.description?.trim() || '';

    return {
      title,
      htmlAttrs: {
        title
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
        }
      ]
    };
  },
  computed: {}
});
</script>

<style lang="scss" scoped>
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
  h2 {
    padding-top: 32px;
    padding-bottom: 24px;
    font-size: 2rem;
    font-weight: 600;
    @include tablet-portrait {
      padding-top: 24px;
      padding-bottom: 16px;
      font-size: 1.5rem;
    }
  }
}
</style>
