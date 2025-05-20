import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

export function useActiveSectionObserver(
  selector: string,
  threshold = 0.75,
) {
  const currentActiveContentInToc = ref('')
  const observer = ref<IntersectionObserver | null>(null)

  const updateCurrentActiveContentInToc = (id: string) => {
    currentActiveContentInToc.value = id
  }

  const observeElements = () => {
    if (!observer.value) return
    document.querySelectorAll(selector).forEach((el) => {
      if (el.id) {
        observer.value?.observe(el)
      }
    })
  }

  onMounted(() => {
    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            const elem = entry.target as HTMLElement
            updateCurrentActiveContentInToc(elem.id)
          }
        })
      },
      {
        threshold,
        rootMargin: '0px 0px -50% 0px',
      },
    )
    observeElements()
  })

  onBeforeUnmount(() => {
    observer.value?.disconnect()
  })

  return {
    currentActiveContentInToc,
    updateCurrentActiveContentInToc,
  }
}
