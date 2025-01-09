import { defineStore } from 'pinia';
import { ref } from 'vue';

import { RequestBills } from '@/apis/exchange/RequestBills';
import { useMainStore, useNotificationsStore } from '@/stores';
import {
  BillType,
  DbTypeWithKey,
  NotificationStatus,
  NotificationType,
} from '@/types';
import requestMapFirebaseData from '@/utils/mapFirebaseData';

export const useExchangeBillsStore = defineStore('exchangeBills', () => {
  const mainStore = useMainStore();
  const notificationsStore = useNotificationsStore();

  const bills = ref<DbTypeWithKey<BillType>[]>([]);

  const UPDATE_BILL = (bill: DbTypeWithKey<BillType>) => {
    const foundIndex = bills.value.findIndex((el) => el.key === bill.key);
    bills.value.splice(foundIndex, 1, bill);
  };

  const REMOVE_BILL = (billKey: string) => {
    const foundIndex = bills.value.findIndex((el) => el.key === billKey);
    bills.value.splice(foundIndex, 1);
  };

  const fetchBills = async () => {
    await RequestBills.getExchangeBills()
      .then((res: { data?: Record<string, BillType> }) => {
        if (res.data) {
          const reqBills = requestMapFirebaseData(res.data);
          bills.value = reqBills;
        }
      })
      .catch(() => {
        throw new Error('Fetch bills not finished correctly.');
      });
  };

  const addNewBill = async (payload: BillType & { id: number }) => {
    await RequestBills.postExchangeBills(payload)
      .then(() => {
        bills.value.push({ ...payload, key: payload.id.toString() });

        notificationsStore.triggerNewAction({
          item: payload,
          type: NotificationType.BILL,
        });
      })
      .catch((e) => {
        mainStore.triggerGlobalError(e);
      });
  };

  const editBills = async (payload: { billId: string; data: BillType }) => {
    const prevItem = bills.value.find((item) => item.key === payload.billId);

    await RequestBills.updateExchangeBills(payload)
      .then((res) => {
        UPDATE_BILL({ ...res.data, key: payload.billId });
        notificationsStore.triggerNewAction({
          item: res.data,
          prev_item: prevItem,
          status: NotificationStatus.UPDATED,
          type: NotificationType.BILL,
        });
      })
      .catch((e) => {
        mainStore.triggerGlobalError(e);
      });
  };

  const deleteBill = async (payload: { billId: string }) => {
    const prevItem = bills.value.find((item) => item.key === payload.billId);

    await RequestBills.deleteExchangeBills(payload)
      .then(() => {
        REMOVE_BILL(payload.billId);
        notificationsStore.triggerNewAction({
          prev_item: prevItem,
          status: NotificationStatus.DELETED,
          type: NotificationType.BILL,
        });
      })
      .catch((e) => {
        mainStore.triggerGlobalError(e);
      });
  };

  return {
    addNewBill,
    bills,
    deleteBill,
    editBills,
    fetchBills,
  };
});
