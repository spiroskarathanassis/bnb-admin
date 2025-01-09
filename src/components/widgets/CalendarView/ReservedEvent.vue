<script setup lang="ts">
import moment from 'moment';
import { computed } from 'vue';

import CalendarPeopleSvg from '@/components/icons/CalendarPeopleSvg.vue';
import isSameDate from '@/utils/isSameDate';

import { Cell, RequiredCalendarBookEvent } from './calendarTypes';

const props = defineProps<{
  event: RequiredCalendarBookEvent;
  cell: Cell;
}>();

const calcHourPercentage = (hours: number) => {
  const HOUR_MULTIPLIER = 100 / 24;
  const res = Math.ceil(hours * HOUR_MULTIPLIER);

  return Math.abs(res);
};

// event with checkin position later
const isCheckInEvent = computed(() =>
  isSameDate(
    moment(props.event.start).toDate(),
    moment(props.cell.formattedDate, 'YYYY-MM-DD').toDate()
  )
);
const isCheckOutEvent = computed(() =>
  isSameDate(
    moment(props.event.end).toDate(),
    moment(props.cell.formattedDate, 'YYYY-MM-DD').toDate()
  )
);

const eventPosition = computed(() => {
  const START_HOUR = 6; // 6:00 am

  let left = 0; // percentage
  let width = 0; // percentage

  let hasBorderRadiusLeft = false; // percentage
  let hasBorderRadiusRight = false; // percentage

  const checkIn = moment(props.event.start);
  const checkOut = moment(props.event.end);

  const eventEnd = moment(props.cell.endDate);

  if (isCheckOutEvent.value) {
    const totalHours = checkOut.diff(eventEnd, 'hours');
    width = calcHourPercentage(totalHours + START_HOUR) - 4;
    hasBorderRadiusRight = true;
  } else if (isCheckInEvent.value) {
    const totalHours = checkIn.diff(props.cell.formattedDate, 'hours');
    left = calcHourPercentage(totalHours - START_HOUR);
    width = 100 - left;
    hasBorderRadiusLeft = true;
  } else {
    width = 100;
  }

  return { hasBorderRadiusLeft, hasBorderRadiusRight, left, width };
});
</script>

<template>
  <div
    :class="[
      'tw-flex tw-items-center tw-gap-1 tw-py-px tw-px-2 tw-shadow-md',
      event.bookEvent.platformStyleClasses,
      {
        'tw-rounded-l-full': eventPosition.hasBorderRadiusLeft,
        'tw-rounded-r-full': eventPosition.hasBorderRadiusRight,
      },
    ]"
    :style="`left: ${eventPosition.left}%; width: ${eventPosition.width}%;`"
  >
    <div
      :style="!isCheckInEvent && 'visibility: hidden;'"
      class="tw-flex tw-items-center tw-gap-1 tw-scale-75 sm:tw-scale-100"
    >
      <CalendarPeopleSvg fill="currentColor" class="tw-size-5" />
      <span class="tw-font-bold">
        {{ event.bookEvent.totalGuests }}
      </span>
    </div>
  </div>
</template>
