<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { ClearFilterBtn, SelectMonth, SelectYear } from '@/components/common';
import LineItemsWrapper from '@/components/common/LineItem/LineItemsWrapper.vue';
import {
  useExchangeStore,
  useExchangeTransactionsStore,
  useUserFeatures,
} from '@/stores';
import { DbTypeWithKey, TransactionType } from '@/types';
import { PROPERTY_STARTING_YEAR } from '@/utils/constants';
import { isMonthBefore } from '@/utils/months';

import AddNewTransaction from './AddNewTransaction.vue';
import TransactionCard from './TransactionCard.vue';

const { t } = useI18n();
const transactionsStore = useExchangeTransactionsStore();
const exchangeStore = useExchangeStore();
const userFeatures = useUserFeatures();

const selectedMonth = ref('');
const selectedYear = ref(new Date().getFullYear());
const isNewItemFieldOpened = ref(false);

const transactions = computed<DbTypeWithKey<TransactionType>[]>(
  () => transactionsStore.transactions
);

// Filters
const selectedCardPerson = computed(() => exchangeStore.selectedCardPerson);

const selectedTransactions = computed(() => {
  return transactions.value
    .filter((transaction) => {
      const year = +transaction.year || PROPERTY_STARTING_YEAR;
      if (selectedYear.value !== year) return;

      if (selectedMonth.value || selectedCardPerson.value) {
        const isMonthMatching = selectedMonth.value === transaction.month;
        const isPersonMatching =
          !!selectedCardPerson.value &&
          [transaction.senderId, transaction.receiverId].includes(
            selectedCardPerson.value
          );

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
    });
});

interface TransactionItemsByMonth {
  [month: string]: (DbTypeWithKey<TransactionType> & {
    senderName: string;
    receiverName: string;
  })[];
}

const transactionsSortedByMonth = computed(() => {
  const categorizedItems: TransactionItemsByMonth = {};

  selectedTransactions.value.forEach((el) => {
    if (!categorizedItems?.[el.month]) {
      categorizedItems[el.month] = [];
    }

    const senderName =
      userFeatures.appUsers.find((user) => user.userId === el.senderId)
        ?.first_name ?? '';
    const receiverName =
      userFeatures.appUsers.find((user) => user.userId === el.receiverId)
        ?.first_name ?? '';

    categorizedItems[el.month].push({
      ...el,
      receiverName,
      senderName,
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

  <LineItemsWrapper :lineItems="transactionsSortedByMonth">
    <template #perionName="{ lineItem }">
      {{ t(`reuse.months.${lineItem[0].month}`) }}
    </template>

    <template #default="{ lineItem }">
      <TransactionCard
        v-for="item in lineItem"
        :key="item.key"
        :transaction="item"
      />
    </template>
  </LineItemsWrapper>

  <AddNewTransaction
    v-if="isNewItemFieldOpened"
    @closeModal="isNewItemFieldOpened = false"
  />
</template>
