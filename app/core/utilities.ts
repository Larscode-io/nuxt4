export function range(start: number, end: number, step = 1) {
  const len = Math.floor((end - start) / step) + 1
  return Array(len)
    .fill(undefined)
    .map((_, idx) => start + idx * step)
}

export const chunk = (arr = [], size = 1) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
    arr.slice(i * size, i * size + size),
  )

export const getMemberImage = (path: string) => {
  if (!path) {
    return
  }

  try {
    return new URL(`/assets/img/members/${path}`, import.meta.url).href
  }
  catch (e) {
    console.error('Error loading member image:', e)
    return
  }
}
