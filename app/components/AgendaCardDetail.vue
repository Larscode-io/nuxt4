<template>
  <v-card :id="`agenda-card-${id}`" class="agenda-card-detail">
    <div class="date-box">
      <p>{{ day }}</p>
      <p>{{ month }}</p>
    </div>
    <div class="agenda-card-infos">
      <h3>
        {{ title }} :
        <v-chip color="rgba(254, 201, 118, 0.5)">
          {{ id }}
        </v-chip>
        <v-chip v-for="tag in childCaseNumbers" :key="tag" color="rgba(254, 201, 118, 0.5)">
          {{ tag }}
        </v-chip>
      </h3>
      <p>{{ nr }}</p>
      <v-card-text>
        <strong> {{ concerning }}{{ colon }} </strong>
        <span v-html="description" />
      </v-card-text>
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  day: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  nr: {
    type: String,
    required: false,
    default: ''
  },
  childCaseNumbers: {
    type: Array,
    required: false,
    default: () => []
  },
  description: {
    type: String,
    required: false,
    default: '',
  },
  colon: {
    type: String,
    required: false,
    default: ''
  },
  type: {
    type: String,
    required: false,
    default: ''
  },
  concerning: {
    type: String,
    required: true,
  },
})

const {
  day,
  month,
  title,
  id,
  nr,
  childCaseNumbers,
  description,
  colon,
  type,
  concerning
} = props
</script>

<style scoped lang="scss">
.agenda-card-detail {
  padding: 20px;
  width: 100%;
  box-shadow: 1px 1px 4px 2px rgba(0, 0, 0, 0.08) !important;
  border-radius: 0;
  margin-bottom: 20px;
  display: flex;

  @include mobile {
    width: 100%;
    margin: 0 16px 20px 16px;
  }

  .date-box {
    width: 80px;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: $rajahExtraLight;
    border: 4px solid $rajahYellow;
    border-radius: 4px;
    margin-right: 20px;
    color: $textOnRajah;

    p:first-of-type {
      font-size: 2.5rem;
      margin: 0;
      line-height: 32px;
      padding: 11px 0 2px 0;
    }

    p:last-of-type {
      font-size: 1.25rem;
      margin: 0;
      text-transform: uppercase;
    }
  }

  .agenda-card-infos {
    width: calc(100% - 112px);

    h3 {
      margin-bottom: 16px;
    }

    p,
    h3 {
      text-align: left;
      font-size: 1.25rem;
      font-weight: 500;
      line-height: 2rem;
    }

    .v-card__text {
      //font-size: 1rem;
      padding: 0;
    }
  }
}
</style>
