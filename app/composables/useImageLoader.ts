// composables/useImageLoader.js
export const useImageLoader = () => {
  const images = import.meta.glob('~/assets/img/media/*.jpg', { eager: true, import: 'default' })

  interface ImageLoader {
    getImage: (imageName: string) => string | undefined
  }

  const getImage: ImageLoader['getImage'] = (imageName) => {
    return images[`/assets/img/media/${imageName}.png`] as string | undefined
  }

  return { getImage }
}
