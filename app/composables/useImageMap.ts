import { a } from "vitest/dist/chunks/suite.B2jumIFP.js"

// ~/composables/useImageMap.ts
const imageMap: Record<string, string> = {}

const allImages = import.meta.glob('@/assets/img/{court,members}/**/*.{jpg,jpeg,png,webp,avif,svg}', {
  eager: true,
  import: 'default'
})

for (const [fullPath, url] of Object.entries(allImages)) {
  const relativePath = fullPath.split('/assets/img/')[1]
  if (relativePath) {
    imageMap[relativePath] = url as string
  }
}

const getImageUrlx = (path: string) => {
  const imageUrl = imageMap[path]
  if (!imageUrl) {
    console.warn(`Image not found: ${path}`)
    console.warn('Available images:', Object.keys(imageMap))
    const fallback = imageMap['court/fallback.png']
    return fallback ? fallback : (console.error('Fallback image not found'), '')
  }
  return imageUrl
}

export function useImageMap() {
  return  {
    getImageUrlx,
    imageMap,
  }
  }
