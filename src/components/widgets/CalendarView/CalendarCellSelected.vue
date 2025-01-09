<script setup lang="ts">
import moment from 'moment';
import { computed, ref } from 'vue';

import { Cell } from './calendarTypes';

interface SelectedCells {
  firstCell: Cell['formattedDate'];
  lastCell: Cell['formattedDate'];
}

const props = defineProps<{
  cellDate: string;
  selectedCells: SelectedCells;
}>();
const emit = defineEmits(['select']);

const cell = ref<HTMLElement | null>(null);

const isCellSelected = computed(() => {
  const isCellBetween = moment(props.cellDate, 'YYYY-MM-DD').isBetween(
    moment(props.selectedCells.firstCell, 'YYYY-MM-DD'),
    moment(props.selectedCells.lastCell, 'YYYY-MM-DD'),
    'days',
    '[]'
  );

  return isCellBetween;
});

const hasLeftBorder = computed(() => {
  return props.selectedCells.firstCell === props.cellDate;
});
const hasRightBorder = computed(() => {
  return props.selectedCells.lastCell === props.cellDate;
});
</script>

<template>
  <div class="tw-absolute tw-z-20 tw-w-full tw-h-full">
    <div
      ref="cell"
      class="tw-w-full tw-h-full tw-cursor-pointer"
      :class="[
        {
          'tw-border-secondary tw-border-y-2 tw-border-solid': isCellSelected,
          'tw-border-l-2 tw-rounded-l-md': hasLeftBorder,
          'tw-border-r-2 tw-rounded-r-md': hasRightBorder,
        },
      ]"
      @click.prevent="() => emit('select', props.cellDate)"
    >
      <div
        v-show="hasLeftBorder"
        class="tw-absolute tw-top-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2 tw-flex tw-items-center tw-justify-center tw-bg-secondary tw-rounded-full tw-size-4 sm:tw-size-6"
      >
        <q-icon
          name="drag_indicator"
          color="white"
          size="xs"
          class="tw-scale-75 sm:tw-scale-100"
        />
      </div>

      <div
        v-show="hasRightBorder"
        class="tw-absolute tw-top-1/2 tw-left-full -tw-translate-x-1/2 -tw-translate-y-1/2 tw-flex tw-items-center tw-justify-center tw-bg-secondary tw-rounded-full tw-size-4 sm:tw-size-6"
      >
        <q-icon
          name="drag_indicator"
          color="white"
          size="xs"
          class="tw-scale-75 sm:tw-scale-100"
        />
      </div>
    </div>
  </div>
</template>
