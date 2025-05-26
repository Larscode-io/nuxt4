<script setup lang="ts">
import { watch, ref, reactive, computed } from 'vue'

const { t, locale } = useLanguage()
const faker = await useFaker(locale.value)

const props = defineProps({
  email: {
    type: String,
    required: false,
  },
})

const form = reactive({
  usermail: props.email || '',
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
  return true
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
    form.userFeedbackMessage = t('general.message.mailman.subscription-succes')
  }
  else if (emailsSeemsInvalid.value) {
    form.userFeedbackMessage = t('general.message.mailman.subscription-invalid-email')
  }
  else if (subscriptionSeemsInvalid.value) {
    // todo: implement a better message for this case and add the translations
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
  }, 8000)
})
</script>

<template>
  <!-- <slot
    v-if="props.email"
    name="email"
    :email="props.email"
  /> -->
  <slot
    name="default"
    email=""
  />
  <div class="container">
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
          :placeholder="faker.internet.email() || 'John'"
          required
          @blur="formDirty.email = true"
        >
        <p
          v-if="formFieldsErrorIndicator?.email"
          class="error-text"
        >
          Een geldig email adres is nodig.
        </p>
        <div class="position-relative">
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
          <i
            class="mdi mdi-chevron-down position-absolute"
            style="right: 10px; top: 50%; transform: translateY(-50%); "
          />
        </div>
      </div>
    </form>

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

    <div
      v-if="form.userFeedbackMessage"
      class="feedback-message"
    >
      {{ form.userFeedbackMessage }}
    </div>
    <div v-else>
      {{ t("newsletter.declaration") }}
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
    justify-content: flex-start;
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
