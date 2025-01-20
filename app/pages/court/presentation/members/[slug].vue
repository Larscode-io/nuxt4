<template>
    <v-container class="flex-column align-start flex-nowrap" fluid>
        <!-- <BannerMember :name="name" :jobtitle="title" :image="picture" />
        <v-row v-if="pending" class="d-flex" align="flex-start" justify="center">
            <div class="col-12 col-md-12">
                <v-skeleton-loader class="mx-auto" max-width="300" type="article" />
            </div>
        </v-row>
        <v-row v-else-if="error" class="d-flex" align="flex-start" justify="center">
            <div class="col-12 col-md-12">
                <ErrorCard :message="t('error.fetchingData')" :show-go-home="false" />
            </div>
        </v-row> -->
        <v-row class="d-flex-member" align="flex-start" justify="center">
            <div class="col-12 col-md-12">
                <div class="nuxt-content">
                    <h3 v-if="infosLength">
                        {{ t('general.message.information', infosLength) }}
                    </h3>
                    <ul>
                        <li v-for="info in infos" :key="info">
                            {{ info }}
                        </li>
                    </ul>
                </div>
            </div>
        </v-row>
    </v-container>
</template>
  
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLanguage, defaultListLang } from '@/composables/useLanguage'
//   import ErrorCard from '~/components/ErrorCard.vue';
//   import BannerMember from '~/components/BannerMember.vue';
import { ContentKeys, Languages, RoutePathKeys, OrganizationMemberRole } from '~/core/constants';


const route = useRoute();
const router = useRouter();
const { t, tc, locale } = useLanguage();


const member = ref(null);
const pending = ref(true);
const error = ref(false);

const fetchMemberData = async () => {
    try {
        const slug = route.params.slug;

        const members = await queryContent(ContentKeys.presentationOrganizationCurrentMembership).findOne();
        const membersEmeritus = await queryContent(ContentKeys.presentationOrganizationCurrentMembershipEmeritus).findOne();
        const membersHistoric = await queryContent(ContentKeys.presentationOrganizationCurrentMembershipHistoric).findOne();

        let foundMember = members.data.find((m) => m.slug === slug) ||
            membersEmeritus.data.find((m) => m.slug === slug) ||
            membersHistoric.data.find((m) => m.slug === slug);

        if (!foundMember) {
            error.value = true;
            router.push({ name: 'error', params: { statusCode: 404 } });
        } else {
            member.value = foundMember;
        }
    } catch (err) {
        error.value = true;
    } finally {
        pending.value = false;
    }
};

onMounted(fetchMemberData);

const picture = computed(() => member.value?.picture);
const infos = computed(() => member.value?.infos?.[locale.value]);
const infosLength = computed(() => infos.value?.length);
const name = computed(() => member.value?.name);
const title = computed(() => {
    return 'tst'
    // switch (member.value?.role) {
    //     case OrganizationMemberRole.president:
    //         return `${tc($i18nKeys.general.message.presidents).trim()}${isGerman.value && member.value.femaleTitle ? 'in' : ''} (${member.value?.lang?.toUpperCase()})`;
    //     case OrganizationMemberRole.judge:
    //         return `${tc($i18nKeys.general.message.judges).trim()}${isGerman.value && member.value.femaleTitle ? 'in' : ''} (${member.value?.lang?.toUpperCase()})`;
    //     case OrganizationMemberRole.legalSecretaries:
    //         return `${tc($i18nKeys.general.message.legalSecretaries).trim()}${isGerman.value && member.value.femaleTitle ? 'in' : ''} (${member.value?.lang?.toUpperCase()})`;
    //     case OrganizationMemberRole.registrars:
    //         return `${tc($i18nKeys.general.message.registrars).trim()}${isGerman.value && member.value.femaleTitle ? 'in' : ''} (${member.value?.lang?.toUpperCase()})`;
    //     default:
    //         return member.value?.role;
});
const isGerman = computed(() => locale.value === Languages.GERMAN);
</script>