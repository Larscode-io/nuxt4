export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)
  if (!url || typeof url !== 'string') {
    return { exists: false, error: 'Missing or invalid url' }
  }

  try {
    new URL(url) // Validate URL format
  } catch {
    return { exists: false, error: 'Invalid URL format' }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000) // 5-second timeout

  try {
    const response = await fetch(url, { method: 'HEAD', signal: controller.signal })
    clearTimeout(timeout)
    return { exists: response.ok, status: response.status }
  } catch (e) {
    clearTimeout(timeout)
    console.error(`Error checking URL: ${url}`, e)
    return { exists: false, error: 'Request failed or timed out' }
  }
})
