<script lang="ts" setup>
import { MediaType } from '@/core/constants'
import type { GeneralPressJudgment, GeneralPressRelease } from '@/core/constants'

const { t } = useLanguage()

const props = defineProps({
  apiUrlRelease: {
    type: String,
    required: true,
  },
  apiUrlJudgments: {
    type: String,
    required: true,
  },
  maxItems: {
    type: Number,
    required: false,
  },
  displayModes: {
    type: Array,
    required: true,
  },
})

interface ExtendedGeneralPressRelease extends GeneralPressRelease {
  shortDescription: string
  type: MediaType
}
interface ExtendedGeneralPressJudgment extends GeneralPressJudgment {
  shortDescription: string
  type: MediaType
}

const transform_GeneralPressJudgment = (items: GeneralPressJudgment[]): GeneralPressJudgment[] => {
  return props.maxItems ? items.slice(0, props.maxItems) : items
}
const transform_GeneralPressRelease = (items: GeneralPressRelease[]): GeneralPressRelease[] => {
  return props.maxItems ? items.slice(0, props.maxItems) : items
}

const { data: generalPressRelease, error: generalPressReleaseError, execute: fetchPressReleases }
  = useFetch<GeneralPressRelease[]>(props.apiUrlRelease,
    { transform: transform_GeneralPressRelease, immediate: false, watch: false }) as { data: Ref<GeneralPressRelease[]>, error: Ref<Error>, execute: () => Promise<void> }
const { data: generalPressJudgments, error: generalPressJudgmentsError, execute: fetchJudgments }
  = useFetch<GeneralPressJudgment[]>(props.apiUrlJudgments,
    { transform: transform_GeneralPressJudgment, immediate: false, watch: false }) as { data: Ref<GeneralPressJudgment[]>, error: Ref<Error>, execute: () => Promise<void> }

const medias = ref<(ExtendedGeneralPressRelease | ExtendedGeneralPressJudgment)[]>([])
const isLoading = ref(true)
const hasError = ref(false)

async function fetchData() {
  try {
    isLoading.value = true
    await Promise.all([fetchPressReleases(), fetchJudgments()])
    if (generalPressReleaseError.value || generalPressJudgmentsError.value) {
      hasError.value = true
    }
    else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      medias.value = [
        ...generalPressJudgments.value?.map(({ title, id, description, ..._removeRest }) => ({
          title,
          id,
          description,
          shortDescription: description?.substring(0, 90).concat('...'),
          type: MediaType.pressReleaseForJudgments,
        })) || [],
        ...generalPressRelease.value?.map(({ title, id, description, ..._removeRest }) => ({
          title,
          id,
          description,
          shortDescription: description?.substring(0, 90).concat('...'),
          type: MediaType.generalPressRelease,
        })) || [],
      ].slice(0, props.maxItems ?? medias.value.length)
    }
  }
  catch (error) {
    hasError.value = true
    console.error(error)
  }
  finally {
    isLoading.value = false
  }
}
onMounted(fetchData)
</script>

<template>
  <v-row>
    <v-col v-if="isLoading">
      {{
        t('general.loading')
      }}
    </v-col>
    <v-col v-else-if="hasError">
      {{
        t('error.fetching-data')
      }}
    </v-col>
    <v-col
      v-for="(item, index) in medias ?? []"
      :key="index"
      cols="12"
      sm="12"
      md="4"
      xl="2"
    >
      <slot
        v-bind="{ ...item, displayMode: props.displayModes[index], index }"
        name="item"
      />
    </v-col>
  </v-row>
</template>
