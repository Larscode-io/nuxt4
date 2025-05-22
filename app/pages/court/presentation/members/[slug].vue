<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Languages, OrganizationMemberRole } from '@core/constants'
// import type { Member, Infos } from '../../../../../models/members'
import type { Member } from '@mymodels/members'

const route = useRoute()
const slug = route.params.slug as string
const { locale } = useI18n()
const { t } = useLanguage()
const { judgeMembers, getMostRecentRole } = useMembers(locale)

const member: ComputedRef<Member | null> = computed(() => judgeMembers.value.find(m => m?.slug === slug) ?? null)
const role: ComputedRef<Role | null> = computed(() => {
  if (member.value?.roles) {
    return getMostRecentRole(member.value.roles) ?? null
  }
  return null
})
const isGerman = computed(() => locale.value === Languages.GERMAN)

const getTitle = (key: string) => {
  const base = t(key).trim()
  const suffix = isGerman.value && member.value?.femaleTitle ? 'in' : ''
  const lang = member.value?.lang?.toUpperCase()
  return `${base}${suffix}${lang ? ` (${lang})` : ''}`
}

const roleTranslationKeys: Record<string, string> = {
  [OrganizationMemberRole.president]: 'general.message.presidents',
  [OrganizationMemberRole.judge]: 'general.message.judges',
  [OrganizationMemberRole.legalSecretaries]: 'general.message.legalSecretaries',
  [OrganizationMemberRole.registrars]: 'general.message.registrars',
}

const title = computed(() => {
  const roleKey = role.value
  const translationKey = roleKey ? roleTranslationKeys[roleKey.role] : null
  if (translationKey) {
    return getTitle(translationKey)
  }

  // fallback to alt field in member
  const altFallback = member.value?.alt?.[locale.value]
  if (altFallback) {
    return altFallback
  }

  // fallback to raw role if defined, else empty string
  return roleKey ? String(roleKey.role ?? '') : ''
})
</script>

<template>
  <div>
    <BannerMember
      :name="member?.name ?? ''"
      :jobtitle="title"
      :image="member?.picture ?? ''"
    />

    <v-container
      class="flex-column align-start flex-nowrap mt-5"
      fluid
    >
      <v-row
        class="d-flex-member"
        justify="center"
      >
        <div class="col-12 col-md-12">
          <div class="nuxt-content">
            <!-- <h3 v-if="infosLength"> -->
            <h3>
              {{ t('general.message.information') }}
            </h3>
            <ul>
              <li
                v-for="info in member?.infos?.[locale]"
                :key="info"
              >
                {{ info }}
              </li>
            </ul>
          </div>
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.container {
  padding: 0 !important;
  @include mobile {
    padding: 32px;
  }
}
.d-flex-member {
  max-width: 1260px !important;
  margin: 140px 160px 80px 60px;
  @include tablet-portrait {
    width: calc(100% - 32px);
    margin: 140px 20px 20px 20px;
  }
  @include mobile {
    margin: 140px 0 20px 20;
    width: 100%;
  }
}

::v-deep .nuxt-content {
  h3 {
    font-family: 'Tiempos';
    font-size: 2rem;
    font-weight: 600;
    padding-bottom: 24px;
    @include tablet-portrait {
      padding-top: 24px;
      padding-bottom: 16px;
      font-size: 1.5rem;
    }
  }
  li {
    list-style-type: disc;
    font-weight: 400;
    font-size: 1.25rem;
  }
}
</style>
