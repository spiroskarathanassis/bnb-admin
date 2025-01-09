<script setup lang="ts">
import moment from 'moment';
import { computed, onMounted, ref, watch } from 'vue';

import { useConfigStore } from '@/stores';
import { SpecialPrice, UnavailableDate, YYYY_MM_DD } from '@/types';
import mergeDateRanges from '@/utils/mergeDateRanges';
import mergeDateRangesByPrice from '@/utils/mergeDateRangesByPrice';

import { PropertySettingsTranslationsTypes } from './propertySettingsTranslationsTypes';

// Official
enum Tabs {
  AVAILABILITY = 'availability',
  PRICING = 'pricing',
}

const EN_PROPERTY_SETTINGS_TRANSLATIONS = {
  availability: 'Availability',
  basePriceAppliesTo: 'Base price applies to {x} guests',
  checkin: 'Check-in',
  checkinCheckout: 'Check-in/Check-out',
  checkout: 'Check-out',
  defineSpecialPrice: 'Define special price',
  extraPricePerPerson: 'Extra price per person',
  guests: 'Guests',
  markedAsUnavailable: 'Marked as Unavailable',
  maxGuests: 'Max guests',
  maximumDays: 'Maximum days',
  minimumDays: 'Minimum days',
  pricePerNight: 'Price per night',
  prices: 'Prices',
  pricing: 'Pricing',
  reservationLength: 'Reservation Length',
  save: 'Save',
  selectedDates: 'Selected Dates',
  selectedDatesAvgPrice: 'Selected dates avg price',
  settings: 'Property Settings',
  specialPrice: 'Special Price',
};

const props = withDefaults(
  defineProps<{
    fromDate?: YYYY_MM_DD;
    toDate?: YYYY_MM_DD;
    translations?: Partial<PropertySettingsTranslationsTypes>;
  }>(),
  {
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment().add(1, 'year').format('YYYY-MM-DD'),
    translations: undefined,
  }
);
const emit = defineEmits(['close']);

const configStore = useConfigStore();

const isApplyingChanges = ref(false);
const currentTab = ref<Tabs>(Tabs.AVAILABILITY);
const markedUnavailable = ref(false);
const hasSpecialPrice = ref(false);
const specialPrice = ref(0);
const configSettings = ref({
  checkinTime: '14:00',
  checkoutTime: '10:00',
  extra_price_per_person: 0,
  min_nights_per_book: 1,
  price_per_night: 0,
});

const translations = computed<PropertySettingsTranslationsTypes>(() => ({
  ...EN_PROPERTY_SETTINGS_TRANSLATIONS,
  ...props.translations,
}));

const specialDatePrices = computed<SpecialPrice[]>(
  () => configStore.calendar_date_prices
);
const savedUnavailableDates = computed<UnavailableDate[]>(
  () => configStore.unavailable_dates
);

const avgDatePrice = computed(() => {
  // Loop into the range of the props fromDate and toDate
  const fromToLengthInDays =
    moment(props.toDate, 'YYYY-MM-DD').diff(
      moment(props.fromDate, 'YYYY-MM-DD'),
      'days',
      true
    ) + 1;
  const dateRange = Array.from({ length: fromToLengthInDays }, (_, i) =>
    moment(props.fromDate).add(i, 'days').format('YYYY-MM-DD')
  );

  let totalPrice = 0;

  dateRange.forEach((dt) => {
    const specialDtFound = specialDatePrices.value.find((specialDate) =>
      moment(dt).isBetween(specialDate.from, specialDate.to, 'days', '[]')
    );

    totalPrice += specialDtFound
      ? specialDtFound.price
      : configSettings.value.price_per_night;
  });

  const avgPrice = Math.round(totalPrice / fromToLengthInDays);

  return avgPrice;
});

const isCurrentRangeUnavailable = computed(() => {
  const fromToLengthInDays =
    moment(props.toDate, 'YYYY-MM-DD').diff(
      moment(props.fromDate, 'YYYY-MM-DD'),
      'days',
      true
    ) + 1;
  const dateRange = Array.from({ length: fromToLengthInDays }, (_, i) =>
    moment(props.fromDate).add(i, 'days').format('YYYY-MM-DD')
  );

  return dateRange.every((date) => {
    return savedUnavailableDates.value.some((unavailableDate) => {
      return typeof unavailableDate !== 'string'
        ? moment(date, 'YYYY-MM-DD').isBetween(
            moment(unavailableDate.from, 'YYYY-MM-DD'),
            moment(unavailableDate.to, 'YYYY-MM-DD'),
            'days',
            '[]'
          )
        : moment(date, 'YYYY-MM-DD').isSame(unavailableDate);
    });
  });
});

watch(
  avgDatePrice,
  (newVal) => {
    specialPrice.value = newVal;
    hasSpecialPrice.value = newVal !== configSettings.value.price_per_night;
  },
  { immediate: true }
);

watch(
  isCurrentRangeUnavailable,
  (newVal) => {
    markedUnavailable.value = newVal;
  },
  { immediate: true }
);

const adjustConfig = () => {
  configSettings.value = {
    checkinTime: configStore.checkinTime,
    checkoutTime: configStore.checkoutTime,
    extra_price_per_person: configStore.extra_price_per_person,
    min_nights_per_book: configStore.min_nights_per_book,
    price_per_night: configStore.price_per_night,
  };
};

const onSaved = async () => {
  isApplyingChanges.value = true;

  // Special prices
  const mergeFn = hasSpecialPrice.value
    ? mergeDateRangesByPrice.addRange
    : mergeDateRangesByPrice.removeRange;
  const newPriceDates = mergeFn(
    {
      from: props.fromDate,
      price: specialPrice.value,
      to: props.toDate,
    },
    JSON.parse(JSON.stringify(specialDatePrices.value))
  );

  // Unavailable dates
  const newUnavailableDates = !markedUnavailable.value
    ? mergeDateRanges.removeRange(
        {
          from: props.fromDate,
          to: props.toDate,
        },
        JSON.parse(JSON.stringify(savedUnavailableDates.value))
      )
    : mergeDateRanges.addRange(
        {
          from: props.fromDate,
          to: props.toDate,
        },
        JSON.parse(JSON.stringify(savedUnavailableDates.value))
      );

  await configStore.editConfig(configSettings.value);

  await configStore.editCalendarDates({
    date_prices: newPriceDates,
    unavailables: newUnavailableDates,
  });

  isApplyingChanges.value = false;
};

onMounted(() => {
  adjustConfig();
});
</script>

<template>
  <div
    class="tw-w-full tw-min-w-[360px] tw-p-4 tw-border tw-rounded-lg tw-bg-white"
  >
    <div class="tw-flex tw-flex-col tw-gap-4">
      <div
        class="tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-4 tw-mb-4"
      >
        <div class="tw-text-xl tw-font-semibold tw-truncate">
          {{ translations.settings }}
        </div>
        <q-btn
          icon="close"
          dense
          flat
          size="md"
          color="black"
          @click="emit('close')"
        ></q-btn>
      </div>

      <div
        class="tw-w-full tw-grid tw-grid-cols-2 tw-border-4 tw-border-solid tw-border-gray-100 tw-bg-gray-100 tw-rounded-full"
      >
        <q-btn
          :class="[
            'tw-rounded-full',
            currentTab === Tabs.AVAILABILITY
              ? 'tw-bg-white tw-font-semibold'
              : 'tw-bg-inherit ',
          ]"
          dense
          no-caps
          flat
          @click.prevent="currentTab = Tabs.AVAILABILITY"
        >
          {{ translations.availability }}
        </q-btn>
        <q-btn
          :class="[
            'tw-rounded-full',
            currentTab === Tabs.PRICING
              ? 'tw-bg-white tw-font-bold'
              : 'tw-bg-inherit',
          ]"
          dense
          no-caps
          flat
          @click.prevent="currentTab = Tabs.PRICING"
        >
          {{ translations.pricing }}
        </q-btn>
      </div>

      <div
        v-show="currentTab === Tabs.AVAILABILITY"
        class="tw-flex tw-flex-col tw-gap-2"
      >
        <div class="tw-font-semibold">{{ translations.selectedDates }}</div>

        <div
          class="tw-w-full tw-border-2 tw-border-solid tw-border-gray-100 tw-bg-white tw-font-semibold tw-px-3 tw-py-1.5 tw-rounded-full tw-flex tw-justify-center tw-items-center tw-gap-2"
        >
          <span>{{ fromDate }}</span>
          <span v-if="fromDate !== toDate">-</span>
          <span v-if="fromDate !== toDate">{{ toDate }}</span>
        </div>
      </div>

      <div
        v-show="currentTab === Tabs.AVAILABILITY"
        class="tw-flex tw-flex-col tw-gap-2"
      >
        <div class="tw-font-semibold">{{ translations.checkinCheckout }}</div>

        <div
          class="tw-w-full tw-border-2 tw-border-solid tw-border-gray-100 tw-bg-white tw-p-4 tw-rounded-xl tw-flex tw-justify-between tw-gap-2"
        >
          <div>
            <div class="tw-text-gray-500">{{ translations.checkin }}</div>
            <div class="tw-text-xl tw-font-semibold">
              {{ configSettings.checkinTime }}
            </div>
          </div>
          <div>
            <div class="tw-text-gray-500">{{ translations.checkout }}</div>
            <div class="tw-text-xl tw-font-semibold">
              {{ configSettings.checkoutTime }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-show="currentTab === Tabs.AVAILABILITY"
        class="tw-flex tw-flex-col tw-gap-2"
      >
        <div class="tw-font-semibold">{{ translations.reservationLength }}</div>

        <div
          class="tw-w-full tw-border-2 tw-border-solid tw-border-gray-100 tw-bg-white tw-p-4 tw-rounded-xl tw-flex tw-flex-col tw-gap-2"
        >
          <div>
            <div class="tw-text-gray-500">{{ translations.minimumDays }}</div>
            <div class="tw-text-xl tw-font-semibold">
              {{ configSettings.min_nights_per_book }}
            </div>
            <q-slider
              v-model.number="configSettings.min_nights_per_book"
              :min="0"
              :max="30"
              color="black"
            />
          </div>
          <div>
            <div class="tw-text-gray-500">{{ translations.maximumDays }}</div>
            <div class="tw-text-xl tw-font-semibold">30</div>
          </div>
        </div>
      </div>

      <div
        v-show="currentTab === Tabs.AVAILABILITY"
        class="tw-flex tw-flex-col tw-gap-2"
      >
        <div class="tw-font-semibold">{{ translations.availability }}</div>

        <div
          class="tw-w-full tw-border-2 tw-border-solid tw-border-gray-100 tw-bg-white tw-p-4 tw-rounded-xl tw-flex tw-flex-col tw-gap-2"
        >
          <div
            class="tw-w-full tw-flex tw-justify-between tw-gap-4 tw-items-center"
          >
            <span class="tw-w-full tw-truncate">
              {{ translations.markedAsUnavailable }}
            </span>
            <div
              :class="[
                'tw-size-5 tw-flex tw-justify-between tw-items-center tw-p-0.5 tw-cursor-pointer',
                'tw-border-2 tw-border-solid tw-rounded-full',
                { 'tw-border-black tw-bg-black': markedUnavailable },
              ]"
              @click.prevent="markedUnavailable = !markedUnavailable"
            >
              <img
                src="../../../assets/images/icons/check_white_24dp.svg"
                width="16"
                height="16"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        v-show="currentTab === Tabs.PRICING"
        class="tw-flex tw-flex-col tw-gap-2"
      >
        <div
          class="tw-w-full tw-border-2 tw-border-solid tw-border-gray-100 tw-bg-white tw-p-4 tw-rounded-xl tw-flex tw-flex-col tw-gap-2"
        >
          <div>
            <div class="tw-text-gray-500">{{ translations.pricePerNight }}</div>
            <div class="tw-text-xl tw-font-semibold">
              €{{ configSettings.price_per_night }}
            </div>
            <q-slider
              v-model.number="configSettings.price_per_night"
              :min="0"
              :max="1000"
              color="black"
            />
          </div>
          <div
            class="tw-w-full tw-flex tw-justify-between tw-gap-4 tw-items-center"
          >
            <span class="tw-w-full tw-truncate">
              {{ translations.defineSpecialPrice }}
            </span>
            <div
              :class="[
                'tw-size-5 tw-flex tw-justify-between tw-items-center tw-p-0.5 tw-cursor-pointer',
                'tw-border-2 tw-border-solid tw-rounded-full tw-cursor-pointer',
                { 'tw-border-black tw-bg-black': hasSpecialPrice },
              ]"
              @click.prevent="hasSpecialPrice = !hasSpecialPrice"
            >
              <img
                src="../../../assets/images/icons/check_white_24dp.svg"
                width="16"
                height="16"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        v-show="currentTab === Tabs.PRICING && hasSpecialPrice"
        class="tw-flex tw-flex-col tw-gap-2"
      >
        <div class="tw-font-semibold">{{ translations.specialPrice }}</div>

        <div
          class="tw-w-full tw-border-2 tw-border-solid tw-border-gray-100 tw-bg-white tw-p-4 tw-rounded-xl tw-flex tw-flex-col tw-gap-2"
        >
          <div>
            <div class="tw-text-gray-500">
              {{ translations.selectedDatesAvgPrice }}
            </div>
            <div class="tw-text-xl tw-font-semibold">€{{ specialPrice }}</div>
            <q-slider
              v-model.number="specialPrice"
              :min="0"
              :max="1000"
              color="black"
            />
          </div>
        </div>
      </div>

      <div
        v-show="currentTab === Tabs.PRICING"
        class="tw-flex tw-flex-col tw-gap-2"
      >
        <div class="tw-font-semibold">{{ translations.guests }}</div>

        <div
          class="tw-w-full tw-border-2 tw-border-solid tw-border-gray-100 tw-bg-white tw-p-4 tw-rounded-xl tw-flex tw-flex-col tw-gap-2"
        >
          <div>
            <div class="tw-text-gray-500">{{ translations.maxGuests }}</div>
            <div class="tw-text-xl tw-font-semibold">8</div>
          </div>
          <div>
            <div class="tw-text-gray-500">
              {{ translations.basePriceAppliesTo }}
            </div>
            <div class="tw-text-xl tw-font-semibold">4</div>
          </div>
          <div>
            <div class="tw-text-gray-500">
              {{ translations.extraPricePerPerson }}
            </div>
            <div class="tw-text-xl tw-font-semibold">
              €{{ configSettings.extra_price_per_person }}
            </div>
            <q-slider
              v-model.number="configSettings.extra_price_per_person"
              :min="0"
              :max="30"
              color="black"
            />
          </div>
        </div>
      </div>

      <q-btn
        outline
        rounded
        no-caps
        color="black"
        class="tw-font-bold"
        :loading="isApplyingChanges"
        :disable="isApplyingChanges"
        @click="onSaved"
      >
        {{ translations.save }}
      </q-btn>
    </div>
  </div>
</template>
