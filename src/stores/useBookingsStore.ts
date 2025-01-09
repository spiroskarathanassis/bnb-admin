import { defineStore } from 'pinia';
import { ref } from 'vue';

import { RequestBookings } from '@/apis/RequestBookings';
import { RequestServerBookings } from '@/apis/RequestServerBookings';
import router from '@/router';
import { useMainStore, useNotificationsStore } from '@/stores';
import {
  BookingType,
  DbTypeWithKey,
  NotificationStatus,
  NotificationType,
} from '@/types';
import { isBookingOverlaps } from '@/utils/booking';
import { ALERT_TYPE } from '@/utils/constants';
import requestMapFirebaseData from '@/utils/mapFirebaseData';

interface FirebasePostResponse {
  name: string;
}
interface FirebaseParams {
  orderBy?: string;
  equalTo?: string | number;
  startAt?: string | number;
}

export const useBookingsStore = defineStore('bookings', () => {
  const mainStore = useMainStore();
  const notificationsStore = useNotificationsStore();

  const bookings = ref<DbTypeWithKey<BookingType>[]>([]);

  const UPDATE_BOOKING = (booking: DbTypeWithKey<BookingType>) => {
    const foundIndex = bookings.value.findIndex(
      (book) => book.key === booking.key
    );
    bookings.value.splice(foundIndex, 1, booking);
  };
  const REMOVE_BOOKING = (bookingKey: string) => {
    const foundIndex = bookings.value.findIndex(
      (book) => book.key === bookingKey
    );
    bookings.value.splice(foundIndex, 1);
  };

  const requestBookings = async (payload: FirebaseParams | null = null) => {
    bookings.value = [];

    const params = payload?.orderBy
      ? {
          equalTo: payload?.equalTo,
          orderBy: payload?.orderBy,
          startAt: payload?.startAt,
        }
      : null;

    await RequestBookings.getBookings(params)
      .then((res: { data?: Record<string, BookingType> }) => {
        if (!res.data) return;

        const freshBookings = requestMapFirebaseData(
          res.data
        ) as unknown as DbTypeWithKey<BookingType>[];
        bookings.value = freshBookings;
      })
      .catch((e) => {
        mainStore.triggerGlobalError(e);
      });
  };

  const addNewBooking = async (payload: BookingType) => {
    try {
      // Check if another booking exists on these days
      const isOverLapping = await isBookingOverlaps(payload);

      if (isOverLapping) {
        const alertMsg = `Some of these days are not available. Please check the reservations.`;
        mainStore.SET_GLOBAL_ALERT({
          message: alertMsg,
          type: ALERT_TYPE.ERROR,
        });
        return;
      }

      // Then submit new booking

      const firebasePostRes = (await RequestBookings.addNewBooking(
        payload
      )) as unknown as FirebasePostResponse;

      const newBooking: DbTypeWithKey<BookingType> = {
        ...payload,
        key: firebasePostRes.name,
      };

      bookings.value.push(newBooking);

      notificationsStore.triggerNewAction({
        item: newBooking,
        type: NotificationType.BOOKING,
      });

      router.push({ name: 'Calendar' });
    } catch (e) {
      mainStore.triggerGlobalError(e);
    }
  };

  const editBooking = async (payload: {
    bookId: string;
    data: BookingType;
  }) => {
    try {
      const prevItem = bookings.value.find(
        (item) => item.key === payload.bookId
      );

      const res = await RequestBookings.updateBooking({
        ...payload,
        // apartmentId: 1,
      });
      UPDATE_BOOKING({ ...res.data, key: payload.bookId });
      notificationsStore.triggerNewAction({
        item: res.data,
        prev_item: prevItem,
        status: NotificationStatus.UPDATED,
        type: NotificationType.BOOKING,
      });
    } catch (e) {
      mainStore.triggerGlobalError(e);
    }
  };

  const deleteBooking = async (payload: { bookId: string }) => {
    const prevItem = bookings.value.find((item) => item.key === payload.bookId);

    await RequestBookings.deleteBooking(payload)
      .then(() => {
        if (prevItem) REMOVE_BOOKING(prevItem.key);
        notificationsStore.triggerNewAction({
          prev_item: prevItem,
          status: NotificationStatus.DELETED,
          type: NotificationType.BOOKING,
        });
      })
      .catch((e) => {
        mainStore.triggerGlobalError(e);
      });
  };

  const confirmBooking = async (payload: { bookId: number }) => {
    try {
      const prevItem = bookings.value.find(
        (item) => item.id === payload.bookId
      );

      const res = await RequestServerBookings.bookingConfirmation({
        ...payload,
        // apartmentId: 1,
      });
      UPDATE_BOOKING(res.data.booking);
      notificationsStore.triggerNewAction({
        item: res.data.booking,
        prev_item: prevItem,
        status: NotificationStatus.UPDATED,
        type: NotificationType.BOOKING,
      });
    } catch (e) {
      mainStore.triggerGlobalError(e);
    }
  };

  const rejectBooking = async (payload: { bookId: number }) => {
    const prevItem = bookings.value.find((item) => item.id === payload.bookId);

    await RequestServerBookings.bookingRejection(payload)
      .then(() => {
        REMOVE_BOOKING(payload.bookId);
        notificationsStore.triggerNewAction({
          prev_item: prevItem,
          status: NotificationStatus.DELETED,
          type: NotificationType.BOOKING,
        });
      })
      .catch((e) => {
        mainStore.triggerGlobalError(e);
      });
  };

  const sendCheckinReminder = async (payload: { bookId: number }) => {
    try {
      const res = await RequestServerBookings.bookingCheckinReminder({
        ...payload,
        // apartmentId: 1,
      });
      mainStore.SET_GLOBAL_ALERT({
        message: res.data.message,
      });
    } catch (e) {
      mainStore.triggerGlobalError(e);
    }
  };

  const sendCheckoutReminder = async (payload: { bookId: number }) => {
    try {
      const res = await RequestServerBookings.bookingCheckoutReminder({
        ...payload,
        // apartmentId: 1,
      });
      mainStore.SET_GLOBAL_ALERT({ message: res.data.message });
    } catch (e) {
      mainStore.triggerGlobalError(e);
    }
  };

  return {
    addNewBooking,
    bookings,
    confirmBooking,
    deleteBooking,
    editBooking,
    rejectBooking,
    requestBookings,
    sendCheckinReminder,
    sendCheckoutReminder,
  };
});
