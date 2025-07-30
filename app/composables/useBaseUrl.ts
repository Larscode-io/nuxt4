// app/composables/useBaseUrl.ts

export function useBaseUrl(): string {
    if (import.meta.server) {
        return `https://${useRequestURL().host}`
    } else {
        return `https://${window.location.host}`
    }
}
