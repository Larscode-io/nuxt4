// filepath: /server/api/swr-example.ts

export default defineEventHandler(async (event) => {
  const storage = useStorage('cache') // Nitro persistent storage
  const key = 'swr-example'
  const cached = await storage.getItem(key)

  // Type guard to check cached shape
  if (
    cached &&
    typeof cached === 'object' &&
    'timestamp' in cached &&
    'data' in cached &&
    typeof (cached as any).timestamp === 'number'
  ) {
    const age = Date.now() - (cached as any).timestamp
    const maxAge = 600_000
    if (age < maxAge) {
      const remainingMinutes = Math.ceil((maxAge - age) / 60000)
      setHeader(event, 'x-remaining-minutes', remainingMinutes.toString())
      return (cached as any).data
    }
  }

  const data = {
    message: 'SWR Test',
    updatedAt: new Date().toISOString(),
  }

  await storage.setItem(key, { data, timestamp: Date.now() })
  setHeader(event, 'x-remaining-minutes', '10')
  return data
})
