<!--
Wacht altijd met het instellen van de default tot na onMounted()
in pagina's waar de sidebar gebruikt wordt (dus: client-only)
zodat de component niet direct hydrateert met een verkeerde waarde
en de server-rendered content overeenkomt met de client-rendered content
-->

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

const isHydrated = ref(false)
onMounted(() => {
  // Set isHydrated to true after the component has been mounted
  // DOM-dependent code should be run after mounting to avoid hydration errors
  // if watch() is fired on currentActiveContentInToc what can cause hydration errors
  // because the initial value is not set yet on the server side
  // and the client side will try to update the DOM before it is ready
  // This ensures that the component is fully hydrated before we start using it
  isHydrated.value = true
})
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
          :class="{ current: isHydrated && isActive(content.id) }"
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
