import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Calendar from '../components/pages/Calendar.vue';
import Exchange from '../components/pages/Exchange.vue';
import Login from '../components/pages/Login.vue';
import NewBooking from '../components/pages/NewBooking.vue';

const AdminSettings = defineAsyncComponent(
  () => import('@/components/AdminSettings/AdminSettings.vue')
);
const Analytics = defineAsyncComponent(
  () => import('@/components/pages/Analytics.vue')
);
const Todos = defineAsyncComponent(
  () => import('@/components/pages/Todos.vue')
);
const Notifications = defineAsyncComponent(
  () => import('@/components/pages/Notifications.vue')
);
const Purchases = defineAsyncComponent(
  () => import('@/components/Exchange/purchases/Purchases.vue')
);
const Bills = defineAsyncComponent(
  () => import('@/components/Exchange/bills/Bills.vue')
);
const Transactions = defineAsyncComponent(
  () => import('@/components/Exchange/transactions/Transactions.vue')
);
const Revenue = defineAsyncComponent(
  () => import('@/components/Exchange/revenue/Revenue.vue')
);

const routes: Array<RouteRecordRaw> = [
  { component: Login, name: 'Login', path: '/login' },
  {
    component: NewBooking,
    meta: {
      // requiresAuth: true,
    },
    name: 'NewBooking',
    path: '/new_booking',
  },
  {
    children: [
      {
        component: Purchases,
        name: 'Purchases',
        path: 'purchases',
      },
      {
        component: Bills,
        name: 'Bills',
        path: 'bills',
      },
      {
        component: Revenue,
        name: 'Revenue',
        path: 'revenue',
      },
      {
        component: Transactions,
        name: 'Transactions',
        path: 'transactions',
      },
    ],
    component: Exchange,
    meta: {
      // requiresAuth: true,
    },
    name: 'Exchange',
    path: '/exchange/',
    redirect: { name: 'Purchases' },
  },
  {
    component: AdminSettings,
    meta: {
      // requiresAuth: true,
    },
    name: 'AdminSettings',
    path: '/adminpanel',
  },
  {
    component: Analytics,
    meta: {
      // requiresAuth: true,
    },
    name: 'Analytics',
    path: '/analytics',
  },
  {
    component: Todos,
    meta: {
      // requiresAuth: true,
    },
    name: 'Todos',
    path: '/todos',
  },
  {
    component: Notifications,
    meta: {
      // requiresAuth: true,
    },
    name: 'Notifications',
    path: '/notifications',
  },
  {
    component: Calendar,
    meta: {
      // requiresAuth: true,
    },
    name: 'Calendar',
    path: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
