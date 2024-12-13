export function range(start, end, step = 1) {
  const len = Math.floor((end - start) / step) + 1
  return Array(len)
    .fill(undefined)
    .map((_, idx) => start + idx * step)
}

export const chunk = (arr = [], size = 1) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
    arr.slice(i * size, i * size + size),
  )
