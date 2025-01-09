import { defineStore } from 'pinia';
import { computed } from 'vue';

import { useConfigStore, useMainStore } from '@/stores';
import { AppUser } from '@/types';

export const useUserFeatures = defineStore('userFeaturesStore', () => {
  const mainStore = useMainStore();
  const configStore = useConfigStore();

  const appUsers = computed(() => {
    return configStore.app_users;
  });

  const adminAppUsers = computed(() => {
    return appUsers.value.filter((usr) => usr.is_admin);
  });

  const notyUsers = computed(() => {
    return adminAppUsers.value.filter((usr) => !!usr.email);
  });

  const exchangeUsers = computed(() => {
    return adminAppUsers.value;
  });

  const canConfirmBookings = computed(() => {
    return adminAppUsers.value.some(
      (usr) => usr.email === mainStore.user?.email
    );
  });

  const canManageBookings = computed(() => {
    const currentUser = appUsers.value.find(
      (el) => el.email === mainStore.user?.email
    );

    return !!currentUser?.is_admin;
  });

  const isNotyUser = computed(() => {
    return !!notyUsers.value.find(
      (user) => user.email === mainStore.user?.email
    );
  });

  const getUserById = (id: AppUser['userId']) => {
    return appUsers.value.find((usr) => usr.userId === id);
  };

  return {
    appUsers,
    canConfirmBookings,
    canManageBookings,
    exchangeUsers,
    getUserById,
    isNotyUser,
    notyUsers,
  };
});
