<template>
  <div>
    <BannerMember
      :name="name"
      :jobtitle="title"
      :image="picture"
    />

    <v-container
      class="flex-column align-start flex-nowrap mt-5"
      fluid
    >
      <v-row
        class="d-flex-member"
        align="start"
        justify="center"
      >
        <div class="col-12 col-md-12">
          <div class="nuxt-content">
            <h3 v-if="infosLength">
              {{ t('general.message.information', infosLength) }}
            </h3>
            <ul>
              <li
                v-for="info in infos"
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
//   import ErrorCard from '~/components/ErrorCard.vue';
//   import BannerMember from '~/components/BannerMember.vue';
import { ContentKeys, Languages, OrganizationMemberRole } from '~/core/constants'

const route = useRoute()
const router = useRouter()
const { t, locale } = useLanguage()

const member = ref(null)
const pending = ref(true)
const error = ref(false)

const fetchMemberData = async () => {
  try {
    const slug = route.params.slug

    const members = await queryContent(ContentKeys.presentationOrganizationCurrentMembership).findOne()
    const membersEmeritus = await queryContent(ContentKeys.presentationOrganizationCurrentMembershipEmeritus).findOne()
    const membersHistoric = await queryContent(ContentKeys.presentationOrganizationCurrentMembershipHistoric).findOne()

    const foundMember = members.data.find(m => m.slug === slug)
      || membersEmeritus.data.find(m => m.slug === slug)
      || membersHistoric.data.find(m => m.slug === slug)

    if (!foundMember) {
      error.value = true
      router.push({ name: 'error', params: { statusCode: 404 } })
    }
    else {
      member.value = foundMember
    }

    console.log({ member })
  }
  catch (err) {
    error.value = true
  }
  finally {
    pending.value = false
  }
}

onMounted(fetchMemberData)

const picture = computed(() => member.value?.picture)
const infos = computed(() => member.value?.infos?.[locale.value])
const infosLength = computed(() => infos.value?.length)
const name = computed(() => member.value?.name)
const isGerman = computed(() => locale.value === Languages.GERMAN);

const getTitle = (key: string) => {
  const title = t(key).trim();
  const suffix = isGerman.value && member.value?.femaleTitle ? 'in' : '';
  const lang = member.value?.lang?.toUpperCase();
  return `${title}${suffix} (${lang})`;
};

const title = computed(() => {
  switch (member.value?.role ?? '') {
    case OrganizationMemberRole.president:
      return getTitle('general.message.presidents');
    case OrganizationMemberRole.judge:
      return getTitle('general.message.judges');
    case OrganizationMemberRole.legalSecretaries:
      return getTitle('general.message.legalSecretaries');
    case OrganizationMemberRole.registrars:
      return getTitle('general.message.registrars');
    default:
      return member.value?.role ?? '';
  }
});
</script>

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
