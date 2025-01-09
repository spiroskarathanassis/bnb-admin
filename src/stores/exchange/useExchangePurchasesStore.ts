import { defineStore } from 'pinia';
import { ref } from 'vue';

import { RequestPurchases } from '@/apis/exchange/RequestPurchases';
import { useMainStore, useNotificationsStore } from '@/stores';
import {
  DbTypeWithKey,
  NotificationStatus,
  NotificationType,
  PurchaseType,
} from '@/types';
import requestMapFirebaseData from '@/utils/mapFirebaseData';

export const useExchangePurchasesStore = defineStore(
  'exchangePurchases',
  () => {
    const mainStore = useMainStore();
    const notificationsStore = useNotificationsStore();

    const purchases = ref<DbTypeWithKey<PurchaseType>[]>([]);

    const UPDATE_PURCHASE = (purchase: DbTypeWithKey<PurchaseType>) => {
      const foundIndex = purchases.value.findIndex(
        (el) => el.key === purchase.key
      );
      purchases.value.splice(foundIndex, 1, purchase);
    };

    const REMOVE_PURCHASE = (purchaseKey: string) => {
      const foundIndex = purchases.value.findIndex(
        (el) => el.key === purchaseKey
      );
      purchases.value.splice(foundIndex, 1);
    };

    const fetchPurchases = async () => {
      await RequestPurchases.getExchangePurchases()
        .then((res: { data?: Record<string, PurchaseType> }) => {
          if (res.data) {
            const reqPurchases = requestMapFirebaseData(res.data);
            purchases.value = reqPurchases ?? [];
          }
        })
        .catch(() => {
          throw new Error('Fetch purchases not finished correctly.');
        });
    };

    const addNewPurchase = async (payload: PurchaseType & { id: number }) => {
      await RequestPurchases.postExchangePurchases(payload)
        .then(() => {
          purchases.value.push({ ...payload, key: payload.id.toString() });

          notificationsStore.triggerNewAction({
            item: payload,
            type: NotificationType.PURCHASE,
          });
        })
        .catch((e) => {
          mainStore.triggerGlobalError(e);
        });
    };

    const editPurchases = async (payload: {
      data: PurchaseType;
      purchaseId: string;
    }) => {
      const prevItem = purchases.value.find(
        (item) => item.key === payload.purchaseId
      );

      await RequestPurchases.updateExchangePurchases(payload)
        .then((res) => {
          UPDATE_PURCHASE({
            ...res.data,
            key: payload.purchaseId,
          });
          notificationsStore.triggerNewAction({
            item: res.data,
            prev_item: prevItem,
            status: NotificationStatus.UPDATED,
            type: NotificationType.PURCHASE,
          });
        })
        .catch((e) => {
          mainStore.triggerGlobalError(e);
        });
    };

    const deletePurchase = async (payload: { purchaseId: string }) => {
      const prevItem = purchases.value.find(
        (item) => item.key === payload.purchaseId
      );

      await RequestPurchases.deleteExchangePurchases(payload)
        .then(() => {
          REMOVE_PURCHASE(payload.purchaseId);
          notificationsStore.triggerNewAction({
            prev_item: prevItem,
            status: NotificationStatus.DELETED,
            type: NotificationType.PURCHASE,
          });
        })
        .catch((e) => {
          mainStore.triggerGlobalError(e);
        });
    };

    return {
      addNewPurchase,
      deletePurchase,
      editPurchases,
      fetchPurchases,
      purchases,
    };
  }
);
