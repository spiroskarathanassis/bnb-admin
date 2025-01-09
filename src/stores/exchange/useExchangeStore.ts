import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import {
  useExchangeBillsStore,
  useExchangePurchasesStore,
  useExchangeRevenuesStore,
  useExchangeTransactionsStore,
  useMainStore,
} from '@/stores';

export const useExchangeStore = defineStore('exchange', () => {
  const mainStore = useMainStore();
  const billsStore = useExchangeBillsStore();
  const purchasesStore = useExchangePurchasesStore();
  const revenuesStore = useExchangeRevenuesStore();
  const transactionsStore = useExchangeTransactionsStore();

  const selectedCardPerson = ref<number>();

  const isExchangeRequested = computed(() => {
    return (
      billsStore.bills.length > 0 &&
      purchasesStore.purchases.length > 0 &&
      revenuesStore.revenue.length > 0 &&
      transactionsStore.transactions.length > 0
    );
  });

  const SELECT_CARD_PERSON = (investorId?: number) => {
    selectedCardPerson.value = investorId;
  };

  const fetchExchange = async () => {
    try {
      await billsStore.fetchBills();
      await purchasesStore.fetchPurchases();
      await revenuesStore.fetchRevenue();
      await transactionsStore.fetchTransactions();
    } catch (e) {
      mainStore.triggerGlobalError(e);
    }
  };

  return {
    SELECT_CARD_PERSON,
    fetchExchange,
    isExchangeRequested,
    selectedCardPerson,
  };
});
