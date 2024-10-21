<template>
    <v-card class="decision-card" max-width="388" style="padding: 16px;"
        :aria-labelledby="`artNr${props.id} decisionTitle${props.id} description${props.id} stateTitle${props.id}`"
        @click="navigate(props.id)">
        <div class="top-infos">
            <time :datetime="`${props.zuludate}`">{{ props.date }}</time>
            <p :id="`artNr${props.id}`"
                :aria-label="t('general.message.add-judgment-number-label') + ' ' + props.reference.split('/')[0] + ' ' + props.reference.split('/')[1]">
                {{ t('general.message.add-judgment-number-label') }}
                {{ props.reference }}
            </p>
        </div>
        <h3 :id="`decisionTitle${props.id}`">
            {{ props.title }}
        </h3>
        <v-list-item-subtitle>
            <p v-html="props.description" />
        </v-list-item-subtitle>
        <p :id="`description${props.id}`" class="hidden">
            {{ props.description }}
        </p>
        <span v-html="props.state || t('error.noDataAvailable')" />
        <div class="arrow-hover">
            {{ t('general.message.read-more') }}
            <v-icon>mdi-arrow-right</v-icon>
        </div>
    </v-card>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
// import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    date: {
        type: String,
        required: true
    },
    zuludate: {
        type: String,
        required: false
    },
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        required: true
    }
});

const { t } = useI18n();
const router = useRouter();

const navigate = (id) => {
    router.push({ name: 'decision', params: { id } });
};
</script>

<style lang="scss">
// @import '~/assets/colors.scss';
// $rajahLight: yellow;
// $textOnRajah: black;
// $rajahYellow: yellow;

.decision-card {
    background-color: $rajahLight !important;
    color: $textOnRajah !important;
    padding: 20px;
    position: relative;
    overflow: hidden;
    background-position: 154%;
    box-shadow: none;
    transition: all 0.3s ease-in-out;
    border-radius: 0 !important;
    margin: 16px;
    width: 388px;
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08) !important;

    // @include mobile {
    //     width: calc(100% - 32px);
    //     margin: auto;
    //     margin-bottom: 20px;
    // }

    .top-infos {
        display: flex;
        justify-content: space-between;

        p {
            font-size: 1rem;
            line-height: 24px;
        }

        p:first-of-type {
            position: relative;

            &:before {
                content: '';
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                height: 2px;
                background-color: $textOnRajah;
            }
        }
    }

    h3 {
        font-size: 1.125rem;
        line-height: 20px;
        color: $textOnRajah;
        text-align: left;
        margin-bottom: 20px;
    }

    .v-list-item__subtitle {
        display: -webkit-box;
        text-align: left;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre-wrap;
        -webkit-line-clamp: 4;
        line-clamp: 4;
        margin-bottom: 16px;
        font-size: 0.875rem;
        line-height: 20px;
        font-weight: 400;
    }

    span {
        font-size: 0.875rem;
        line-height: 20px;
        color: $textOnRajah;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
        text-align: left;
        margin-bottom: 8px;
    }

    &:hover,
    &:focus {
        background-color: $rajahYellow !important;
        transition: all 0.3s ease-in-out;
        box-shadow: 8px 8px 24px -5px rgba(249, 171, 85, 0.4) !important;
        cursor: pointer;
    }

    .arrow-hover {
        display: flex;
        flex-direction: row;

        .v-icon {
            margin-left: 8px;
        }
    }

    .v-icon {
        color: $textOnRajah;
        display: flex;
        justify-content: flex-start;
        width: fit-content;
    }
}

.hidden {
    display: none;
}
</style>
