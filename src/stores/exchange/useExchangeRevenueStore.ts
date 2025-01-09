import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { RequestRevenue } from '@/apis/exchange/RequestRevenue';
import {
  useBookingsStore,
  useMainStore,
  // useNotificationsStore,
} from '@/stores';
import { DbTypeWithKey, RevenueType } from '@/types';
import formatRevenueBookings from '@/utils/analytics/formatRevenueBookings';
import requestMapFirebaseData from '@/utils/mapFirebaseData';

export const useExchangeRevenuesStore = defineStore('exchangeRevenues', () => {
  const mainStore = useMainStore();
  // const notificationsStore = useNotificationsStore();
  const bookingsStore = useBookingsStore();

  const revenue = ref<DbTypeWithKey<RevenueType>[]>([]);
  const revenueYear = ref(new Date().getFullYear());

  const SET_REVENUE_YEAR = (year: number) => {
    revenueYear.value = year;
  };

  const exchangeRevenueBookings = computed(() => {
    const periodBookings = bookingsStore.bookings.filter(
      (bk) => bk.year === revenueYear.value
    );

    return formatRevenueBookings(periodBookings);
  });

  const totalRevenueBookings = computed(() => {
    return formatRevenueBookings(bookingsStore.bookings);
  });

  const fetchRevenue = async () => {
    await RequestRevenue.getExchangeRevenue()
      .then((res: { data?: Record<string, RevenueType> }) => {
        if (res.data) {
          const reqRevenue = requestMapFirebaseData(res.data);
          revenue.value = reqRevenue;
        }
      })
      .catch(() => {
        throw new Error('Fetch revenue not finished correctly.');
      });
  };

  const addNewRevenue = async (payload: RevenueType & { id: number }) => {
    await RequestRevenue.postExchangeRevenue(payload)
      .then(() => {
        revenue.value.push({ ...payload, key: payload.id.toString() });

        // notificationsStore.triggerNewAction({
        //   item: payload,
        //   type: 'revenue',
        // });
      })
      .catch((e) => {
        mainStore.triggerGlobalError(e);
      });
  };

  return {
    SET_REVENUE_YEAR,
    addNewRevenue,
    exchangeRevenueBookings,
    fetchRevenue,
    revenue,
    revenueYear,
    totalRevenueBookings,
  };
});
