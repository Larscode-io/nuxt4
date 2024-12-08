import slugify from '@sindresorhus/slugify'

export function toSlug(value = '') {
  value = value.toString()
  return slugify(value)
}
