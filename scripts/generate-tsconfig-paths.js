import { writeFileSync } from 'fs'
import { relative, dirname } from 'path'
import { fileURLToPath } from 'url'
import { aliasMap } from '../aliases.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const tsconfigPaths = {}

for (const [key, absPath] of Object.entries(aliasMap)) {
  const relPath = relative(__dirname, absPath)
  tsconfigPaths[`${key}/*`] = [`${relPath}/*`]
}

const tsconfig = {
  compilerOptions: {
    baseUrl: '.',
    paths: tsconfigPaths,
  },
}

writeFileSync('./tsconfig.paths.json', JSON.stringify(tsconfig, null, 2))
console.log('✅ tsconfig.paths.json generated successfully.')
