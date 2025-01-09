<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { BookingPaymentStatus } from '@/enums';

interface PaymentStatusOption {
  label: string;
  value: BookingPaymentStatus;
}

const paymentStatusModel = defineModel<BookingPaymentStatus>();

const { t } = useI18n();

const mapTranslationStatus = {
  [BookingPaymentStatus.PENDING]: t(
    'booking_info.fields.payment_status.pending'
  ),
  [BookingPaymentStatus.SUCCESS]: t('booking_info.fields.payment_status.paid'),
};

const localePaymentStatuses = computed(() => {
  return Object.values(BookingPaymentStatus)
    .filter((el) => el !== paymentStatusModel.value)
    .map((status) => ({
      label: mapTranslationStatus[status as BookingPaymentStatus],
      value: status,
    }));
});

const selectProps = computed(() => ({
  bgColor:
    paymentStatusModel.value === BookingPaymentStatus.PENDING
      ? 'orange'
      : 'grey',
}));

const updatePaymentStatusModel = (option: PaymentStatusOption) => {
  paymentStatusModel.value = option.value;
};
</script>

<template>
  <q-select
    :model-value="paymentStatusModel"
    :options="localePaymentStatuses"
    :display-value="
      paymentStatusModel ? mapTranslationStatus[paymentStatusModel] : undefined
    "
    :bg-color="selectProps.bgColor"
    standout
    dense
    rounded
    class="tw-text-xs"
    @update:modelValue="updatePaymentStatusModel"
  />
</template>
