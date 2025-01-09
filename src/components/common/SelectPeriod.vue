<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import useFilterOptions from '@/composables/useFilterOptions.ts';
import { FilterPeriodOption } from '@/types';

const periodModel = defineModel();
const props = defineProps<{
  hasFormStyles?: boolean;
}>();

const { t } = useI18n();
const { localePeriods } = useFilterOptions();

const selectProps = computed(() => ({
  bgColor: !props.hasFormStyles ? 'white' : undefined,
  inlineStyles: props.hasFormStyles ? '' : 'min-width: 120px',
  outlined: !props.hasFormStyles,
}));

const updatePeriodModel = (option: FilterPeriodOption) => {
  periodModel.value = option.value;
};
</script>

<template>
  <q-select
    :model-value="periodModel"
    :options="localePeriods"
    :display-value="periodModel ? t(`reuse.periods.${periodModel}`) : undefined"
    :label="!hasFormStyles ? t('reuse.period') : undefined"
    :outlined="selectProps.outlined"
    options-dense
    dense
    :bg-color="selectProps.bgColor"
    :style="selectProps.inlineStyles"
    @update:modelValue="updatePeriodModel"
  />
</template>
