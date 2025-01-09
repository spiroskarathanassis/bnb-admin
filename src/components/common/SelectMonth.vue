<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import useFilterOptions from '@/composables/useFilterOptions.ts';
import { FilterMonthOption } from '@/types';

const monthModel = defineModel();
const props = defineProps<{
  hasFormStyles?: boolean;
}>();

const { t } = useI18n();
const { localeMonths } = useFilterOptions();

const selectProps = computed(() => ({
  bgColor: !props.hasFormStyles ? 'white' : undefined,
  inlineStyles: props.hasFormStyles ? '' : 'min-width: 120px',
  outlined: !props.hasFormStyles,
}));

const updateMonthModel = (option: FilterMonthOption) => {
  monthModel.value = option.value;
};
</script>

<template>
  <q-select
    :model-value="monthModel"
    :options="localeMonths"
    :display-value="monthModel ? t(`reuse.months.${monthModel}`) : undefined"
    :label="!hasFormStyles ? t('reuse.month') : undefined"
    :outlined="selectProps.outlined"
    options-dense
    dense
    :bg-color="selectProps.bgColor"
    :style="selectProps.inlineStyles"
    @update:modelValue="updateMonthModel"
  />
</template>
