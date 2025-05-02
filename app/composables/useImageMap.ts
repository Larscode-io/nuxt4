// imageMap maps for example

// /assets/img/court/Y-0050.jpg: "/nuxt/_nuxt/assets/img/court/Y-0050.jpg"
const allImages = import.meta.glob('@/assets/img/{court,members}/**/*.{jpg,jpeg,png,webp,avif,svg}', {
  eager: true,
  import: 'default',
})

// members/quentin-pironnet.jpg to /nuxt/_nuxt/assets/img/members/quentin-pironnet.jpg
const imageMap: Record<string, string> = {}

for (const assetsPath in allImages) {
  const nuxtUrl = allImages[assetsPath]
  const relativePath = assetsPath.split('/assets/img/')[1]
  if (relativePath) {
    imageMap[relativePath] = nuxtUrl as string
  }
}

// members/emmanuelle-bribosia.jpg: /nuxt/_nuxt/assets/img/members/emmanuelle-bribosia.jpg
const getImageUrl = (path: string) => {
  const nuxtUrl = imageMap[path]
  if (!nuxtUrl) {
    console.warn(`Image not found: ${path}`)
    console.warn('Available images:', Object.keys(imageMap))
    const fallback = imageMap['court/fallback.png']
    return fallback ? fallback : (console.error('Fallback image not found'), '')
  }
  return nuxtUrl
}

export function useImageMap() {
  return {
    getImageUrl,
    imageMap,
  }
}
