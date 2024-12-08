<template>
  <v-card
    class="contact-card"
    :width="width"
  >
    <v-img
      v-if="withImage && image"
      height="196px"
      :src="image"
    />
    <v-img
      v-if="withImage && !image"
      height="196px"
      :src="logo"
    />
    <div class="infos-container">
      <component
        :is="headline"
        class="header-name"
      >
        {{ name }}
      </component>
      <p>{{ jobtitle }}</p>
      <a
        :href="phoneHref"
        :aria-label="ariaLabel"
      >{{ phone }}</a>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { useNuxtApp } from '#app'

const props = defineProps({
  headlineLevel: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  jobtitle: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  ariaLabel: {
    type: String,
    // toto: set to true
    required: false,
  },
  width: {
    type: String,
    default: '280',
  },
  image: {
    type: String,
    default: '',
  },
  withImage: {
    type: Boolean,
    default: true,
  },
})

const logo = computed(() => {
  const { $assets } = useNuxtApp()
  return $assets('icons/fed.svg')
})

const phoneHref = computed(() => `tel:${props.phone}`)

const headline = computed(() => `h${props.headlineLevel}`)
</script>

<style lang="scss">
.contact-card {
  display: flex;
  flex-direction: column;
  border-radius: 0 !important;
  box-shadow: 1px 1px 4px 2px rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s ease-in-out;
  margin-bottom: 32px;
  @include mobile {
    margin-bottom: 24px;
    width: 100% !important;
  }
  .infos-container {
    padding: 20px;
    display: flex;
    background: $indigo;
    flex-direction: column;
    align-items: center;
    .header-name {
      font-size: 1.25rem;
      font-weight: 600;
      width: 100%;
      text-align: center;
      color: white;
    }
    p:first-of-type {
      text-align: center;
      font-size: 0.875rem;
    }
    a,
    p {
      color: white;
      text-decoration: none;
    }
  }
}
</style>
