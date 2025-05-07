<!-- Content based Page -->
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
          <ContentRendererMarkdown
            :value="page.body"
            class="nuxt-content"
          />
        </article>
      </v-row>
      <v-row>
        <v-col>
          <ContactCard
            :headline-level="3"
            name="Tim SOUVERIJNS"
            :jobtitle="`
                  ${t('contact.law-clerk')}, (NL)
                  `
            "
            :image="contactImgTim"
            phone="+32(0)2/500.12.21"
          />
        </v-col>
        <v-col>
          <ContactCard
            :headline-level="3"
            name="Martin VRANCKEN"
            :image="contactImgMartin"
            :jobtitle="`
                  ${t('contact.law-clerk')}, (NL)
                  `
            "
            phone="+32(0)2/500.12.87"
          />
        </v-col>
        <v-col>
          <ContactCard
            :headline-level="3"
            name="Frank MEERSSCHAUT"
            :jobtitle="`${t('general.message.registrars', 1)},
                  ${t('contact.general-media-coordination')},
                  (NL)
                  `
            "
            :image="contactImgFrank"
            phone="+32(0)475/32.52.18"
          />
        </v-col>
        <v-col>
          <ContactCard
            :headline-level="3"
            name="Thomas LEYS"
            :jobtitle="`
                  ${t('contact.law-clerk')}, (NL)
                  `
            "
            phone="+32(0)2/500.12.60"
            :aria-label="t('aria.label.phone.number')"
            :image="contactImgThomas"
          />
        </v-col>
        <v-col>
          <ContactCard
            :headline-level="3"
            name="Romain VANDERBECK"
            :jobtitle="`
                  ${t('contact.law-clerk')}, (NL)
                  `
            "
            :image="contactImgRom"
            phone="+32(0)2/500.13.28"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { useContent } from '@nuxt/content'
import img from '~/assets/img/banner-media.png'

import { ContentKeys } from '@/core/constants'

// import ContactCard from '~/components/ContactCard.vue'
import contactImgMartin from '~/assets/img/members/martin-vranken.jpg'
import contactImgThomas from '~/assets/img/members/thomas-leys.jpg'
import contactImgFrank from '~/assets/img/members/frank-meersschaut.jpg'
import contactImgTim from '~/assets/img/members/tim-souverijns.jpg'
import contactImgRom from '~/assets/img/members/romain-vanderbeck.jpg'

const route = useRoute()
const hash = route.hash.substring(1)
const { t, locale } = useLanguage()

const currentActiveContentInToc = ref<string>('')
const contentPath = ref(`${ContentKeys.mediaMediaUnit}`)

const { data: page, pending, error } = await useLazyAsyncData('content', async () => {
  try {
    const doc = await queryContent(`${locale.value}/${contentPath.value}`)
      .findOne()
    const idsTo = doc.body?.toc?.links?.map(toc => toc.id) || []
    console.log('idsTo', idsTo)
    currentActiveContentInToc.value
      = hash && idsTo.includes(hash) ? hash : idsTo[0] || ''
    return doc
  }
  catch (error) {
    console.error('Error fetching content:', error)
    throw error
  }
})
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
