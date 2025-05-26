<script setup>
import { ref } from 'vue'

const props = defineProps({
  ariaLabel: {
    type: String,
  },
  isGroup: {
    type: Boolean,
    required: false,
  },
})

const buttonId = useId()
const isOpen = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
  const button = document.querySelector(`.accordion-trigger#${buttonId}`)
  button.setAttribute('aria-expanded', button.getAttribute('aria-expanded') === 'true' ? 'false' : 'true')
}
</script>

<template>
  <div class="accordionGroup">
    <div class="accordion">
      <div>
        <button
          :id="buttonId"
          class="accordion-trigger"
          aria-expanded="false"
          :aria-label="props.ariaLabel"
          @click="toggle"
        >
          <h4>
            <slot name="title">
              did we forget to add a title slot?
            </slot>
          </h4>
          <v-icon>mdi-chevron-down</v-icon>
        </button>
        <div v-if="isOpen">
          <ContentSlot />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h3,
    v-expansion-panel--active h4 {
        padding-top: 32px;
        padding-bottom: 24px;
        font-size: 2rem;
        font-weight: 600;

        @include tablet-portrait {
            padding-top: 24px;
            padding-bottom: 16px;
            font-size: 1.5rem;
        }
    }

h4 {
        text-align: left;
    }

.accordion-trigger {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

.accordion-trigger[aria-expanded='false']+.accordion-content {
        display: none;
    }

.v-icon {
        transition: transform 0.2s linear;
    }

h4 {
        transition: font-size 0.2s linear, font-weight 0.2s linear;
    }

.accordion-trigger[aria-expanded='true'] {
        .v-icon {
            transform: rotate(180deg);
        }

h4 {
            // padding-top: 1rem;
            // padding-bottom: 24px;
            font-size: 2rem;
            font-weight: 600;

            @include tablet-portrait {
                padding-top: 24px;
                padding-bottom: 16px;
                font-size: 1.5rem;
            }
        }
    }

.accordion {
        padding: 16px 24px;
        border-bottom: 0.5px solid #666;

        &:focus-within {
            outline: 1.5px solid black;
        }

button:focus {
            outline: none;
        }
    }

p {
        text-indent: 1rem;
    }

.new-block {
        display: block;
    }

h5,
    h6 {
        text-align: center;
    }

h5 {
        font-size: 1.15rem;
    }

h6 {
        font-size: 1rem;
    }

.titles { font-size: 1.3em; }

.chapters {
        font-size: 1rem;
    }

.sections {
        font-size: 0.9rem;
    }

.subsections {
        font-size: 0.85rem;
    }

.titles,
    .chapters,
    .sections,
    .subsections {
        margin-top: 0.1rem;
    }

ol {
        padding-left: 2.1rem;
        margin-bottom: 0;
    }

ul {
        padding-left: 2.1rem;
        margin-bottom: 0;
    }

.no-bottom-margin {
        margin-bottom: 0;
    }

.no-text-indent p {
        text-indent: 0;
    }

.gray-bg {
        background-color: rgb(230, 230, 230);
        margin-bottom: 16px;
        padding: 10px;
    }

.gray-bg.inline {
        padding: 0;
    }

.bold {
        font-weight: bold;
    }

.art {
        font-family: proxima-nova, sans-serif;
        font-size: 85%;
        font-weight: normal;
        background-color: white;
        display: inline-block;
        padding: 3px;
        margin-bottom: 16px;
        text-indent: 0;
        margin-left: 1rem;
        margin-top: 16px;
    }

.space {
    height: 40vh;
}
</style>
