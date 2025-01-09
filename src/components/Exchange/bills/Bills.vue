<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { ClearFilterBtn, SelectMonth, SelectYear } from '@/components/common';
import LineItemsWrapper from '@/components/common/LineItem/LineItemsWrapper.vue';
import {
  useExchangeBillsStore,
  useExchangeStore,
  useUserFeatures,
} from '@/stores';
import { BillType, DbTypeWithKey, ExchangeInvestors } from '@/types';
import { PROPERTY_STARTING_YEAR } from '@/utils/constants';
import { isMonthBefore } from '@/utils/months';

import AddNewBill from './AddNewBill.vue';
import BillCard from './BillCard.vue';

const { t } = useI18n();
const billsStore = useExchangeBillsStore();
const exchangeStore = useExchangeStore();
const userFeatures = useUserFeatures();

const selectedMonth = ref('');
const selectedYear = ref(new Date().getFullYear());
const isNewItemFieldOpened = ref(false);

const items = computed<DbTypeWithKey<BillType>[]>(() => billsStore.bills);

// Filters
const selectedCardPerson = computed(() => exchangeStore.selectedCardPerson);

const selectedItems = computed(() =>
  items.value
    .filter((item) => {
      const year = +item.year || PROPERTY_STARTING_YEAR;
      if (selectedYear.value !== year) return;

      if (selectedMonth.value || selectedCardPerson.value) {
        const isMonthMatching = selectedMonth.value == item.month;
        const isPersonMatching = selectedCardPerson.value == item.payer;

        if (selectedMonth.value && selectedCardPerson.value) {
          return isMonthMatching && isPersonMatching;
        }

        return isMonthMatching || isPersonMatching;
      }

      return true;
    })
    .sort((prevItem, nextItem) => {
      // revese month sorting
      return isMonthBefore(nextItem.month, prevItem.month) ? -1 : 1;
    })
);

interface BillItemsByMonth {
  [month: string]: (DbTypeWithKey<BillType> & {
    payerName: string;
  })[];
}

const billSortedByMonth = computed(() => {
  const categorizedItems: BillItemsByMonth = {};

  selectedItems.value.forEach((el) => {
    if (!categorizedItems?.[el.month]) {
      categorizedItems[el.month] = [];
    }

    const payerDetails = userFeatures.appUsers.find(
      (user) => user.userId === el.payer
    );

    categorizedItems[el.month].push({
      ...el,
      payerName: payerDetails
        ? `${payerDetails.first_name}  ${payerDetails.last_name}`
        : el.payer === ExchangeInvestors.SELECT_ALL
          ? ExchangeInvestors.SELECT_ALL
          : '',
    });
  });

  return categorizedItems;
});

const areFiltersEnabled = computed(() => {
  return selectedCardPerson.value || selectedMonth.value;
});

const clearFilters = () => {
  exchangeStore.SELECT_CARD_PERSON();
  selectedMonth.value = '';
};
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

  <LineItemsWrapper :lineItems="billSortedByMonth">
    <template #perionName="{ lineItem }">
      {{ t(`reuse.months.${lineItem[0].month}`) }}
    </template>

    <template #default="{ lineItem }">
      <BillCard v-for="item in lineItem" :key="item.key" :billItem="item" />
    </template>
  </LineItemsWrapper>

  <AddNewBill
    v-if="isNewItemFieldOpened"
    @closeModal="isNewItemFieldOpened = false"
  />
</template>
