<template>
  <div
    class="banner-image-container"
    :alt="alt"
  >
    <div
      class="banner-image"
      :style="{ backgroundImage: `url(${image})` }"
    />
    <div class="layover" />
    <h2>
      {{ title }}
    </h2>
    <p :style="cssProps">
      {{ description }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'BannerImage',
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: [String, null],
      required: false,
      default: '',
    },
    image: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
    maxWidth: {
      type: Number,
      required: false,
      default: 666,
    },
  },
  computed: {
    cssProps() {
      return this.maxWidth ? { maxWidth: this.maxWidth + 'px' } : {}
    },
  },
}
</script>

<style lang="scss">
.banner-image-container {
  width: 100%;
  z-index: 0;
  position: relative;
  padding: 120px;
  widows: 100%;
  color: white;
  text-align: left;
  display: flex;
  flex-direction: column;

  @include mobile {
    padding: 40px;
  }

  h2 {
    font-family: 'Tiempos Headline';
    font-size: 2rem;
    font-weight: 600;
    line-height: 40px;
    position: relative;
    margin-bottom: 24px;
    max-width: 480px;

    @include mobile {
      max-width: 320px;
      font-size: 1.5rem;
    }

    &:after {
      content: '';
      width: 100px;
      height: 8px;
      background: $skyBlue;
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

  .banner-image {
    filter: grayscale(100%);
    width: 100%;
    background-size: cover;
    background-position: center 24%;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: -2;
  }

  .layover {
    background: $indigoLight;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: -1;
  }
}

.banner-image-container>* {
  z-index: 10;
}
</style>
