<script setup lang="js">
import { computed } from 'vue'
import { MediaType } from '@/core/constants'

const props = defineProps({
  apiUrlPress: {
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

const addMediaTypeToItem = (item, mediaType) => {
  // add delay to simulate async fetch 3 sec
  return {
    ...item,
    type: mediaType,
  }
}
const addJudgmentType = item => addMediaTypeToItem(item, MediaType.pressReleaseForJudgments)
const addPressReleaseType = item => addMediaTypeToItem(item, MediaType.generalPressRelease)

const { data: dataJudge, status: statusJudge } = await useFetch(props.apiUrlJudgments, { transform: items => items.map(addJudgmentType) })
const { data: dataPress, status: satatusPress } = await useFetch(props.apiUrlPress, { transform: items => items.map(addPressReleaseType) })

const items = computed(() => {
  const combinedData = dataJudge.value.length < 3
    ? [...dataJudge.value, ...dataPress.value]
    : dataJudge.value
  return combinedData.map((item) => {
    return {
      shortDescription: item.description?.substring(0, 90).concat('...'),
      id: item.id,
      title: item.title,
      type: item.type,
      reference: item.nr,
      date: item.formatedJudmentDate,
    }
  })
})
</script>

<template>
  <div>
    <div v-if="statusJudge === 'pending' || satatusPress === 'pending'">
      Loading...
    </div>
    <slot
      name="default"
      :items
    />
  </div>
</template>
