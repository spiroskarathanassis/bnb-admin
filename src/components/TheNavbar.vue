<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { Locales } from '@/enums';
import { signOutAuth } from '@/firebase/actions.js';
import { useConfigStore, useNotificationsStore } from '@/stores';

import { NAVBAR_SECTIONS } from '../constants/navbarSections';

const router = useRouter();
const { t, locale } = useI18n();
const notificationsStore = useNotificationsStore();
const configStore = useConfigStore();

const isMenuOpened = ref(false);
const $q = useQuasar();

const totalUnreadNoties = computed<number>(
  () => notificationsStore.noties.length ?? 0
);

const isMobileOrTablet = computed(() => {
  return $q.screen.lt.md;
});

type NavbarSection = {
  name?: string;
  to: string;
  src: string;
} & (
  | { click: () => ReturnType<typeof router.push> }
  | { click: (e: Event) => void }
);

const sections = computed<NavbarSection[]>(() =>
  NAVBAR_SECTIONS.map((el) => {
    if (el.to !== 'language')
      return {
        ...el,
        click: () => router.push(`/${el.to}`),
      };

    // Language section
    const nextLocale = Locales.EN;

    return {
      ...el,
      click: (e: Event) => {
        e.preventDefault();
        e.stopPropagation();

        configStore.updateUserLang({ lang: nextLocale });
        locale.value = nextLocale;
      },
      name: `language.${nextLocale}`,
      to: '',
    };
  })
);
</script>

<template>
  <nav
    :class="[
      'tw-flex tw-justify-between tw-bg-white tw-sticky tw-top-0 tw-z-[999]',
      isMobileOrTablet ? 'tw-items-stretch tw-p-0' : 'tw-items-center tw-p-2',
      ,
    ]"
  >
    <div>
      <router-link to="/">
        <img src="@/assets/images/logo.svg" width="64" />
      </router-link>
    </div>

    <!-- Full screen -->
    <div
      v-if="!isMobileOrTablet"
      class="menu-options tw-flex tw-justify-center tw-items-center tw-z-[1]"
    >
      <router-link
        v-for="section in sections"
        :key="section.to"
        to=""
        class="tw-no-underline tw-text-black"
        @click="section.click"
      >
        <div
          class="tw-flex tw-flex-col tw-justify-between tw-items-center tw-gap-1 tw-p-2 tw-rounded tw-cursor-pointer hover:tw-bg-grannyWhite"
        >
          <div class="tw-relative tw-w-5 tw-h-5">
            <img :src="section.src" alt="" width="16" />
          </div>
          <span class="tw-font-semibold">{{
            t(`routes.${section.name ?? section.to}`)
          }}</span>
        </div>
      </router-link>
      <router-link
        v-if="totalUnreadNoties"
        to="/notifications"
        class="tw-no-underline tw-text-black"
      >
        <div
          class="tw-flex tw-flex-col tw-justify-between tw-items-center tw-gap-1 tw-p-2 tw-rounded tw-cursor-pointer hover:tw-bg-grannyWhite"
        >
          <div class="tw-relative tw-w-5 tw-h-5">
            <img
              src="@/assets/images/icons/notifications_24sp.svg"
              alt=""
              width="16"
            />
            <q-badge
              class="tw-absolute tw-translate-x-3 -tw-translate-y-3 tw-top-0 tw-right-0"
              color="secondary"
              rounded
              transparent
            >
              {{ totalUnreadNoties }}
            </q-badge>
          </div>
          <span class="tw-font-semibold">{{ t('routes.notifications') }}</span>
        </div>
      </router-link>
      <div>
        <div
          class="tw-flex tw-flex-col tw-justify-between tw-items-center tw-gap-1 tw-p-2 tw-rounded tw-cursor-pointer hover:tw-bg-grannyWhite"
          @click="signOutAuth"
        >
          <div class="tw-relative tw-w-5 tw-h-5">
            <img
              src="@/assets/images/icons/logout_black_24dp.svg"
              alt=""
              width="16"
            />
          </div>
          <span class="tw-font-semibold">{{ t('routes.logout') }}</span>
        </div>
      </div>
    </div>

    <!-- Small screen -->
    <div v-else class="tw-flex tw-justify-end tw-w-full">
      <div
        v-if="!isMenuOpened"
        class="tw-flex tw-justify-center tw-items-center tw-gap-2 tw-mx-4"
      >
        <router-link v-if="totalUnreadNoties" to="/notifications" class="">
          <div
            class="tw-flex tw-flex-col tw-justify-between tw-items-center tw-p-2 tw-rounded tw-cursor-pointer tw-bg-grannyWhite hover:tw-bg-primary"
          >
            <div class="tw-relative tw-w-4 tw-h-4">
              <img
                src="@/assets/images/icons/notifications_24sp.svg"
                alt=""
                width="16"
              />
              <q-badge
                class="tw-absolute tw-translate-x-3 -tw-translate-y-3 tw-top-0 tw-right-0"
                color="secondary"
                rounded
                transparent
              >
                {{ totalUnreadNoties }}
              </q-badge>
            </div>
          </div>
        </router-link>
        <div
          class="tw-flex tw-justify-center tw-items-center tw-rounded tw-p-2 tw-cursor-pointer tw-bg-grannyWhite hover:tw-bg-primary"
          @click="isMenuOpened = !isMenuOpened"
        >
          <img
            src="@/assets/images/icons/menu_black_24dp.svg"
            alt=""
            width="16"
          />
        </div>
      </div>
      <div
        v-if="isMenuOpened"
        class="tw-fixed tw-top-0 tw-w-full tw-h-[100vh] tw-bg-black8 tw-backdrop-blur-[2px] tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-1 tw-z-[10]"
      >
        <div
          class="tw-absolute tw-top-0 tw-right-0 tw-flex tw-justify-center tw-items-center tw-rounded tw-p-2 tw-m-4 tw-cursor-pointer tw-bg-white/20 hover:tw-bg-white"
          @click="isMenuOpened = !isMenuOpened"
        >
          <img
            src="@/assets/images/icons/close_black_24dp.svg"
            alt=""
            width="16"
          />
        </div>
        <router-link
          v-for="section in sections"
          :key="section.to"
          to=""
          class="tw-no-underline tw-text-black"
          @click="
            (e: Event) => {
              isMenuOpened = !isMenuOpened;
              section.click?.(e);
            }
          "
        >
          <div
            class="tw-flex tw-flex-col tw-justify-between tw-items-center tw-gap-1 tw-p-1.5 tw-text-white tw-cursor-pointer tw-border-b tw-border-transparent hover:tw-border-white"
          >
            <span>{{ t(`routes.${section.name ?? section.to}`) }}</span>
          </div>
        </router-link>
        <div>
          <div
            class="tw-flex tw-flex-col tw-justify-between tw-items-center tw-gap-1 tw-p-1.5 tw-text-white tw-cursor-pointer tw-border-b tw-border-transparent hover:tw-border-white"
            @click="signOutAuth"
          >
            <span>{{ t('routes.logout') }}</span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
