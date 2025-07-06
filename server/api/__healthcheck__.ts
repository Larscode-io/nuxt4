// /api/__healthcheck__.ts

export default defineEventHandler(() => {
  return { status: 'ok' }
})
