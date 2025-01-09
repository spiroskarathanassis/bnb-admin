<script setup lang="ts">
import moment from 'moment';
import { computed } from 'vue';

import { YYYY_MM_DD } from '@/types';

import CalendarCellTopDate from './CalendarCellTopDate.vue';
import {
  CalendarEvent,
  CalendarEventType,
  Cell,
  RequiredCalendarBookEvent,
} from './calendarTypes';
import ReservedEvent from './ReservedEvent.vue';

const props = defineProps<{
  events: CalendarEvent[];
  cell: Cell;
  defaultPrice?: number;
}>();

const isDateBeforeToday = (date: YYYY_MM_DD) => {
  return moment(date).isBefore(moment(), 'day');
};

const toDateString = (date: Date) => {
  return moment(date).format('YYYY-MM-DD');
};

const isCellUnavailable = computed(() => {
  return (
    !props.cell.outOfScope &&
    props.events.some(
      (ev) =>
        ev.eventType === CalendarEventType.UNAVAILABLE &&
        toDateString(ev.end) !== props.cell.formattedDate
    )
  );
});

const isEventUnavailable = (ev: CalendarEvent) => {
  return (
    !props.cell.outOfScope &&
    ev.eventType === CalendarEventType.UNAVAILABLE &&
    toDateString(ev.end) !== props.cell.formattedDate
  );
};
</script>

<template>
  <div class="tw-relative tw-w-full tw-h-full tw-overflow-hidden">
    <div
      :class="[
        'tw-w-full tw-h-full',
        'tw-border-l tw-border-t tw-border-gray-200',
        !isCellUnavailable
          ? !cell.outOfScope && isDateBeforeToday(cell.formattedDate)
            ? 'tw-bg-slate-50'
            : 'tw-bg-white'
          : '',
      ]"
      :style="
        isCellUnavailable &&
        `background: repeating-linear-gradient(
          45deg,
          #fff,
          #fff 10px,
          #f1f5f9 10px,
          #f1f5f9 20px
        );`
      "
    >
      <div
        v-show="!cell.outOfScope"
        :class="['tw-w-full tw-h-full tw-flex tw-flex-col']"
      >
        <CalendarCellTopDate
          :cell="cell"
          class="tw-px-1 sm:tw-px-2 sm:tw-py-1"
        />

        <div class="tw-flex-1">
          <template v-for="event in events" :key="event.start">
            <ReservedEvent
              v-if="event.bookEvent"
              :event="event as RequiredCalendarBookEvent"
              :cell="cell"
              class="tw-absolute tw-h-4 sm:tw-h-5"
              @click="() => {}"
            />

            <!-- Unavailable message -->
            <div
              v-if="isEventUnavailable(event) && event.title"
              class="tw-h-full tw-hidden sm:tw-flex tw-flex-col tw-justify-end tw-items-center"
            >
              <span
                class="tw-bg-white tw-rounded-lg tw-px-1.5 tw-py-0 tw-truncate tw-text-sm"
              >
                {{ event.title }}
              </span>
            </div>
          </template>
        </div>

        <!-- Price -->
        <div class="tw-w-full sm:tw-h-8 sm:tw-max-h-8">
          <div
            v-if="
              !events.length ||
              toDateString(events[0].end) === cell.formattedDate
            "
            class="tw-flex tw-px-1 sm:tw-px-2 sm:tw-py-1 tw-text-gray-400 tw-font-semibold"
          >
            <span
              v-if="events?.[0]?.price"
              class="tw-text-orange-400 tw-text-xs sm:tw-text-base"
            >
              €{{ events?.[0]?.price.toFixed(0) }}
            </span>
            <span v-else class="tw-text-xs sm:tw-text-base"
              >€{{ defaultPrice ?? 0 }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
