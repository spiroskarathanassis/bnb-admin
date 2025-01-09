<script setup lang="ts">
import moment from 'moment';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  ClearFilterBtn,
  SelectMonth,
  SelectPlatform,
  SelectYear,
} from '@/components/common';
import BookingInfoCard from '@/components/layout/BookingInfoCard/BookingInfoCard.vue';
import BookingInfoCardList from '@/components/layout/BookingInfoCard/BookingInfoCardList.vue';
import ModalAddEditBooking from '@/components/layout/modals/ModalAddEditBooking.vue';
import { Platform } from '@/enums';
import { useBookingsStore } from '@/stores';
import { BookingType, DbTypeWithKey } from '@/types';
import { isBookingRunningNow, isNextBooking } from '@/utils/booking';

const { t } = useI18n();
const bookingsStore = useBookingsStore();

const editedBooking = ref<DbTypeWithKey<BookingType> | null>(null);
const selectedMonth = ref('');
const selectedYear = ref(new Date().getFullYear());
const selectPlatform = ref<Platform | ''>('');

const calendarBookings = computed<DbTypeWithKey<BookingType>[]>(
  () => bookingsStore.bookings
);
const filtersEnabled = computed(() => {
  return !!(selectedMonth.value || selectPlatform.value);
});

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
  const searchYear = selectedYear.value;
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

      // no adjustments
      if (!searchMonth && !searchYear && !searchPlatform) {
        return [...existedBookings, displayedBooking];
      }

      // is selected
      const isMonthMatch =
        moment(displayedBooking.checkin).format('MMMM') === searchMonth;
      const isYearMatch = displayedBooking.year === searchYear;
      const isPlatformMatch = displayedBooking.platform === searchPlatform;

      let isCurrBookPassed = true;

      if (searchMonth && !isMonthMatch) {
        isCurrBookPassed = false;
      }
      if (searchYear && !isYearMatch) {
        isCurrBookPassed = false;
      }
      if (searchPlatform && !isPlatformMatch) {
        isCurrBookPassed = false;
      }

      if (isCurrBookPassed) {
        return [...existedBookings, displayedBooking];
      }

      if (searchMonth && searchPlatform) {
        if (isMonthMatch && isPlatformMatch) {
          return [...existedBookings, displayedBooking];
        }
      } else if (isMonthMatch || isPlatformMatch) {
        return [...existedBookings, currBook];
      }

      return existedBookings;
    },
    [] as DbTypeWithKey<BookingType>[]
  );

  return sortedBookings(filteredBookings);
});

watch(selectedYear, (nextVal, prevVal) => {
  if (prevVal !== nextVal) getFilteredBookings();
});

const clearFilters = () => {
  selectedMonth.value = '';
  selectedYear.value = new Date().getFullYear();
  selectPlatform.value = '';
};

const editBooking = (book: DbTypeWithKey<BookingType>) => {
  delete book.current;
  editedBooking.value = book;
};

const scrollToRecent = () => {
  // find recent book
  const nextBooking = adjustedBookings.value.find((bk) => isNextBooking(bk));
  if (!nextBooking) return;

  const el = document.getElementById(nextBooking.key);
  el?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest',
  });
};

const getFilteredBookings = async () => {
  const filters = {
    equalTo: selectedYear.value,
    orderBy: '"year"',
  };

  await bookingsStore.requestBookings({
    ...filters,
  });
};

onMounted(async () => {
  await getFilteredBookings();
  scrollToRecent();
});
</script>

<template>
  <PageTitle> {{ t('admin_page.admin') }} </PageTitle>

  <PageSection class="tw-gap-8 tw-overflow-hidden">
    <div
      class="tw-flex tw-justify-between tw-items-center tw-flex-wrap tw-gap-4"
    >
      <h2 class="tw-text-lg tw-font-bold tw-text-primary tw-py-2">
        {{ t('admin_page.booking_history') }}
        <span
          class="tw-bg-primary tw-text-grannyWhite tw-px-2 tw-py-1 tw-rounded tw-text-xs"
        >
          {{ adjustedBookings.length > 0 ? adjustedBookings.length : 0 }}
        </span>
      </h2>
      <div class="tw-flex tw-flex-wrap tw-gap-1">
        <SelectPlatform v-model="selectPlatform" />
        <SelectMonth v-model="selectedMonth" />
        <SelectYear
          v-model="selectedYear"
          :lastCountYear="new Date().getFullYear() + 1"
        />
        <ClearFilterBtn :isDisabled="!filtersEnabled" @clear="clearFilters" />
      </div>
    </div>

    <div
      class="tw-w-full tw-row-start-2 tw-col-start-2 tw-flex tw-justify-start"
    >
      <BookingInfoCardList>
        <template v-if="adjustedBookings.length > 0">
          <BookingInfoCard
            v-for="book in adjustedBookings"
            :id="book.key"
            :key="book.key"
            :book="book"
            isAdminPage
            @edit="(bk) => editBooking(bk)"
          />
        </template>
        <div v-else class="tw-text-center tw-p-4">
          {{ t('reuse.messages.noBookings') }}
        </div>
      </BookingInfoCardList>
    </div>
  </PageSection>

  <ModalAddEditBooking
    v-if="editedBooking"
    :book="editedBooking"
    @closeModal="editedBooking = null"
  />
</template>
