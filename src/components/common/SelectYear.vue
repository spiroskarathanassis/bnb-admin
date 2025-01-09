<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import airbnbWorkingYears from '@/utils/airbnbWorkingYears';

const props = defineProps<{
  lastCountYear?: number;
  hasFormStyles?: boolean;
}>();

const yearModel = defineModel();

const { t } = useI18n();

const bookingYears = computed(() =>
  airbnbWorkingYears(props.lastCountYear ?? new Date().getFullYear())
);

const selectProps = computed(() => ({
  bgColor: !props.hasFormStyles ? 'white' : undefined,
  inlineStyles: props.hasFormStyles ? '' : 'min-width: 80px',
  outlined: !props.hasFormStyles,
}));
</script>

<template>
  <q-select
    v-model.number="yearModel"
    :options="bookingYears"
    :label="!hasFormStyles ? t('reuse.year') : undefined"
    :outlined="selectProps.outlined"
    options-dense
    dense
    :bg-color="selectProps.bgColor"
    :style="selectProps.inlineStyles"
  />
</template>
