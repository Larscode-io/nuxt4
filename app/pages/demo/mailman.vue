<script setup lang="ts">
import { watch, ref, reactive, computed } from 'vue'

import type { Languages } from '@/composables/useLanguage'
import { useLanguage, defaultListLang } from '@/composables/useLanguage'

const { t, locale } = useLanguage()

const form = reactive({
  usermail: '',
  selected: '', // has value like 'info_nl', 'info_fr', 'pdf_de'
  isSubmitting: false,
  userFeedbackMessage: '',
})

const _resetForm = () => {
  form.usermail = ''
  form.selected = defaultListLang[form.selected] || ''
  form.isSubmitting = false
  form.userFeedbackMessage = ''
}

// locale determins the default list, for example if locale is 'nl' the default list will be 'info_nl'
const defaultList = computed(() => {
  return defaultListLang[locale.value as Languages]
})

// fill form.selected with the defaultList value depending on the locale
form.selected = defaultList.value || 'info_fr'

// Validation PRE submit request to mailman
const emailIsValid = computed(() => {
  const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return form.usermail.length > 0 && emailPattern.test(form.usermail.toLowerCase())
})
const isSelectedListValid = computed(() => {
  return Object.values(defaultListLang).includes(form.selected)
})
const formIsValid = computed(() => {
  return emailIsValid.value && isSelectedListValid.value
})

const formDirty = ref({
  email: false,
  mailinglist: false,
})

const _learAllDirty = () => {
  Object.entries(formDirty.value).forEach((el) => {
    const [k] = el
    formDirty.value[k] = false
  })
}
const makeAllDirty = () => {
  Object.entries(formDirty.value).forEach((el) => {
    const [k] = el
    formDirty.value[k] = true
  })
}

const formFieldsErrorIndicator = computed(() => {
  return {
    email: formDirty.value.email && !emailIsValid.value,
    mailinglist: formDirty.value.mailinglist && !isSelectedListValid.value,
  }
})

const params = computed(() => {
  return {
    'email': form.usermail?.replace(/(["'|])/g, '\\'),
    'login-remind': 'Subscribe',
  }
})

const queryString = computed(() => {
  return Object.entries(params.value)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&')
})

const fetchData = async () => {
  try {
    const response = await fetch(
      `https://mailman.const-court.be/mailman/subscribe/${form.selected}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: queryString.value,
      },
    )

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`)
    }

    responseData.value = await response.text()
  }
  catch (error) {
    console.error('Error fetching data:', error)
    // todo: implement a better message for this case and add the translations
    form.userFeedbackMessage = 'Er is een fout opgetreden bij het aanmelden. Probeer het later opnieuw.'
  }
}

const submitRequest = async () => {
  form.isSubmitting = true

  makeAllDirty()
  await fetchData()

  if (mailmanSubmitIsValid.value) {
    form.userFeedbackMessage = userFeedbackMessages[locale.value as Locale] || ''
  }
  else if (emailsSeemsInvalid.value) {
    form.userFeedbackMessage = t('general.message.mailman.subscription-invalid-email')
  }
  else if (subscriptionSeemsInvalid.value) {
    // toto: implement a better message for this case and add the translations
    form.userFeedbackMessage = t('general.message.mailman.subscription-failure')
  }
  else {
    form.userFeedbackMessage = t('general.message.mailman.subscription-failure')
  }
  form.isSubmitting = false
}

// POST request stuff
const responseData = ref('')

const subscriptionResponse = computed(() => {
  const defaultResponse = ''
  if (!responseData.value) {
    return defaultResponse
  }

  const bodyRegex = /<body[^>]*>((.|[\n\r])*)<\/body>/im
  const bodyMatch = responseData.value.match(bodyRegex)
  const bodyText = bodyMatch ? bodyMatch[1] : ''

  return bodyText?.trim() || 'lege bodyText'
})

const subscriptionSeemsValid = computed(() => {
  const validSubTextRegex = new RegExp([
    'Uw aanmeldingsverzoek is ontvangen en zal zo spoedig mogelijk worden',
    'Ihr Abonnement-Antrag ist soeben eingetroffen',
    'Your subscription request has been received',
    'Votre demande d\'abonnement a',
  ].join('|'))

  return validSubTextRegex.test(subscriptionResponse.value)
})

const emailsSeemsInvalid = computed(() => {
  const invalidEmailTextRegex = new RegExp([
    'Die von Ihnen angegebene E-Mail-Adresse ist ungültig',
    'Het door u opgegeven e-mailadres is niet geldig',
    'adresse courriel fournie n\'est pas valide.',
  ].join('|'))

  return invalidEmailTextRegex.test(subscriptionResponse.value)
})

const subscriptionSeemsInvalid = computed(() => {
  const invalidSubTextRegex = new RegExp([
    'niet geldig',
    'ungültig',
    'not valid',
    'n\'est pas valide.',
  ].join('|'))

  return invalidSubTextRegex.test(subscriptionResponse.value)
})

const mailmanSubmitIsValid = computed(() => {
  return subscriptionSeemsValid.value && !emailsSeemsInvalid.value && !subscriptionSeemsInvalid.value
})

watch(() => form.userFeedbackMessage, () => {
  setTimeout(() => {
    form.userFeedbackMessage = ''
  }, 3000)
})

type Locale = Languages.DUTCH | Languages.FRENCH | Languages.GERMAN | Languages.ENGLISH
// to be added in the i18n language files in the folder app/lang/json: nl.json, fr.json, de.json, en.json
const titelMessage: Record<Locale, string> = {
  nl: 'U kan zich abonneren op de nieuwsbrief van het Hof door uw e-mailadres hieronder in te voeren en op “Aanmelden” te klikken.',
  fr: 'Vous pouvez vous abonner à la newsletter de la Cour en entrant votre adresse e-mail ci-dessous et en cliquant sur "S\'inscrire".',
  de: 'Sie können den Newsletter des Gerichts abonnieren, indem Sie Ihre E-Mail-Adresse unten eingeben und auf "Abonnieren" klicken.',
  en: 'You can subscribe to the Court\'s newsletter by entering your email address below and clicking "Subscribe".',
}
const userFeedbackMessages: Record<Locale, string> = {
  nl: 'Uw aanmeldingsverzoek is ontvangen en zal zo spoedig mogelijk worden verwerkt.',
  fr: 'Votre demande d\'abonnement a été reçue et sera traitée dès que possible.',
  de: 'Ihr Abonnement-Antrag ist soeben eingetroffen und wird so bald wie möglich bearbeitet.',
  en: 'Your subscription request has been received and will be processed as soon as possible.',
}
</script>

<template>
  <div class="container">
    <p class="description">
      {{ titelMessage[locale as Locale] }}
    </p>
    <form>
      <div class="form-group">
        <label
          for="mailid"
          class="form-label"
        >
          {{ t("general.email") }}
        </label>
        <input
          id="mailid"
          v-model="form.usermail"
          type="email"
          class="form-input"
          :class="{ error: formFieldsErrorIndicator?.email }"
          placeholder="John"
          required
          @blur="formDirty.email = true"
        >
        <p
          v-if="formFieldsErrorIndicator?.email"
          class="error-text"
        >
          Een geldig email adres is nodig.
        </p>
        <select
          v-model="form.selected"
          class="form-input"
          @change="formDirty.mailinglist = true"
        >
          <option
            v-for="(value, lang) in defaultListLang"
            :key="lang"
            :value="defaultListLang[lang]"
          >
            {{ t(`general.message.mailman.letter.${lang}`) }}
          </option>
        </select>
      </div>
    </form>

    <div
      v-if="form.userFeedbackMessage"
      class="feedback-message"
    >
      {{ form.userFeedbackMessage }}
    </div>
    <div v-else>
      {{ t("newsletter.declaration") }}
    </div>

    <div class="form-footer">
      <button
        :disabled="form.isSubmitting || !formIsValid"
        class="submit-button"
        @click="submitRequest"
      >
        {{ form.isSubmitting
          ? t("general.message.mailman.subscribe-short") + "..."
          : t("general.message.mailman.subscribe-short") }}
      </button>
    </div>
  </div>
</template>

<style scoped>
nav {
    display: flex;
    gap: 1rem;
    padding: 1rem;
}

.container {
    padding: 20px;
}

.description {
    margin-bottom: 16px;
    color: #4a4a4a;
}

.form-group {
    margin-bottom: 24px;
}

.form-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.form-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
}

.form-input.error {
    border-color: #e53e3e;
}

.error-text {
    margin-top: 8px;
    font-size: 12px;
    color: #e53e3e;
}

.feedback-message {
    padding: 12px;
    margin-top: 16px;
    background-color: #4a148c;
    color: white;
    font-weight: bold;
    border-radius: 4px;
}

.form-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 16px;
    border-top: 1px solid #ccc;
}

.submit-button {
    padding: 8px 16px;
    color: white;
    border-radius: 4px;
    background-color: #4a90e2;
    border: none;
    cursor: pointer;
}

.submit-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
