<template>
  <v-card :id="`session-card-${id}`" class="session-card-detail">
    <div class="date-box">
      <p>{{ day }}</p>
      <p>{{ month }}</p>
    </div>
    <div class="card-infos">
      <span>
        <img src="../assets/img/clock.svg">
        <p>{{ time }}</p>
      </span>
      <span>
        <img src="../assets/img/location.svg">
        <p>{{ location }}</p>
      </span>
    </div>
    <div class="card-spec">
      <h3>
        {{ title }}
        - {{ id }} {{ lang }}
      </h3>
      <v-card-text>
        <strong>
          {{ concerning }}
          {{ colon }}
        </strong>
        {{ description }}
      </v-card-text>
    </div>
  </v-card>
</template>

<script setup>
defineProps({
  id: {
    type: Number,
    required: true
  },
  lang: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  concerning: {
    type: String,
    required: true
  },
  colon: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>

<style scoped lang="scss">
.session-card-detail {
  padding: 20px;
  width: 100%;
  display: flex;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08);
  background-position: center right;
  margin: 0 24px 20px 0;
  height: fit-content;
  align-items: center;
  flex-wrap: wrap;
  @include mobile {
    width: calc(100% - 32px);
    margin: auto;
    margin-bottom: 20px;
  }
  .date-box {
    width: 80px;
    height: 80px;
    background: $indigoExtraLight;
    border: 4px solid $indigoExtraLight;
    border-radius: 4px;
    margin-right: 8px;
    color: $indigo;
    display: flex;
    flex-direction: column;
    align-items: center;
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
  .card-infos {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    p {
      text-align: left;
      font-size: 1rem;
      line-height: 20px;
      font-weight: 400;
      margin: 0;
    }
    span {
      display: flex;
      align-items: center;
      img {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
    }
    span:first-of-type {
      margin-bottom: 16px;
    }
  }
  .card-spec {
    width: 100%;
    margin-top: 16px;
    text-align: left;
    p, h3 {
      text-align: left;
      font-size: 1.25rem;
      font-weight: 500;
      line-height: 2rem;
    }
    h3{
      margin-bottom: 16px;
    }
    .v-card__text {
      padding: 0;
      strong {
        font-weight: 600;
      }
    }
  }
}
</style>
