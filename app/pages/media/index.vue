<!-- Content based Page -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { ContentKeys } from '@core/constants'
import img from '~/assets/img/banner-media.png'

const contactImgMartin = '/members/martin-vrancken.jpg'
const contactImgThomas = '/members/thomas-leys.jpg'
const contactImgFrank = '/members/frank-meersschaut.jpg'
const contactImgTim = '/members/tim-souverijns.jpg'
const contactImgRom = '/members/romain-vanderbeck.jpg'

const { t, locale, langCollection } = useLanguage()

const contentPath = ref(`${ContentKeys.mediaMediaUnit}`)
const pad = computed(() => `/${locale.value}/${contentPath.value}`)

const { data: page } = useAsyncData(
  // zonder deze key wordt de cache geüpdatet bij locale switch
  // maar: als je een harde refresh doet, dan is de cache niet geüpdatet
  // useAsyncData in Nuxt is designed to be called once per component lifecycle,
  // typically during setup. It is not intended to be called repeatedly in
  // response to reactive changes like locale or contentPath.

  // `content-${locale.value}-${contentPath.value}`,
  async () => {
    try {
      return await queryCollection(langCollection[locale.value]).path(pad.value).first()
    }
    catch (error) {
      console.error('Error fetching page content:', error)
      return null
    }
  },
)
</script>

<template>
  <div>
    <BannerImage
      v-if="page"
      :title="page.title"
      :description="page.description"
      :image="img"
      :alt="t('alt.banner.flag')"
    />
    <v-container>
      <v-row>
        <article v-if="page">
          <ContentRenderer
            :value="page.body"
            class="nuxt-content"
          />
        </article>
      </v-row>
      <v-row>
        <v-col>
          <ContactCard
            :key="`tim-${locale}`"
            :headline-level="3"
            name="Tim SOUVERIJNS"
            :jobtitle="`${t('contact.law-clerk')}, (NL)`"
            :image="contactImgTim"
            phone="+32(0)2/500.12.21"
          />
        </v-col>
        <v-col>
          <ContactCard
            :key="`martin-${locale}`"
            :headline-level="3"
            name="Martin VRANCKEN"
            :image="contactImgMartin"
            :jobtitle="`${t('contact.law-clerk')}, (NL)`"
            phone="+32(0)2/500.12.87"
          />
        </v-col>
        <v-col>
          <ContactCard
            :key="`frank-${locale}`"
            :headline-level="3"
            name="Frank MEERSSCHAUT"
            :jobtitle="`${t('general.message.registrars', 1)},
                  ${t('contact.general-media-coordination')},
                  (NL)`"
            :image="contactImgFrank"
            phone="+32(0)475/32.52.18"
          />
        </v-col>
        <v-col>
          <ContactCard
            :key="`thomas-${locale}`"
            :headline-level="3"
            name="Thomas LEYS"
            :jobtitle="`${t('contact.law-clerk')}, (NL)`"
            phone="+32(0)2/500.12.60"
            :aria-label="t('aria.label.phone.number')"
            :image="contactImgThomas"
          />
        </v-col>
        <v-col>
          <ContactCard
            :key="`romain-${locale}`"
            :headline-level="3"
            name="Romain VANDERBECK"
            :jobtitle="`${t('contact.law-clerk')}, (NL)`"
            :image="contactImgRom"
            phone="+32(0)2/500.13.28"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

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
