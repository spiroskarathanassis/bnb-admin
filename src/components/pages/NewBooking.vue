<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import BookingForm from '@/components/layout/BookingForm.vue';
import { BookingApprovalState, BookingPaymentStatus, Platform } from '@/enums';
import { useBookingsStore } from '@/stores';
import { BookingFormType } from '@/types';
import applyBookingInfo from '@/utils/booking/applyBookingInfo';

const { t } = useI18n();
const bookingsStore = useBookingsStore();

const bookingForm = ref<BookingFormType>({
  approval_status: BookingApprovalState.CONFIRMED,
  checkin: '',
  checkinTime: '14:00',
  checkout: '',
  checkoutTime: '10:00',
  client_info: {
    email: '',
    mobile: '',
    name: '',
  },
  guests: {
    adults: 2,
    children: 0,
    infants: 0,
  },
  is_booking_closed: false,
  keybox: {
    first_code: '',
    second_code: '',
  },
  notes: '',
  payment_status: BookingPaymentStatus.PENDING,
  platform: Platform.PRIVATE,
  price: 0,
});

const requiredFieldsValid = computed(() => {
  return (
    bookingForm.value.checkin &&
    bookingForm.value.checkout &&
    // bookingForm.value.checkinTime &&
    // bookingForm.value.checkoutTime &&
    bookingForm.value.platform
  );
});

const updateForm = (data: BookingFormType) => {
  bookingForm.value = { ...bookingForm.value, ...data };
};

const saveNewBooking = async () => {
  const data = {
    ...bookingForm.value,
    id: Date.now(),
  };

  bookingsStore.addNewBooking(applyBookingInfo(data));
};
</script>

<template>
  <PageTitle class="tw-text-white">
    {{ t('routes.new_booking') }}
  </PageTitle>

  <PageSection>
    <BookingForm isNewBooking :fields="bookingForm" @update="updateForm">
      <q-btn
        :disabled="!requiredFieldsValid"
        no-caps
        color="black"
        dark
        @click.prevent="saveNewBooking"
      >
        {{ t('booking_info.actions.submit') }}
      </q-btn>
    </BookingForm>
  </PageSection>
</template>
