export function useDebouncedRef<T>(source: Ref<T>, delay = 300): Ref<T> {
  const debounced = ref(source.value) as Ref<T>
  let timeout: ReturnType<typeof setTimeout>

  watch(source, (newVal) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debounced.value = newVal
    }, delay)
  })

  return debounced
}
