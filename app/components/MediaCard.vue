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
    default: 3,
  },
})

const addMediaTypeToItem = (item, mediaType) => {
  return {
    ...item,
    type: mediaType,
  }
}
const addJudgmentType = item => addMediaTypeToItem(item, MediaType.pressReleaseForJudgments)
const addPressReleaseType = item => addMediaTypeToItem(item, MediaType.generalPressRelease)

const { data: dataJudge, status: statusJudge } = await useFetch(props.apiUrlJudgments, {
  transform: items => items.map(addJudgmentType),
}, {
  pick: ['description', 'id', 'title', 'nr', 'formatedJudgmentDate'],
})

// only needed to fetch press releases if the judgments fetch did not return enough items
// todo: refactor to useFetch with conditional fetch if needed
const { data: dataPress } = await useFetch(
  props.apiUrlPress,
  { transform: items => items.map(addPressReleaseType) },
  {
    pick: ['description', 'id', 'title', 'nr', 'formatedJudgmentDate'],
  },
)

const combinedData = computed(() => {
  return [
    ...dataJudge.value,
    ...(dataJudge.value.length < props.maxItems ? dataPress.value : []),
  ]
})

const items = computed(() => {
  const x = combinedData.value.map((item) => {
    const { description, ...rest } = item
    return {
      shortDescription: description?.substring(0, 180).concat('...'),
      ...rest,
    }
  }).slice(0, props.maxItems)
  console.log('items', x)
  return x
})
</script>

<template>
  <div>
    <div v-if="statusJudge === 'pending' ">
      Loading...
    </div>
    <slot
      name="default"
      :items
    />
  </div>
</template>
