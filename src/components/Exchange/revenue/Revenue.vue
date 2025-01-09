<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { ClearFilterBtn, SelectMonth, SelectYear } from '@/components/common';
import LineItem from '@/components/common/LineItem/LineItem.vue';
import LineItemsWrapper from '@/components/common/LineItem/LineItemsWrapper.vue';
import { MonthName } from '@/enums';
import { useExchangeRevenuesStore, useExchangeStore } from '@/stores/exchange';
import { DbTypeWithKey, RevenueType } from '@/types';
import { PROPERTY_STARTING_YEAR } from '@/utils/constants';
// import ModalNotesPreview from '../../layout/modals/ModalNotesPreview.vue';
import getMonthIndex from '@/utils/getMonthIndex';

import AddNewRevenue from './AddNewRevenue.vue';

interface RevenueItemsByMonth {
  [month: string]: RevenueType[];
}

const { t } = useI18n();
const revenuesStore = useExchangeRevenuesStore();
const exchangeStore = useExchangeStore();

const selectedMonth = ref<MonthName | ''>('');
const selectedYear = ref(new Date().getFullYear());
const isNewItemFieldOpened = ref(false);
// const currentPreviewNote = ref<ExchangeNotesPreview | null>(null);

const adjustMonthBookings = computed<RevenueType[]>(
  () => revenuesStore.exchangeRevenueBookings
);

const revenueItems = computed<DbTypeWithKey<RevenueType>[]>(
  () => revenuesStore.revenue
);

// Filters
const selectedCardPerson = computed(() => exchangeStore.selectedCardPerson);

const selectedItems = computed<RevenueType[]>(() => {
  return adjustMonthBookings.value
    .concat(revenueItems.value)
    .filter((item: RevenueType) => {
      const year = +item.year || PROPERTY_STARTING_YEAR;
      if (selectedYear.value !== year) return;

      if (selectedMonth.value) {
        return selectedMonth.value === item.month;
      }

      return true;
    })
    .sort((prevItem: RevenueType, nextItem: RevenueType) => {
      // months
      return getMonthIndex(nextItem.month) - getMonthIndex(prevItem.month);
    });
});

const revenueSortedByMonth = computed(() => {
  const categorizedItems: RevenueItemsByMonth = {};

  selectedItems.value.forEach((el: RevenueType) => {
    if (!categorizedItems[el.month]) {
      categorizedItems[el.month] = [];
    }

    categorizedItems[el.month].push(el);
  });

  return categorizedItems;
});

const areFiltersEnabled = computed(() => {
  return selectedCardPerson.value || selectedMonth.value;
});

watch(selectedYear, (nextVal: number, prevVal: number) => {
  if (prevVal !== nextVal) {
    revenuesStore.SET_REVENUE_YEAR(+nextVal);
  }
});

const clearFilters = () => {
  exchangeStore.SELECT_CARD_PERSON();
  selectedMonth.value = '';
};

// const openNotes = (revenueItem: RevenueType) => {
//   currentPreviewNote.value = {
//     title: `${revenueItem.description} - ${revenueItem.price}€`,
//     text: revenueItem.notes,
//   };
// };
</script>

<template>
  <!-- Filters -->
  <div
    class="tw-w-full tw-flex tw-justify-start tw-items-center tw-flex-wrap tw-gap-1 tw-my-4 tw-min-h-8 md:tw-min-h-10"
  >
    <ClearFilterBtn :isDisabled="!areFiltersEnabled" @clear="clearFilters" />
    <SelectMonth v-model="selectedMonth" />
    <SelectYear v-model="selectedYear" />
  </div>

  <div class="tw-w-full">
    <q-btn
      flat
      no-caps
      color="primary"
      icon-right="add"
      @click="isNewItemFieldOpened = true"
    >
      <span>{{ t('reuse.add_new') }}</span>
    </q-btn>
  </div>

  <LineItemsWrapper :lineItems="revenueSortedByMonth">
    <template #perionName="{ lineItem }">
      {{ t(`reuse.months.${lineItem[0].month}`) }}
    </template>

    <template #default="{ lineItem }">
      <div
        v-for="item in lineItem"
        :id="item.description"
        :key="item.description"
        class="tw-w-full"
      >
        <LineItem
          :tabText="item.from"
          :price="(+item.price).toFixed(2)"
          :description="item.description"
        />
      </div>
    </template>
  </LineItemsWrapper>

  <AddNewRevenue
    v-if="isNewItemFieldOpened"
    :title="`${t('modals.add')} ${t('modals.revenue.title')}`"
    @closeModal="isNewItemFieldOpened = false"
  />
  <!-- <ModalNotesPreview
    v-if="currentPreviewNote"
    :notes="currentPreviewNote"
    @closeModal="currentPreviewNote = null"
  /> -->
</template>
