<script setup lang="ts">
import moment from 'moment';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useHppCalendarTranslations } from '@/composables/useCalendarTranslations';
import { platformStyles } from '@/constants/platformStyles';
import { useUserFeatures } from '@/stores';
import { BookingType, SpecialPrice, UnavailableDate } from '@/types';

import { CalendarEvent, CalendarEventType } from './CalendarView/calendarTypes';
import HppCalendar from './CalendarView/HppCalendar.vue';

const props = withDefaults(
  defineProps<{
    bookings: BookingType[];
    unavailableDates: UnavailableDate[];
    specialPrices: SpecialPrice[];
    defaultPrice?: number;
  }>(),
  {
    defaultPrice: 0,
  }
);

const { t, locale } = useI18n();
const featureStore = useUserFeatures();
const { propertySettings } = useHppCalendarTranslations();

const hasEditAccess = computed(() => featureStore.canManageBookings);
const events = computed<CalendarEvent[]>(() => {
  const bookingEvents: CalendarEvent[] = props.bookings.map((book) => {
    const checkIn = moment(book.checkin, 'YYYY-MM-DD').toDate();
    const checkOut = moment(book.checkout, 'YYYY-MM-DD').toDate();

    return {
      bookEvent: {
        platform: book.platform,
        platformStyleClasses: platformStyles[book.platform],
        totalGuests:
          book.guests.adults +
          (book.guests.children ?? 0) +
          (book.guests.infants ?? 0),
      },
      end: checkOut,
      eventType: CalendarEventType.BOOKING,
      price: book.price,
      start: checkIn,
    };
  });

  const unavailableDates: CalendarEvent[] = props.unavailableDates.map(
    (date) => {
      if (typeof date === 'string') {
        return {
          end: moment(date, 'YYYY-MM-DD').add(1, 'day').toDate(), // Add 1 day to simulate the end of the day like it was a booking
          eventType: CalendarEventType.UNAVAILABLE,
          start: moment(date, 'YYYY-MM-DD').toDate(),
          title: t('calendar.unavailable'),
        };
      }

      return {
        end: moment(date.to, 'YYYY-MM-DD').add(1, 'day').toDate(),
        eventType: CalendarEventType.UNAVAILABLE,
        start: moment(date.from, 'YYYY-MM-DD').toDate(),
        title: t('calendar.unavailable'),
      };
    }
  );

  return [...bookingEvents, ...unavailableDates];
});

const lastDate = computed(() => {
  const today = new Date();
  const day = today.getDay();
  const month = today.getMonth();
  const nextYear = today.getFullYear() + 1;

  const date = `${day}/${month}/${nextYear}`;

  return new Date(date);
});
</script>

<template>
  <HppCalendar
    :events="events"
    :lastDate="lastDate"
    :locale="locale"
    :specialPrices="specialPrices"
    :defaultPrice="defaultPrice"
    :hasEditAccess="hasEditAccess"
    :translations="{
      propertySettings,
    }"
  />
</template>
