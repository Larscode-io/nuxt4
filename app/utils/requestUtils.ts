// Custom fetch function implemented to centralize fetch related logic
export const cFetch = (
  url: string,
  method: 'GET' | 'PUT' | 'POST' | 'DELETE' = 'GET',
  options = {},
) => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiBaseUrl || ''
  return useFetch(`${apiUrl}${url}`, {
    method,
    ...options,
  })
}

// Convenience methods
export const cGet = (url: string, options = {}) => {
  return cFetch(url, 'GET', options)
}

export const cPost = (url: string, body: any, options = {}) => {
  return cFetch(url, 'POST', { body, ...options })
}

export const cPut = (url: string, body: any, options = {}) => {
  return cFetch(url, 'PUT', { body, ...options })
}

export const cDelete = (url: string, options = {}) => {
  return cFetch(url, 'DELETE', options)
}
