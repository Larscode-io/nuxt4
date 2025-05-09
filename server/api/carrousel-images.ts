import { promises as fs } from 'fs'
import path from 'path'

export default defineEventHandler(async () => {
  const dir = path.resolve('public/prize/carrousel')
  const files = await fs.readdir(dir)
  const images = files.filter(file =>
    /\.(jpe?g|png|gif|webp)$/i.test(file),
  )
  return images
})
