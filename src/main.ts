/* eslint-disable simple-import-sort/imports */
import { createApp } from 'vue';

import { createI18n } from 'vue-i18n';

// plugins
import useQuasar from '@/plugins/quasar';
// import '@/firebase/firebaseInit';

import { createPinia } from 'pinia';
import router from '@/router';

// Global components
import App from './App.vue';
import Navbar from '@/components/TheNavbar.vue';
import PageSection from '@/components/common/PageSection.vue';
import PageTitle from '@/components/common/PageTitle.vue';

import { en } from '@/locales';
import { BookingGuests } from '@/types';

// Styles
import '@/assets/styles/global.scss';
import './assets/styles/tailwind.css';

import { useConfigStore, useNotificationsStore } from '@/stores';

const swHelper = () => {
  import('./service_worker');
};

const pinia = createPinia();

const i18n = createI18n({
  allowComposition: true,
  fallbackLocale: 'en',
  globalInjection: true,
  locale: 'en',
  messages: { en },
});

router.beforeEach(async (_to, _from, next) => {
  const configStore = useConfigStore();

  if (!configStore.version) {
    await configStore.requestConfig();
  }

  next(); // make sure to always call next()!
});

router.afterEach(async () => {
  const notificationsStore = useNotificationsStore();
  await notificationsStore.fetchNoties();
});

const app = createApp(App);

app.config.globalProperties.sumGuests = (guests: BookingGuests) => {
  return guests.adults + (guests.children ?? 0) + (guests.infants ?? 0);
};

useQuasar(app);
app.use(i18n);
app.use(pinia);
app.use(router);

app.component('Navbar', Navbar);
app.component('PageSection', PageSection);
app.component('PageTitle', PageTitle);

app.mount('#bnb');

swHelper();
