<template>
  <section class="banner-member-container">
    <div class="banner-member-content">
      <div
        class="member-img white"
        :style="cssProps"
      />
      <div class="member-text">
        <h2 ref="memberContent">
          {{ name }}
        </h2>
        <span />
        <p>{{ jobtitle }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { getMemberImage } from '~/core/utilities'

const props = defineProps({
  image: {
    type: String,
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
})
const memberContent = ref<HTMLElement | null>(null)

const cssProps = computed(() => ({
  backgroundImage: `url(${getMemberImage(props.image)})`,
}))

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      if (memberContent.value) {
        memberContent.value.setAttribute('tabindex', '-1')
        memberContent.value.focus()
        setTimeout(() => {
          memberContent.value?.removeAttribute('tabindex')
        }, 1000)
      }
    }, 0)
  })
})
</script>

  <style scoped lang="scss">
  .banner-member-container {
    width: 100%;
    height: 275px;
    background-image: url('../assets/img/banner-member.png');
    background-size: cover;
    .banner-member-content {
      display: flex;
      flex-direction: row;
      transform: translate(40px, 80px);

      .member-img {
        width: 320px;
        height: 320px;
        border: 4px solid white;
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
        box-sizing: unset;
        background-position: center center;
        background-size: cover;
      }
      .member-text {
        color: white;
        margin-left: 80px;
        display: flex;
        flex-direction: column;
        margin-top: 64px;
        align-items: center;
        h2 {
          font-family: 'Tiempos';
          font-size: 2rem;
          font-weight: 600;
          line-height: 2.5rem;
          text-align: center;
          &:focus{
            outline: 1.5px solid black;
          }
        }
        span {
          display: block;
          width: 64px;
          height: 2px;
          background: white;
          margin: 8px 0;
        }
        p {
          text-align: center;
          font-size: 1.25rem;
          font-weight: 600;
        }
      }
    }
    @include tablet-portrait {
    .banner-member-content {
      flex-direction: column-reverse;
      transform: none;
      align-items: center;
      .member-img {
        width: 240px;
        height: 240px;
      }
      .member-text {
        margin: 20px 0;
      }
    }
  }
  }
  </style>
