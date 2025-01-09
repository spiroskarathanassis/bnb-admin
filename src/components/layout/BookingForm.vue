<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  FormField,
  SelectPaymentStatus,
  SelectPickerDate,
} from '@/components/common';
import { platformStyles } from '@/constants/platformStyles';
import { BookingApprovalState, BookingPaymentStatus, Platform } from '@/enums';
import { BookingFormType } from '@/types';
import { timeSlots } from '@/utils/timeSlots';

const emit = defineEmits(['update']);
const props = defineProps({
  fields: {
    required: true,
    type: Object,
  },
  isNewBooking: {
    default: false,
    type: Boolean,
  },
});

const { t } = useI18n();

const areOptionalFieldsOpened = ref(true);
const form: BookingFormType = reactive({
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
const formError = reactive({
  adults: false,
  dates: false,
});

const timeFormError = (field: keyof typeof formError) => {
  formError[field] = true;

  const timer = setTimeout(() => {
    formError[field] = false;
    clearTimeout(timer);
  }, 5000);
};
const areRequiredFieldsValid = () => {
  // if (!(form.checkin && form.checkout)) {
  //   timeFormError('dates');
  //   return false;
  // }

  if (form.guests.adults < 1) {
    timeFormError('adults');
    return false;
  }
  return true;
};

const updateForm = () => {
  if (!areRequiredFieldsValid()) return;
  emit('update', form);
};

watch(form, () => {
  updateForm();
});

watch(
  () => form.platform,
  (newPlatform: Platform) => {
    if (!props.isNewBooking) return;

    if ([Platform.WEBSITE, Platform.PRIVATE].includes(newPlatform)) {
      form.payment_status = BookingPaymentStatus.PENDING;
    }
    if ([Platform.BOOKING, Platform.AIRBNB].includes(newPlatform)) {
      form.payment_status = BookingPaymentStatus.SUCCESS;
    }
  }
);

onMounted(() => {
  form.approval_status = props.fields.approval_status;
  form.checkin = props.fields.checkin;
  form.checkout = props.fields.checkout;
  form.client_info = { ...form.client_info, ...props.fields.client_info };
  form.guests = { ...form.guests, ...props.fields.guests };
  form.is_booking_closed = props.fields.is_booking_closed;
  form.keybox = {
    first_code: props.fields.keybox?.first_code ?? '',
    second_code: props.fields.keybox?.second_code ?? '',
  };
  form.notes = props.fields.notes;
  form.payment_status = props.fields.payment_status;
  form.platform = props.fields.platform;
  form.price = props.fields.price ?? 0;
});
</script>

<template>
  <form
    :class="[
      'tw-flex tw-flex-col tw-gap-4',
      !isNewBooking ? 'tw-text-black' : 'tw-text-grannyWhite',
    ]"
  >
    <!-- Dates -->
    <FormField
      :label="t('booking_info.fields.dates')"
      :errorField="formError.dates"
      :errorMessage="t('booking_info.fields.dates_error')"
      :dark="isNewBooking"
    >
      <div class="tw-grid tw-grid-cols-2 tw-gap-2">
        <FormField
          v-model="form.checkin"
          sub-label="Check-in *"
          :dark="isNewBooking"
        >
          <SelectPickerDate
            v-model:selectedDate="form.checkin"
            fieldName="Check-in"
            :zIndex="1000"
            :dark="isNewBooking"
          />
        </FormField>
        <FormField
          v-model="form.checkin"
          sub-label="Time (Check-in) *"
          :dark="isNewBooking"
        >
          <q-select
            v-model="form.checkinTime"
            :options="timeSlots"
            disable
            dense
            :dark="isNewBooking"
          />
        </FormField>
        <FormField
          v-model="form.checkout"
          sub-label="Check-out *"
          :dark="isNewBooking"
        >
          <SelectPickerDate
            v-model:selectedDate="form.checkout"
            fieldName="Check-out"
            :zIndex="1000"
            :dark="isNewBooking"
          />
        </FormField>
        <FormField
          v-model="form.checkout"
          sub-label="Time (Check-out) *"
          :dark="isNewBooking"
        >
          <q-select
            v-model="form.checkoutTime"
            :options="timeSlots"
            disable
            dense
            :dark="isNewBooking"
          />
        </FormField>
      </div>
    </FormField>

    <!-- Platform -->
    <FormField :label="t('reuse.platform')">
      <div class="tw-w-full tw-grid tw-grid-cols-4 tw-gap-1">
        <q-btn
          v-for="platform in Object.values(Platform)"
          :key="platform"
          :outline="form.platform !== platform"
          :flat="form.platform === platform"
          no-caps
          :class="form.platform === platform && platformStyles[platform]"
          :dark="isNewBooking"
          @click.prevent="form.platform = platform"
        >
          {{ platform }}
        </q-btn>
      </div>
    </FormField>

    <!-- Guests -->
    <FormField :label="t('booking_info.fields.guests')">
      <div class="tw-grid tw-grid-cols-2 tw-gap-2">
        <FormField
          v-model.number="form.guests.adults"
          :sub-label="`${t('booking_info.fields.adults')} *`"
          :error-field="formError.adults"
          :error-message="t('booking_info.fields.guests_error')"
          type="number"
          min="1"
          :dark="isNewBooking"
        />
        <div class="tw-grid tw-grid-cols-2 tw-gap-2">
          <FormField
            v-model.number="form.guests.children"
            type="number"
            :sub-label="`${t('booking_info.fields.children')}`"
            :dark="isNewBooking"
          />
          <FormField
            v-model.number="form.guests.infants"
            type="number"
            :sub-label="`${t('booking_info.fields.infants')}`"
            :dark="isNewBooking"
          />
        </div>
      </div>
    </FormField>

    <div class="tw-relative">
      <q-badge
        v-show="form.is_booking_closed"
        rounded
        color="transparent"
        floating
        style="top: -16px"
      >
        <q-icon name="verified" color="positive" size="md" />
      </q-badge>
      <q-card
        :class="{
          'bg-primary': isNewBooking,
        }"
        :style="!isNewBooking && 'background-color: inherit'"
      >
        <q-card-section :class="isNewBooking ? 'text-white' : 'text-primary'">
          <div class="flex items-center q-gutter-sm">
            <span class="tw-text-sm">
              {{ t('booking_info.fields.price') }}
            </span>
            <SelectPaymentStatus
              v-model="form.payment_status"
              hasFormStyles
              :disable="form.is_booking_closed"
            />
          </div>
          <div class="tw-text-sm">
            <q-input
              v-model.number="form.price"
              :color="isNewBooking ? 'white' : 'primary'"
              borderless
              dense
              type="number"
              :disable="form.is_booking_closed"
              :dark="isNewBooking"
            >
              <template #append>
                <q-icon
                  name="euro"
                  :color="isNewBooking ? 'white' : 'primary'"
                  size="xs"
                />
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-card-actions
          v-if="
            !isNewBooking &&
            !form.is_booking_closed &&
            form.approval_status === BookingApprovalState.CONFIRMED
          "
          align="right"
        >
          <q-btn
            v-if="form.payment_status === BookingPaymentStatus.SUCCESS"
            noCaps
            color="secondary"
            flat
            @click="form.is_booking_closed = true"
          >
            {{ t('booking_info.actions.finish_editing') }}
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <div class="tw-flex tw-items-center tw-gap-4">
      <span class="text-no-wrap">
        {{ t('booking_info.fields.optional_fields') }}
      </span>
      <q-toggle
        v-model="areOptionalFieldsOpened"
        :color="isNewBooking ? 'white' : 'primary'"
      />
    </div>

    <!-- Contact -->
    <FormField
      v-show="areOptionalFieldsOpened && form.client_info"
      :label="t('booking_info.fields.contact')"
    >
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-2">
        <FormField
          v-model="form.client_info.name"
          :sub-label="t('booking_info.fields.full_name')"
          :dark="isNewBooking"
        />
        <div class="tw-grid tw-grid-cols-2 tw-gap-2">
          <FormField
            v-model="form.client_info.email"
            :sub-label="t('booking_info.fields.email')"
            :dark="isNewBooking"
          />
          <FormField
            v-model="form.client_info.mobile"
            :sub-label="t('booking_info.fields.mobile')"
            :dark="isNewBooking"
          />
        </div>
      </div>
    </FormField>

    <!-- Key box codes-->
    <FormField
      v-show="areOptionalFieldsOpened"
      :label="t('booking_info.fields.keybox')"
    >
      <div class="tw-grid tw-grid-cols-2 tw-gap-2">
        <FormField
          v-model="form.keybox.first_code"
          sub-label="[13:00 to 03:00]"
          :dark="isNewBooking"
        />
        <FormField
          v-model="form.keybox.second_code"
          sub-label="Backup"
          :dark="isNewBooking"
        />
      </div>
    </FormField>

    <!-- Notes -->
    <FormField
      v-show="areOptionalFieldsOpened"
      v-model="form.notes"
      :label="t('booking_info.fields.notes')"
      type="textarea"
      variant="outlined"
      :dark="isNewBooking"
    />

    <slot />
  </form>
</template>
