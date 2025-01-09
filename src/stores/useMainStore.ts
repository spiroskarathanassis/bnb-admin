import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import cookies from 'vue-cookies';

import { Locales } from '@/enums';
import router from '@/router';
import { useConfigStore } from '@/stores';
import { AlertType, StoreUser } from '@/types';
import { ALERT_TYPE } from '@/utils/constants';

const FAKE_USER = {
  email: 'paulsmith@gmail.com',
};

export const useMainStore = defineStore('mainStore', () => {
  const configStore = useConfigStore();

  const globalAlert = ref<AlertType>({ message: '', type: '' });
  const isAuthorized = ref(false);
  const isLoggedIn = ref(false);
  const token = ref<string>('');
  const user = ref<StoreUser | null>(FAKE_USER);

  const getToken = computed(() => {
    return token.value ? token.value : cookies.get('firtoken');
  });

  const localeUserLanguage = computed(() => {
    const currentUser = configStore.app_users.find(
      (el) => el.email === user.value?.email
    );
    const cookieLang = cookies.get('bnblocale');

    if (currentUser && Object.values(Locales).includes(currentUser.lang)) {
      if (cookieLang !== currentUser.lang) {
        cookies.set('bnblocale', currentUser.lang);
      }

      return currentUser.lang;
    }

    return cookieLang || Locales.EN;
  });

  const FIREBASE_AUTHORIZED_ERROR = () => {
    isAuthorized.value = false;
    router.push({ name: 'Login' });
  };

  const SET_AUTH = (isAuth: boolean) => {
    isAuthorized.value = isAuth;
  };

  const SET_GLOBAL_ALERT = (alert: AlertType) => {
    globalAlert.value = {
      message: alert.message,
      type: alert.type || ALERT_TYPE.SUCCESS,
    };
  };

  const SET_TOKEN = (nextToken: string) => {
    cookies.set('firtoken', nextToken);
    token.value = nextToken;
  };

  const UPDATE_LOGGED_IN = (isLogged: boolean) => {
    isLoggedIn.value = isLogged;
  };

  const UPDATE_USER = (userCreds: StoreUser) => {
    // Google auth user info
    user.value = { email: userCreds.email };
  };

  const triggerGlobalError = (
    error: any | { response?: { status: number } }
  ) => {
    // console.log('triggerGlobalError', error);

    if (error?.response?.status === 401) {
      FIREBASE_AUTHORIZED_ERROR();
    } else {
      SET_GLOBAL_ALERT({
        message: 'Something went wrong!',
        type: ALERT_TYPE.ERROR,
      });
    }
  };

  return {
    SET_AUTH,
    SET_GLOBAL_ALERT,
    SET_TOKEN,
    UPDATE_LOGGED_IN,
    UPDATE_USER,
    getToken,
    globalAlert,
    isAuthorized,
    localeUserLanguage,
    triggerGlobalError,
    user,
  };
});
