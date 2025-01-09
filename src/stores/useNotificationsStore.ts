import moment from 'moment';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { RequestNotifications } from '@/apis/RequestNotifications';
import { useMainStore, useUserFeatures } from '@/stores';
import { DbTypeWithKey, NotificationStatus, Noty } from '@/types';
import requestMapFirebaseData from '@/utils/mapFirebaseData';

const getSortNoties = (noties: DbTypeWithKey<Noty>[]) => {
  return noties
    .sort((a, b) =>
      moment(a.last_change.timestamp).diff(moment(b.last_change.timestamp))
    )
    .reverse();
};

export const useNotificationsStore = defineStore('notifications', () => {
  const mainStore = useMainStore();
  const userFeatures = useUserFeatures();

  const noties = ref<DbTypeWithKey<Noty>[]>([]);

  const getUserNoties = computed(() => {
    return getSortNoties(noties.value);
  });

  const currNotyUser = computed(() => {
    return userFeatures.notyUsers.find(
      (el) => el.email === mainStore.user?.email
    );
  });

  const UPDATE_NOTY = (noty: { data: Noty; key: string }) => {
    const foundIndex = noties.value.findIndex((el) => el.key === noty.key);

    if (foundIndex >= 0) {
      noties.value.splice(foundIndex, 1);
    }
  };

  const REMOVE_NOTY = (notyId: string) => {
    const foundIndex = noties.value.findIndex((el) => el.key === notyId);
    noties.value.splice(foundIndex, 1);
  };

  const fetchNoties = async () => {
    const currUserEmail = mainStore.user?.email;
    if (!currUserEmail) return;

    // Exclude
    if (!userFeatures.isNotyUser) return;

    await RequestNotifications.getNoties()
      .then((res: { data?: Record<string, Noty> }) => {
        if (res.data) {
          const fetchedNoties = requestMapFirebaseData(res.data) || [];
          const updatedNoties = fetchedNoties.filter((noty) =>
            noty.unread_by.includes(currUserEmail)
          ) as unknown as DbTypeWithKey<Noty>[];

          noties.value = updatedNoties;
        }
      })
      .catch((e) => {
        mainStore.triggerGlobalError(e);
      });
  };

  type NotyActionPayload = Omit<
    Noty,
    'key' | 'item' | 'last_change' | 'status' | 'unread_by'
  > & {
    status?: Noty['status'];
    item?: Noty['item'];
  };

  const triggerNewAction = async (payload: NotyActionPayload) => {
    const currUser = mainStore.user;
    if (!currUser) return;

    const unreadBy = userFeatures.notyUsers
      .filter((usr) => usr.email !== currUser.email)
      .map((usr) => usr.email);

    const data: Noty = {
      ...payload,
      item: payload.item || null,
      last_change: {
        email: currUser.email,
        name: currNotyUser.value?.first_name || '',
        timestamp: moment().toISOString(),
      },
      prev_item: payload.prev_item || null,
      status: payload.status || NotificationStatus.CREATED,
      unread_by: unreadBy,
    };

    try {
      await RequestNotifications.saveNewNotification(data);
    } catch (e) {
      mainStore.triggerGlobalError(e);
    }
  };

  const removeNotyFromUser = async (notyKey: string) => {
    const currentNoty = getUserNoties.value.find(
      (noty) => noty.key === notyKey
    );
    if (!currentNoty) return;

    const isLastNotyUser = currentNoty.unread_by.length === 1;

    try {
      // Check if user is last to read and delete noty instead of update
      if (isLastNotyUser) {
        await RequestNotifications.deleteNotification({
          notificationId: notyKey,
        });
        REMOVE_NOTY(notyKey);
      } else {
        const data = {
          ...currentNoty,
          unread_by: currentNoty.unread_by.filter(
            (el) => el !== mainStore.user?.email
          ),
        };
        delete data.key;

        const res = await RequestNotifications.updateNotification({
          data,
          notificationId: notyKey,
        });
        UPDATE_NOTY({ data: res.data, key: notyKey });
      }
    } catch (e) {
      mainStore.triggerGlobalError(e);
    }
  };

  return {
    fetchNoties,
    getUserNoties,
    noties,
    removeNotyFromUser,
    triggerNewAction,
  };
});
