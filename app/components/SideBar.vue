<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()
const menuHeight = inject('menuHeight', ref(70))

const props = defineProps<{
  active: string
  toc: Array<{ id: string, text: string }>
}>()

const emit = defineEmits<{
  (e: 'click', link: string): void
}>()

const isActive = (title: string): boolean => {
  return encodeURIComponent(title.toUpperCase()) === encodeURIComponent(props.active.toUpperCase())
}

const selectedId = (link: string): void => {
  // Emit the click event so the parent component can execute updateCurrentActiveContentInToc
  emit('click', link)
  // Find the element by its ID
  const element = document.getElementById(link)
  if (element) {
    // Calculate the offset position for smooth scrolling
    const headerOffset = menuHeight.value
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - headerOffset

    // Scroll to the calculated position smoothly
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
}

const encode = (link: string): string => {
  return `#${link}`
}
</script>

<template>
  <aside
    class="sticky-sidebar"
    role="menu"
    :aria-label="t('aria.label.sidebar')"
  >
    <ul>
      <li
        v-for="content in toc"
        :key="content.id"
      >
        <a
          :class="{ current: isActive(content.id) }"
          :href="encode(content.id)"
          @click.prevent="selectedId(content.id)"
        >
          {{ content.text }}
        </a>
      </li>
    </ul>
  </aside>
</template>

<style lang="scss">
.sticky-sidebar {
  position: relative;
  height: 100%;
  margin-top: 32px;
  ul {
    width: 100%;
    position: sticky;
    top: 170px; // todo: uit variable halen
    li {
      margin-bottom: 24px;
      list-style-type: none;
      a {
        font-family: 'Tiempos Headline';
        font-weight: 600;
        font-size: 2rem;
        color: #949494;
        position: relative;
        text-decoration: none;
        word-break: break-word;
      }
      .current {
        color: black;
        &:before {
          content: '';
          position: absolute;
          width: 80px;
          height: 8px;
          position: absolute;
          background: $rajahYellow;
          bottom: -8px;
        }
      }
    }
  }
}
</style>
