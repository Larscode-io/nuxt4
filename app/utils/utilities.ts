import slugify from '@sindresorhus/slugify'

export function toSlug(value = '') {
  value = value.toString()
  return slugify(value)
}

export function range(start: number, end: number, step: number = 1): number[] {
  const len = Math.floor((end - start) / step) + 1
  return Array(len)
    .fill(undefined)
    .map((_, idx) => start + idx * step)
}

export const chunk = (arr = [], size = 1) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
    arr.slice(i * size, i * size + size),
  )

export const downloadPublicFile = (filePath: string) => {
  const url = `https://www.const-court.be${filePath}`
  window.open(url, '_blank')
}

// todo: move to a shared location
// also see server/api/check-file.ts
export const checkFileExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    if (response.ok) {
      return true
    }
    else {
      return false
    }
  }
  catch (e) {
    console.info(`%cWe tried to check existence with a HTTP HEAD request: ${url}`, 'color: red')
    console.error('%c' + e, 'color: red')
    return false
  }
}
