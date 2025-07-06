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
const addJudgmentType = (item) => addMediaTypeToItem(item, MediaType.pressReleaseForJudgments)
const addPressReleaseType = (item) => addMediaTypeToItem(item, MediaType.generalPressRelease)

const { data: dataJudge, status: statusJudge } = await useFetch(props.apiUrlJudgments, {
  transform: (items) => items.map(addJudgmentType),
})

const { data: dataPress, execute: fetchDataPress } = await useFetch(
  props.apiUrlPress,
  {
    immediate: false,
    transform: (items) => items.map(addPressReleaseType),
  },
)

watchEffect(() => {
  if (statusJudge.value === 'success' && dataJudge.value.length < props.maxItems) {
    fetchDataPress()
  }
})

// here we are combining the data from the two sources if the number of items from the first source is less than the maxItems
const combinedData = computed(() => {
  if (dataJudge.value.length < props.maxItems && dataPress.value) {
    const numberOfMissingItems = props.maxItems - dataJudge.value.length
    const itemsToAdd = dataPress.value.slice(0, numberOfMissingItems)
    return [
      ...dataJudge.value,
      ...itemsToAdd,
    ]
  }
  else {
    return [
      ...dataJudge.value.slice(0, props.maxItems),
    ]
  }
})

// here we are adding a short description to the items
const items = computed(() =>
  combinedData.value.map(({ description, ...rest }) => ({
    shortDescription: description?.substring(0, 180).concat('...'),
    ...rest,
  })),
)
</script>

<template>
  <div>
    <div v-if="statusJudge === 'pending' ">
      Loading...media card
    </div>
    <slot
      name="default"
      :items
    />
  </div>
</template>
