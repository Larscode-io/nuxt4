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

export function groupBy<T>(
  array: T[] = [],
  props: string,
): { [key: string]: T[] } {
  return array.reduce((result: { [key: string]: T[] }, currentValue) => {
    ;(result[currentValue[props as keyof T] as unknown as string] = result[currentValue[props as keyof T] as unknown as string] || []).push(
      currentValue,
    )
    return result
  }, {})
}

/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object,
): Promise<[U | null, T | undefined]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        Object.assign(err as object, errorExt)
      }

      return [err, undefined]
    })
}

export async function pdfFileExists(pdfUrl: string) {
  const url = `https://www.const-court.be${pdfUrl}`

  try {
    const fetchResult = await fetch(url, { method: 'HEAD' })
    return fetchResult.ok && fetchResult.headers.get('content-type') === 'application/pdf'
  }
  catch {
    return false
  }
}
