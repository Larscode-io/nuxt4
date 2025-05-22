// aliases.ts
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const aliasMap = {
  '@': resolve(__dirname, 'app'),
  '@core': resolve(__dirname, 'app/core'),
  '@utils': resolve(__dirname, 'app/utils'),
  '@assets': resolve(__dirname, 'app/assets'),
  '@types': resolve(__dirname, 'types'),
}
