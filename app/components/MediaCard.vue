<script lang="ts" setup>
import { MediaType } from '@/core/constants'
import type { GeneralPressJudgment, GeneralPressRelease } from '@/core/constants'

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
})

interface ExtendedGeneralPressRelease extends GeneralPressRelease {
  shortDescription: string
  showFullDescription: boolean
  type: MediaType
}
interface ExtendedGeneralPressJudgment extends GeneralPressJudgment {
  shortDescription: string
  showFullDescription: boolean
  type: MediaType
}

const transform_GeneralPressJudgment = (items: GeneralPressJudgment[]): ExtendedGeneralPressJudgment[] => {
  const limitedItems = props.maxItems ? items.slice(0, props.maxItems) : items
  return limitedItems.map(item => ({
    ...item,
    shortDescription: item.description?.substring(0, 90).concat('...'),
    showFullDescription: false,
    type: MediaType.pressReleaseForJudgments,
  }))
}
const transform_GeneralPressRelease = (items: GeneralPressRelease[]): ExtendedGeneralPressRelease[] => {
  const limitedItems = props.maxItems ? items.slice(0, props.maxItems) : items
  return limitedItems.map(item => ({
    ...item,
    shortDescription: item.description?.substring(0, 90).concat('...'),
    showFullDescription: false,
    type: MediaType.generalPressRelease,
  }))
}

const { data: generalPressRelease, error: generalPressReleaseError } = await useFetch<GeneralPressRelease[]>(props.apiUrlRelease, { transform: transform_GeneralPressRelease }) as { data: Ref<GeneralPressRelease[]>, error: Ref<Error> }
const { data: generalPressJudgments, error: generalPressJudgmentsError } = await useFetch<GeneralPressJudgment[]>(props.apiUrlJudgments, { transform: transform_GeneralPressJudgment }) as { data: Ref<GeneralPressJudgment[]>, error: Ref<Error> }

if (generalPressReleaseError.value || generalPressJudgmentsError.value) {
  throw createError({ statusCode: 404, statusMessage: 'We have a issue with fetching data in MediaCard' })
}

const medias = computed(() => {
  const combinedMedias = [
    ...generalPressJudgments.value?.map(media => ({
      ...media,
    })) || [],
    ...generalPressRelease.value?.map(media => ({
      ...media,
    })) || [],
  ]
  return props.maxItems ? combinedMedias.slice(0, props.maxItems) : combinedMedias
})
</script>

<template>
  <v-row>
    <v-col
      v-for="(item, index) in medias ?? []"
      :key="index"
      cols="12"
      sm="12"
      md="4"
      xl="2"
    >
      <slot
        name="item"
        :item="item"
      />
    </v-col>
  </v-row>
</template>
