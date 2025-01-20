<template>
    <v-card class="member-card" :class="{ 'member-card-hoover': showDetails }" :width="width"
        :aria-labelledby="`memberName${nameId} memberJob${nameId} memberPeriod${nameId} died${nameId} moreInfo${nameId}`"
        :role="showDetails ? 'button' : 'presentation'" @click="click">
        <v-img v-if="withImage && image" :src="iSrc" alt="Member Image" />
        <v-img v-if="withImage && !image" src="https://via.placeholder.com/150" alt="Placeholder Image" />
        <div class="infos-container">
            <component :is="headline" :id="`memberName${nameId}`" class="header-name">
                {{ name }}
            </component>
            <div class="separator-container">
                <span class="separator" />
            </div>
            <p :id="`memberJob${nameId}`">
                {{ getJobTitle() }} ({{ lang.toUpperCase() }})
            </p>
            <p v-if="startDate" :id="`memberPeriod${nameId}`" aria-current="date"
                :aria-label="`Start: ${startDate}, End: ${endDate}`">
                {{ startDate }} - {{ endDate }}
            </p>
            <div v-if="showDetails" :id="`moreInfo${nameId}`" class="arrow-hover" aria-label="More details">
                <v-icon aria-hidden="true">
                    mdi-arrow-right
                </v-icon>
            </div>
            <p v-if="!isAlive" :id="`died${nameId}`" aria-label="Died">
                <svg aria-hidden="true" style="width: 24px; height: 24px" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M10.5,2H13.5V8H19V11H13.5V22H10.5V11H5V8H10.5V2Z" />
                </svg>
            </p>
        </div>
    </v-card>
</template>
  
<script setup>
import { ref, computed } from 'vue';
import { useLanguage, defaultListLang } from '@/composables/useLanguage'
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();

const router = useRouter();
const { t, locale } = useLanguage()

const props = defineProps({
    headlineLevel: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: false,
        default: '',
    },
    lang: {
        type: String,
        required: false,
        default: 'nl',
    },
    slug: {
        type: String,
        required: false,
        default: '',
    },
    image: {
        type: String,
        required: false,
        default: '',
    },
    withImage: {
        type: Boolean,
        default: true,
        required: false,
    },
    infos: {
        type: Array,
        default: null,
        required: false,
    },
    jobtitle: {
        type: String,
        required: false,
        default: '',
    },
    startDate: {
        type: String,
        required: false,
        default: '',
    },
    endDate: {
        type: String,
        required: false,
        default: '',
    },
    width: {
        type: String,
        default: '240',
        required: false,
    },
    isAlive: {
        type: Boolean,
        default: true,
        required: false,
    },
});

const iSrc = ref('');

const getImageUrl = () => {
    if (props.image) {
        iSrc.value = new URL(`../assets/img/members/${props.image}`, import.meta.url).href;
    } else {
        iSrc.value = 'https://via.placeholder.com/150';
    }
};
const getJobTitle = () => {
    switch (props.jobtitle.toLowerCase()) {
        case 'judge':
            return t('general.message.judges');
        case 'president':
            return t('general.message.presidents');
        default:
            return props.jobtitle;
    }
};



onMounted(getImageUrl)

const nameId = computed(() => {
    return (
        props.name.split(' ').join('') +
        props.jobtitle.split(' ').join('') +
        (props.startDate ? props.startDate.split(' ').join('') : '')
    );
});

const showDetails = computed(() => {
    return props.infos?.length > 0 && props.image;
});

const headline = computed(() => {
    return 'h' + props.headlineLevel;
});

const click = () => {
    const basePath = route.path.split('/').slice(0, -1).join('/');
    router.push(`${basePath}/members/${props.slug}`);
};

onMounted(() => {
    getImageUrl();
})
</script>
  
<style lang="scss">
.member-card {
    margin: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 0px;
    transition: all 0.3s ease-in-out;

    .infos-container {
        padding: 16px;
        text-align: center;

        .header-name {
            margin-bottom: 8px;
            font-size: 1.25rem;
            font-weight: bold;
        }

        p {
            margin: 4px 0;
        }

        .arrow-hover {
            margin-top: 16px;
        }
    }
}

.arrow-hover {
    color: white
}

.member-card-hoover {
    &:hover {
        cursor: pointer;
        background-color: #3f51b5 !important;
        transition: all 0.3s ease-in-out;
        box-shadow: 8px 8px 24px -5px rgba(0, 101, 202, 0.2) !important;
        color: white !important;

        .infos-container {
            color: white !important;
        }
    }
}

.separator-container {
    display: flex;
    justify-content: center;
}

.separator {
    width: 64px;
    height: 2px;
    background: $skyBlue;
    display: block;
    margin: 8px 0;
}
</style>