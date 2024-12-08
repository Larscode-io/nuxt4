<template>
  <v-container>
    <div class="col-12 col-md-9">
      <h2 :id="toSlug(t('contact.seat'))">
        {{ t('contact.seat') }}
      </h2>
      <ContactView
        :image="contactSeat"
        :alt="t('alt.contact.seat', 2)"
      >
        <p class="info-title">
          {{ t('contact.address-title') }}
        </p>
        <p class="info-details">
          {{ t('contact.address-details') }}
        </p>
        <p class="info-title">
          {{
            t('general.phone-number')
              + ' ('
              + t('general.all-services')
              + ')'
          }}
        </p>
        <p class="info-details">
          +32(0)2/500.12.11
        </p>
      </ContactView>
      <h2 :id="toSlug(t('contact.president-office'))">
        {{ t('contact.president-office') }}
      </h2>
      <ContactView
        :image="contactPresidentOffice"
        :alt="t('alt.contact.president.office', 2)"
      >
        <p class="info-title">
          {{ t('general.phone-number') }}
        </p>
        <p class="info-details">
          +32(0)2/500.12.76 (N)
          <br>+32(0)2/500.12.75 (F)
        </p>
        <p class="info-title">
          {{ t('general.fax') }}
        </p>
        <p class="info-details">
          +32(0)2/500.12.01
        </p>
        <p class="info-title">
          {{ t('general.email') }}
        </p>
        <p class="info-details">
          <a :href="'mailto:voorz-pres@const-court.be'">voorz-pres@const-court.be</a>
        </p>
      </ContactView>
      <h2 :id="toSlug(t('contact.registry'))">
        {{ t('contact.registry') }}
      </h2>
      <ContactView
        :image="contactGreffe"
        :alt="t('alt.contact.registry', 2)"
      >
        <p class="info-title">
          {{ t('contact.registry-opening-hours-title') }}
        </p>
        <p class="info-details">
          {{ t('contact.registry-opening-hours-details') }}
        </p>
        <p class="info-title">
          {{ t('general.phone-number') }}
        </p>
        <p class="info-details">
          +32(0)2/500.12.32 (N)
          <br>+32(0)2/500.12.33 (F)
        </p>
        <p class="info-title">
          {{ t('general.fax') }}
        </p>
        <p class="info-details">
          +32(0)2/500.12.00
        </p>
        <p class="info-title">
          {{ t('general.email') }}
        </p>
        <p class="info-details">
          <a
            v-if="isEnglish || isFrench || isGerman"
            :href="'mailto:greffe@const-court.be'"
          >greffe@const-court.be</a>
          <a
            v-if="isDutch"
            :href="'mailto:griffie@const-court.be'"
          >griffie@const-court.be</a>
        </p>
      </ContactView>

      <h2 :id="toSlug(t('contact.ict'))">
        {{ t('contact.ict') }}
      </h2>
      <ContactView
        :image="contactIct"
        :alt="t('alt.contact.ict', 2)"
      >
        <p class="info-title">
          {{ t('general.email') }}
        </p>
        <p class="info-details">
          <a :href="'mailto:ict@const-court.be'">ict@const-court.be</a>
        </p>
      </ContactView>
      <h2 :id="toSlug(t('contact.library'))">
        {{ t('contact.library') }}
      </h2>
      <ContactView
        :image="contactLibrary"
        :alt="t('alt.contact.library', 2)"
      >
        <p class="info-title">
          {{ t('general.phone-number') }}
        </p>
        <p class="info-details">
          +32(0)2/500.13.49
        </p>
        <p class="info-title">
          {{ t('general.fax') }}
        </p>
        <p class="info-details">
          +32(0)2/500.12.03
        </p>
        <p class="info-title">
          {{ t('general.email') }}
        </p>
        <p class="info-details">
          <a :href="'mailto:bib@const-court.be'">bib@const-court.be</a>
        </p>
      </ContactView>
      <h2 :id="toSlug(t('contact.media'))">
        {{ t('contact.media') }}
      </h2>
      <div
        v-if="isGerman"
        class="d-flex justify-space-between flex-wrap"
      >
        <p
          p
          class="info-details"
        >
          {{ t('contact.german.nodecontacts') }}
        </p>
      </div>
      <div class="d-flex justify-space-between flex-wrap">
        <ContactCard
          v-if="isDutch || isGerman"
          :headline-level="3"
          name="Tim SOUVERIJNS"
          :jobtitle="`
            ${t('contact.law-clerk')}, (NL)
              `"
          :image="contactImgTim"
          phone="+32(0)2/500.12.21"
        />
        <ContactCard
          v-if="isGerman || isFrench || isGerman"
          :headline-level="3"
          name="Martin VRANCKEN"
          :jobtitle="`
            ${t('contact.law-clerk')}, (FR)
              `"
          phone="+32(0)2/500.12.87"
          :image="contactImgMartin"
        />
        <ContactCard
          v-if="isDutch || isGerman"
          :headline-level="3"
          name="Frank MEERSSCHAUT"
          :jobtitle="`${t('general.message.registrars', 2)},
              ${t('contact.general-media-coordination')},
              (NL)
            `"
          :image="contactImgFrank"
          phone="+32(0)475/32.52.18"
        />
        <ContactCard
          v-if="isEnglish || isDutch || isGerman"
          :headline-level="3"
          name="Thomas LEYS"
          :jobtitle="`
            ${t('contact.law-clerk')}, (NL , EN)
              `"
          phone="+32(0)2/500.12.60"
          :image="contactImgThomas"
        />
        <ContactCard
          v-if="isFrench || isGerman"
          :headline-level="3"
          name="Romain VANDERBECK"
          :jobtitle="`
            ${t('contact.law-clerk')}, (FR)
              `"
          :image="contactImgRom"
          phone="+32(0)2/500.13.28"
        />
      </div>
      <h2 :id="toSlug(t('contact.accessibility'))">
        {{ t('contact.accessibility') }}
      </h2>
      <div class="d-flex justify-space-between flex-wrap">
        <p
          p
          class="info-details"
        >
          {{ t('contact.accessibility-description') }}
        </p>
      </div>
      <div class="d-flex justify-space-between flex-wrap">
        <ContactCard
          v-if="isEnglish || isDutch || isFrench || isGerman"
          :headline-level="3"
          name="Ann-Sophie VANDAELE"
          :jobtitle="`
            ${t('contact.law-clerk')}, (NL)
              `"
          phone="+32(0)2/500.13.01"
          :image="contactImgAnnSophie"
        />
        <div class="justify-space-between flex-wrap">
          <p
            class="title"
            style="font-weight: bold; padding-top: 100px;"
          >
            {{ t('general.email') }}
          </p>
          <p>
            <a
              :href="'mailto:toegankelijkheid-accessibilite@const-court.be'"
            >toegankelijkheid-accessibilite@const-court.be</a>
          </p>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUpdated } from 'vue'
import img from '~/assets/img/banner-job.png'
import contactImgMartin from '~/assets/img/members/martin-vranken.jpg'
import contactImgSarah from '~/assets/img/members/sarah-lambrecht.jpg'
import contactImgThomas from '~/assets/img/members/thomas-leys.jpg'
import contactImgFrank from '~/assets/img/members/frank-meersschaut.jpg'
import contactImgTim from '~/assets/img/members/tim-souverijns.jpg'
import contactImgRom from '~/assets/img/members/romain-vanderbeck.jpg'
import contactImgAnnSophie from '~/assets/img/members/ann-sophie-vandaele.jpg'
import contactGreffe from '~/assets/img/contact/greffe.png'
import contactIct from '~/assets/img/contact/ict.png'
import contactLibrary from '~/assets/img/contact/library.jpg'
import contactPresidentOffice from '~/assets/img/contact/president-office.png'
import contactSeat from '~/assets/img/contact/seat.jpg'

const imgRef = ref(img)
const currentActiveContentInToc = ref('')

const { t, locale } = useLanguage()
const route = useRoute()

const sideBarLinks = computed(() => [
  {
    id: toSlug(t('contact.seat')),
    text: t('contact.seat'),
  },
  {
    id: toSlug(t('contact.presidentOffice')),
    text: t('contact.presidentOffice'),
  },
  {
    id: toSlug(t('contact.registry')),
    text: t('contact.registry'),
  },
  {
    id: toSlug(t('contact.ict')),
    text: t('contact.ict'),
  },
  {
    id: toSlug(t('contact.library')),
    text: t('contact.library'),
  },
  {
    id: toSlug(t('contact.media')),
    text: t('contact.media'),
  },
  {
    id: toSlug(t('contact.accessibility')),
    text: t('contact.accessibility'),
  },
])

const hasSidebarLinks = computed(() => sideBarLinks.value.length > 0)
const ids = computed(() => sideBarLinks.value.map(link => link.id))
const currentLocale = computed(() => locale.value)
const isEnglish = computed(() => currentLocale.value === 'en')
const isFrench = computed(() => currentLocale.value === 'fr')
const isDutch = computed(() => currentLocale.value === 'nl')
const isGerman = computed(() => currentLocale.value === 'de')

function toSlug(value: string) {
  // Implement your slugification logic here
  return value.toLowerCase().replace(/\s+/g, '-')
}

function updateCurrentActiveContentInToc(section: string) {
  currentActiveContentInToc.value = section
}

function startIntersectionObserver() {
  const options = {
    threshold: 0.9,
    rootMargin: '0px 0px -50% 0px',
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
        updateCurrentActiveContentInToc(entry.target.id)
      }
    })
  }, options)

  document.querySelectorAll('h2').forEach((el) => {
    if (ids.value.includes(el.id)) {
      observer.observe(el)
    }
  })
}

// onMounted(() => {
//   startIntersectionObserver()
// })

// onUpdated(() => {
//   startIntersectionObserver()
// })
</script>
