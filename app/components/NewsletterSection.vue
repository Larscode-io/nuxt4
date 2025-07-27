<script setup>
import { ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

const emit = defineEmits(['mail-submitted'])

const { t } = useLanguage()

const mymail = ref('')

function onSubmit() {
  if (!mymail.value) return
  emit('mail-submitted', { mailinfo: mymail.value })
}
</script>

<template>
  <v-container class="flex-column align-start flex-nowrap">
    <section
      class="newsletter-container"
      :alt="t('alt.newsletter', 2)"
    >
      <div class="newsletter-text">
        <h2>{{ t('newsletter.title') }}</h2>
        <p />
      </div>
      <div class="subscribe-container">
        <form
          class="review-form"
          @submit.prevent="onSubmit"
        >
          <label
            class="upperLabel"
            for="mailInput"
            :aria-label="t('aria.label.landing.newsletter', 2)"
          >
            {{ t('general.subscribe') }}
          </label>
          <div class="input-container pt-2">
            <div class="inputField">
              <label
                class="innerLabel"
                for="mailInput"
              >
                {{ t('general.email-placeholder') }}:
              </label>
              <input
                id="mailInput"
                v-model="mymail"
                type="text"
              >
            </div>
            <button type="submit">
              {{ t('general.send') }}
            </button>
          </div>
        </form>
      </div>
    </section>
  </v-container>
</template>

<style lang="scss">
.newsletter-container {
  width: 100%;
  padding: 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  flex-wrap: wrap;
  @include tablet-portrait {
    flex-direction: column;
    padding: 40px;
  }
  .newsletter-text {
    color: white;

    text-align: left;
    h2 {
      font-family: 'Tiempos Headline';
      font-size: 2rem;
      line-height: 40px;
      position: relative;
      margin-bottom: 24px;
      font-weight: 600;
      max-width: 420px;
      &:after {
        content: '';
        width: 100px;
        height: 8px;
        background: $rajahLight;
        position: absolute;
        left: 0;
        bottom: -8px;
      }
    }
    p {
      font-size: 1.25rem;
      line-height: 24px;
      max-width: 450px;
    }
    @include tablet-portrait {
      h2 {
        width: 100%;
        p {
          width: 100%;
        }
      }
    }
  }
  .subscribe-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    @include mobile {
      width: 100%;
    }
    .inputField{
      display: flex;
      &:focus-within{
      outline: 1.5px solid black;
      }
    }

    .upperLabel {
      font-size: 1.25rem;
      line-height: 24px;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
      color: white;
      font-weight: 700;
      text-align: left;
    }
    .input-container {
      display: flex;
      .innerLabel{
        height: 48px;
        display: flex;
        align-items: center;
        padding-left: 10px;
        background-color: white;
        color: black;
      }
      input {
        height: 48px;
        width: 380px;
        background: white;
        padding: 14px;
        transition: all 0.2s ease-in-out;
        &::placeholder {
          color: black;
          font-weight: 400;
        }
        &:focus {
          outline: none;
          transition: all 0.2s ease-in-out;
        }
        @include mobile {
          width: calc(100% - 124px);
        }
      }
      button {
        font-size: 1.25rem;
        line-height: 24px;
        padding: 12px 24px;
        color: $textOnRajah;
        background: $rajahLight;
        // background-color: $skyBlue;
        &:focus {
          outline: 1.5px solid black;
        }
        &:hover {
          box-shadow: 0px 0px 19px 1px $skyBlueExtraLight;
        }
      }
    }
  }
}
.newsletter-container::before {
  content: '';
  background-image: url('/img/newsletter-background.webp');
  filter: grayscale(100%);
  background-size: cover;
  background-position: center 60%;
  position: absolute;
  width: 100%;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}
.newsletter-container::after {
  content: '';
  background: $indigoLight;
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 1;
}
.newsletter-container > * {
  z-index: 10;
}
</style>
