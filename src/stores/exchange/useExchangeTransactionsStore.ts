import { defineStore } from 'pinia';
import { ref } from 'vue';

import { RequestTransactions } from '@/apis/exchange/RequestTransactions';
import { useMainStore, useNotificationsStore } from '@/stores';
import {
  DbTypeWithKey,
  NotificationStatus,
  NotificationType,
  TransactionType,
} from '@/types';
import requestMapFirebaseData from '@/utils/mapFirebaseData';

export const useExchangeTransactionsStore = defineStore(
  'exchangeTransactions',
  () => {
    const mainStore = useMainStore();
    const notificationsStore = useNotificationsStore();

    const transactions = ref<DbTypeWithKey<TransactionType>[]>([]);

    const REMOVE_TRANSACTION = (transactionKey: string) => {
      const foundIndex = transactions.value.findIndex(
        (el) => el.key === transactionKey
      );
      transactions.value.splice(foundIndex, 1);
    };
    const UPDATE_TRANSACTION = (
      transaction: DbTypeWithKey<TransactionType>
    ) => {
      const foundIndex = transactions.value.findIndex(
        (el) => el.key === transaction.key
      );
      transactions.value.splice(foundIndex, 1, transaction);
    };

    const fetchTransactions = async () => {
      await RequestTransactions.getExchangeTransactions()
        .then((res: { data?: Record<string, TransactionType> }) => {
          if (res.data) {
            const reqTransactions = requestMapFirebaseData(res.data);
            transactions.value = reqTransactions;
          }
        })
        .catch(() => {
          throw new Error('Fetch transactions not finished correctly.');
        });
    };

    const addNewTransaction = async (
      payload: TransactionType & { id: number }
    ) => {
      await RequestTransactions.postExchangeTransactions(payload)
        .then(() => {
          transactions.value.push({ ...payload, key: payload.id.toString() });

          notificationsStore.triggerNewAction({
            item: payload,
            type: NotificationType.TRANSACTION,
          });
        })
        .catch((e) => {
          mainStore.triggerGlobalError(e);
        });
    };

    const editTransaction = async (payload: {
      data: TransactionType;
      transactionId: string;
    }) => {
      const prevItem = transactions.value.find(
        (item) => item.key === payload.transactionId
      );

      await RequestTransactions.updateExchangeTransaction(payload)
        .then((res) => {
          UPDATE_TRANSACTION({
            ...res.data,
            key: payload.transactionId,
          });
          notificationsStore.triggerNewAction({
            item: res.data,
            prev_item: prevItem,
            status: NotificationStatus.UPDATED,
            type: NotificationType.TRANSACTION,
          });
        })
        .catch((e) => {
          mainStore.triggerGlobalError(e);
        });
    };

    const deleteTransaction = async (payload: { transactionId: string }) => {
      const prevItem = transactions.value.find(
        (item) => item.key === payload.transactionId
      );

      await RequestTransactions.deleteExchangeTransaction(payload)
        .then(() => {
          REMOVE_TRANSACTION(payload.transactionId);
          notificationsStore.triggerNewAction({
            prev_item: prevItem,
            status: NotificationStatus.DELETED,
            type: NotificationType.TRANSACTION,
          });
        })
        .catch((e) => {
          mainStore.triggerGlobalError(e);
        });
    };

    return {
      REMOVE_TRANSACTION,
      UPDATE_TRANSACTION,
      addNewTransaction,
      deleteTransaction,
      editTransaction,
      fetchTransactions,
      transactions,
    };
  }
);
