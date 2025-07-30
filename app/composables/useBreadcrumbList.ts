// composables/useBreadcrumbList.ts
import { useRoute } from 'nuxt/app'
import { baseBreadcrumbMap } from '~/utils/breadcrumbMap'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useBreadcrumbList() {
    const route = useRoute()
    const { locale } = useI18n()
    const baseUrl = useBaseUrl()

    const breadcrumbList = computed(() => {
        const langPrefix = `/${locale.value}`
        let pathWithoutLocale = route.fullPath.startsWith(langPrefix)
            ? route.fullPath.slice(langPrefix.length)
            : route.fullPath

        pathWithoutLocale = pathWithoutLocale.replace(/\/$/, '') || '/'

        const entries = baseBreadcrumbMap[pathWithoutLocale]
        if (!entries) return null

        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: entries.map((entry, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: entry.nameByLang[locale.value],
                item:
                    index === 0 && entry.key === ''
                        ? `${baseUrl}/`
                        : `${baseUrl}/${[...entries.slice(0, index + 1).map((e) => e.key)].filter(Boolean).join('/')}`,
            })),
        }
    })

    return breadcrumbList
}
