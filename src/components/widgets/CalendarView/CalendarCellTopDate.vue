<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { Cell } from './calendarTypes';

defineProps<{
  cell: Cell;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="tw-flex tw-justify-between tw-items-center tw-gap-1 sm:tw-gap-2">
    <span
      class="tw-text-[9px] sm:tw-text-base tw-leading-4 tw-font-normal tw-text-black"
    >
      {{ cell.content }}
    </span>
    <div
      v-if="cell.today"
      class="tw-border tw-rounded-full tw-px-0.5 tw-py-0 sm:tw-px-2 sm:tw-py-px tw-text-[8px] sm:tw-text-xs tw-align-middle"
    >
      {{ t('calendar.today') }}
    </div>
  </div>
</template>
