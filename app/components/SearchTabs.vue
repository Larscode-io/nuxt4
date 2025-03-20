<template>
    <v-tabs v-model="activeTabModel" color="primary" direction="vertical" class="vertical-tabs" background-color="white"
        grow>
        <v-tab v-for="tab in tabs" :key="tab.id" :to="tab.to" :text="tab.label" :value="tab.id" class="tab" ripple />
    </v-tabs>
</template>
  
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RoutePathKeys } from "../core/constants";

const props = defineProps({
    activeTab: {
        type: String,
        default: ''
    }
});

const { t } = useLanguage();
const localePath = useLocalePath();

const searchTabs = [
    { id: "general.message.judgment", to: RoutePathKeys.searchJudgment },
    { id: "general.message.standard", to: RoutePathKeys.searchStandard },
    { id: "general.message.systematic-table-contents-label", to: RoutePathKeys.searchTableOfContent },
    { id: "general.message.judgment-keywords-summary", to: RoutePathKeys.searchJudgmentKeywordSummary },
    { id: "general.message.full-text-of-judgments", to: RoutePathKeys.searchFullTextJudgment },
    { id: "general.message.keywords-judgments-pending-cases", to: RoutePathKeys.searchJudgmentsAndPendingCases },
];

const tabs = computed(() =>
    searchTabs.map((tab) => ({
        id: tab.id,
        to: localePath(tab.to),
        label: t(tab.id, 2),
    }))
);

const activeTabModel = ref(props.activeTab || searchTabs[0].id);

watch(() => props.activeTab, (newValue) => {
    if (newValue) {
        activeTabModel.value = newValue;
    }
});
</script>
  
<style scoped lang="scss">
.vertical-tabs {

    :deep(.v-tab--selected) {
        color: var(--v-primary-base);
        font-weight: 500;
    }
}

.tab {
    text-align: left;
    justify-content: flex-start;
    min-height: 48px;
    padding: 0 16px;
    border-left: 2px solid transparent;

    &:hover {
        background-color: rgba(0, 0, 0, 0.03);
    }

    :deep(&.v-tab--selected) {
        border-left: 2px solid var(--v-primary-base);
    }
}
</style>