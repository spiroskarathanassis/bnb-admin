<script setup lang="ts">
import moment from 'moment';
import { useQuasar } from 'quasar';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  ClearFilterBtn,
  SelectMonth,
  SelectPlatform,
} from '@/components/common';
import CalendarSvg from '@/components/icons/CalendarSvg.vue';
import KanbanSvg from '@/components/icons/KanbanSvg.vue';
import BookingInfoCard from '@/components/layout/BookingInfoCard/BookingInfoCard.vue';
import BookingInfoCardList from '@/components/layout/BookingInfoCard/BookingInfoCardList.vue';
import CalendarView from '@/components/widgets/CalendarView.vue';
import { Platform } from '@/enums';
import { useBookingsStore, useConfigStore } from '@/stores';
import { DbTypeWithKey } from '@/types';
import { BookingType } from '@/types/bookingType.js';
import { isBookingRunningNow, isNextBooking } from '@/utils/booking';

enum BookingViewTabs {
  KANBAN = 'KANBAN',
  CALENDAR = 'CALENDAR',
}

const { t } = useI18n();
const $q = useQuasar();
const configStore = useConfigStore();
const bookingsStore = useBookingsStore();

const calendarView = ref(BookingViewTabs.KANBAN);
const selectedMonth = ref('');
const selectPlatform = ref<Platform | ''>('');
const calendarBookings = computed<DbTypeWithKey<BookingType>[]>(
  () => bookingsStore.bookings
);
const filtersEnabled = computed(() => {
  return selectedMonth.value || selectPlatform.value;
});

const areSettingsOpenOnTheRight = computed(() => !$q.screen.lt.md);

const sortedBookings = (editedBookings: DbTypeWithKey<BookingType>[]) =>
  editedBookings.sort((prevbk, nextbk) => {
    // Check-in dates
    const prevCheckin = moment(prevbk.checkin, 'YYYY-MM-DD');
    const nextCheckin = moment(nextbk.checkin, 'YYYY-MM-DD');

    // year
    if (prevCheckin.year() !== nextCheckin.year()) {
      return prevCheckin.year() - nextCheckin.year();
    }

    // months
    if (prevCheckin.month() !== nextCheckin.month()) {
      return prevCheckin.month() - nextCheckin.month();
    }

    // days
    return prevCheckin.date() - nextCheckin.date();
  });

const adjustedBookings = computed(() => {
  const searchMonth = selectedMonth.value;
  const searchPlatform = selectPlatform.value;

  const filteredBookings = calendarBookings.value.reduce(
    (existedBookings, currBook) => {
      const displayedBooking = {
        ...currBook,
      };

      // point the current booking
      const isCurrentBooking = isBookingRunningNow(
        displayedBooking.checkin,
        displayedBooking.checkout
      );
      if (isCurrentBooking) {
        displayedBooking.current = true;
      }

      if (!isCurrentBooking && !isNextBooking(displayedBooking)) {
        return existedBookings;
      }

      // no adjustments
      if (!searchMonth && !searchPlatform) {
        return [...existedBookings, displayedBooking];
      }

      // is selected
      const isMonthMatch =
        moment(displayedBooking.checkin).format('MMMM') === searchMonth;
      const isPlatformMatch = displayedBooking.platform === searchPlatform;

      if (searchMonth && searchPlatform) {
        if (isMonthMatch && isPlatformMatch) {
          return [...existedBookings, displayedBooking];
        }
      } else if (isMonthMatch || isPlatformMatch) {
        return [...existedBookings, displayedBooking];
      }

      return existedBookings;
    },
    [] as DbTypeWithKey<BookingType>[]
  );

  return sortedBookings(filteredBookings);
});

const clearFilters = () => {
  selectedMonth.value = '';
  selectPlatform.value = '';
};

onMounted(async () => {
  await bookingsStore.requestBookings({
    orderBy: '"year"',
    startAt: new Date().getFullYear(),
  });
});
</script>

<template>
  <PageTitle>
    {{ t('calendar.calendar') }}
  </PageTitle>

  <div
    :class="[
      'tw-w-full tw-grid tw-row-auto tw-gap-4',
      {
        'tw-grid-cols-[1fr,minmax(328px,800px),1fr]': areSettingsOpenOnTheRight, //360 - padding 16px(=1rem) * 2
      },
    ]"
  >
    <PageSection
      :class="[
        { 'tw-row-start-1 tw-col-start-2 tw-m-0': areSettingsOpenOnTheRight },
        'tw-gap-8',
      ]"
    >
      <div
        class="tw-flex tw-justify-between tw-items-center tw-flex-wrap tw-gap-4"
      >
        <h2 class="tw-text-lg tw-font-bold tw-text-primary tw-py-2">
          {{ t('calendar.next_bookings') }}
          <span
            class="tw-bg-primary tw-text-grannyWhite tw-px-2 tw-py-1 tw-rounded tw-text-xs"
          >
            {{ adjustedBookings.length }}
          </span>
        </h2>
        <div class="tw-flex tw-flex-wrap tw-gap-1">
          <SelectPlatform v-model="selectPlatform" />
          <SelectMonth
            v-model="selectedMonth"
            :disable="calendarView === BookingViewTabs.CALENDAR"
          />
          <ClearFilterBtn :isDisabled="!filtersEnabled" @clear="clearFilters" />
        </div>
      </div>

      <q-btn-group outline spread class="tw-w-full">
        <q-btn
          :outline="calendarView !== BookingViewTabs.KANBAN"
          no-caps
          padding="sm"
          color="primary"
          @click="calendarView = BookingViewTabs.KANBAN"
        >
          <KanbanSvg
            :color="
              calendarView === BookingViewTabs.KANBAN ? 'white' : 'currentColor'
            "
          />
          {{ t('reuse.kanban') }}
        </q-btn>
        <q-btn
          :outline="calendarView !== BookingViewTabs.CALENDAR"
          no-caps
          padding="sm"
          color="primary"
          @click="calendarView = BookingViewTabs.CALENDAR"
        >
          <CalendarSvg
            :color="
              calendarView === BookingViewTabs.CALENDAR
                ? 'white'
                : 'currentColor'
            "
          />
          {{ t('reuse.calendar') }}
        </q-btn>
      </q-btn-group>
    </PageSection>

    <PageSection
      :class="{
        'tw-row-start-2 tw-col-start-2 tw-h-fit': areSettingsOpenOnTheRight,
      }"
    >
      <BookingInfoCardList v-show="calendarView === BookingViewTabs.KANBAN">
        <template v-if="adjustedBookings.length > 0">
          <BookingInfoCard
            v-for="book in adjustedBookings"
            :key="book.key"
            :book="book"
          />
        </template>
        <div v-else class="tw-text-center tw-p-4">
          {{ t('reuse.messages.noBookings') }}
        </div>
      </BookingInfoCardList>

      <div v-show="calendarView === BookingViewTabs.CALENDAR">
        <CalendarView
          :bookings="adjustedBookings"
          :unavailableDates="configStore.unavailable_dates"
          :specialPrices="configStore.calendar_date_prices"
          :defaultPrice="configStore.price_per_night"
        />
      </div>
    </PageSection>

    <div
      v-if="areSettingsOpenOnTheRight"
      id="calendarSettings"
      class="tw-w-full tw-row-start-2 tw-col-start-3 tw-px-4"
    ></div>
  </div>
</template>
