import { defineStore } from 'pinia';
import { ref } from 'vue';

import { RequestCalendarDates } from '@/apis/RequestCalendarDates';
import { RequestConfig } from '@/apis/RequestConfig';
import { Locales } from '@/enums';
import { useMainStore } from '@/stores';
import { AppUser, SpecialPrice, UnavailableDate } from '@/types';

interface ApiPropertyConfig {
  app_users: AppUser[];
  checkinTime: string;
  checkoutTime: string;
  date_prices: SpecialPrice[];
  extra_price_per_person: number;
  min_nights_per_book: number;
  price_per_night: number;
  unavailables: UnavailableDate[];
  version: string;
}

export const useConfigStore = defineStore('config', () => {
  const mainStore = useMainStore();

  const app_users = ref<AppUser[]>([]);
  const calendar_date_prices = ref<SpecialPrice[]>([]);
  const checkinTime = ref('14:00');
  const checkoutTime = ref('10:00');
  const extra_price_per_person = ref(0);
  const min_nights_per_book = ref(1);
  const price_per_night = ref(0);
  const unavailable_dates = ref<UnavailableDate[]>([]);
  const version = ref<string | undefined>(); // keep track of config version

  const SET_CALENDAR_DATE_PRICES = (dates: SpecialPrice[]) => {
    calendar_date_prices.value = dates;
  };
  const SET_UNAVAILABLE_DATES = (dates: UnavailableDate[]) => {
    unavailable_dates.value = dates;
  };
  const SET_CONFIG = (config: Partial<ApiPropertyConfig>) => {
    version.value = config.version ?? '0.0.0';
    app_users.value = config.app_users ?? [];
    checkinTime.value = config.checkinTime ?? '14:00';
    checkinTime.value = config.checkinTime ?? '10:00';
    extra_price_per_person.value = config.extra_price_per_person ?? 0;
    min_nights_per_book.value = config.min_nights_per_book ?? 1;
    price_per_night.value = config.price_per_night ?? 0;
  };

  const editCalendarDates = async (payload: {
    date_prices: SpecialPrice[];
    unavailables: UnavailableDate[];
  }) => {
    try {
      const { data } = await RequestCalendarDates.updateCalendarDates({
        date_prices: payload.date_prices,
        unavailables: payload.unavailables,
      });

      calendar_date_prices.value = data?.date_prices || [];
      unavailable_dates.value = data?.unavailables || [];
    } catch (e) {
      mainStore.triggerGlobalError(e);
    }
  };

  const editConfig = async (payload: Partial<ApiPropertyConfig>) => {
    try {
      const config = {
        app_users: app_users.value,
        checkinTime: checkinTime.value,
        checkoutTime: checkoutTime.value,
        extra_price_per_person: extra_price_per_person.value,
        min_nights_per_book: min_nights_per_book.value,
        price_per_night: price_per_night.value,
        version: version.value,
      };

      const { data } = await RequestConfig.updateConfig({
        ...config,
        ...payload,
      });

      SET_CONFIG(data);
    } catch (e) {
      mainStore.triggerGlobalError(e);
    }
  };

  const requestConfig = async () => {
    SET_CONFIG({});

    try {
      const res = await RequestConfig.getConfig();
      const calendarDatesRes = await RequestCalendarDates.getCalendarDates();

      SET_CONFIG(res.data);
      SET_CALENDAR_DATE_PRICES(calendarDatesRes.data?.date_prices || []);
      SET_UNAVAILABLE_DATES(calendarDatesRes.data?.unavailables || []);
    } catch (e) {
      mainStore.triggerGlobalError(e);
    }
  };

  const updateUserLang = async (payload: { lang: Locales }) => {
    const currentUserIndexKey = app_users.value.findIndex(
      (user) => user.email === mainStore.user?.email
    );

    const path = `${currentUserIndexKey}`;
    try {
      const res = await RequestConfig.updateUserConfig(path, {
        ...app_users.value[currentUserIndexKey],
        ...payload,
      });

      app_users.value = app_users.value.map((usr, index) =>
        index === currentUserIndexKey ? res.data : usr
      );
    } catch (e) {
      mainStore.triggerGlobalError(e);
    }
  };

  return {
    app_users,
    calendar_date_prices,
    checkinTime,
    checkoutTime,
    editCalendarDates,
    editConfig,
    extra_price_per_person,
    min_nights_per_book,
    price_per_night,
    requestConfig,
    unavailable_dates,
    updateUserLang,
    version,
  };
});
