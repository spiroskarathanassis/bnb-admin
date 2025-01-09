<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue';
import CountUp from 'vue-countup-v3';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import ExchangeInvestorCard from '@/components/Exchange/ExchangeInvestorCard/ExchangeInvestorCard.vue';
import DirectionButtons from '@/components/layout/DirectionButtons.vue';
import useExchangeInvestorTotals from '@/composables/useExchangeInvestorTotals';
import { useBookingsStore, useExchangeStore, useUserFeatures } from '@/stores';
import { AppUser, InvestorDetails } from '@/types';

const EXCHANGE_FIELDS = [
  { routeName: 'Purchases', translationPath: 'routes.exchange_purchases' },
  {
    routeName: 'Transactions',
    translationPath: 'routes.exchange_transactions',
  },
  { routeName: 'Bills', translationPath: 'routes.exchange_bills' },
  { routeName: 'Revenue', translationPath: 'routes.exchange_revenue' },
];

const { t } = useI18n();
const route = useRoute();

const exchangeStore = useExchangeStore();
const bookingsStore = useBookingsStore();
const userFeatures = useUserFeatures();

const { investTotals } = useExchangeInvestorTotals();

const isHidingZeroBalanceInvenstors = ref(true);

const bookInvestors = ref<InvestorDetails[]>([]);

const exchangeUserIds = computed<number[]>(() =>
  userFeatures.exchangeUsers.map((user: AppUser) => user.userId)
);

const areInverstorsSwiped = computed(() => bookInvestors.value.length > 2);
const shouldEnableArrowButtons = computed(() => areInverstorsSwiped.value);

const investSummary = computed(() => investTotals.value.summary ?? '0');

// left or right move
const shiftBoxes = (isLeftMove = false) => {
  let removedElement;
  if (isLeftMove) {
    removedElement = bookInvestors.value.pop();
    if (removedElement) bookInvestors.value.unshift(removedElement);
  } else {
    removedElement = bookInvestors.value.shift();
    if (removedElement) bookInvestors.value.push(removedElement);
  }
};

const setInvestorBoxActive = (investorId: number, index: number) => {
  const boxesHaveSwippingMove =
    !areInverstorsSwiped && window.innerWidth <= 640;

  if (index === 1 || !boxesHaveSwippingMove) {
    exchangeStore.SELECT_CARD_PERSON(investorId);
  }
};

watchEffect(
  () => {
    bookInvestors.value = investTotals.value.investors.filter((inv) => {
      return isHidingZeroBalanceInvenstors.value &&
        !exchangeUserIds.value.includes(inv.consumerId)
        ? Math.abs(inv.balance) > 0
        : true;
    });
  },
  { flush: 'post' }
);

onMounted(async () => {
  try {
    if (!exchangeStore.isExchangeRequested) {
      await exchangeStore.fetchExchange();
    }
    await bookingsStore.requestBookings();
  } catch (e) {
    console.log(e);
  }
});
</script>

<template>
  <PageTitle>
    <div class="tw-flex tw-flex-col tw-items-center tw-gap-4">
      <span>
        {{ t('exchange_page.total_expenses') }}
      </span>
      <CountUp
        :end-val="investSummary"
        :options="{ suffix: ' €', decimalPlaces: 2 }"
        class="tw-text-xl tw-leading-10 tw-text-black8 tw-font-semibold"
      />
    </div>
  </PageTitle>

  <PageSection v-if="investSummary" class="tw-gap-2">
    <div
      :class="[
        'tw-relative tw-w-full tw-flex tw-flex-wrap tw-justify-evenly tw-items-stretch tw-min-h-[200px] tw-mb-8',
        areInverstorsSwiped && 'max-sm:tw-relative max-sm:tw-h-[170px]',
      ]"
    >
      <ExchangeInvestorCard
        v-for="(investor, index) in bookInvestors"
        :id="investor.consumerId"
        :key="investor.consumerId"
        :admins="exchangeUserIds"
        :investor="investor"
        :class="[
          'sm:tw-my-4 max-sm:tw-h-full sm:hover:tw-translate-y-1',
          {
            'max-sm:tw-translate-x-[-80px] max-sm:tw-blur-[2px]':
              index === 0 && areInverstorsSwiped,
          },
          {
            'max-sm:tw-scale-110 max-sm:tw-bottom-0 max-sm:tw-z-10':
              index === 1 && areInverstorsSwiped,
          },
          {
            'max-sm:tw-translate-x-[80px] max-sm:tw-blur-[2px]':
              index === 2 && areInverstorsSwiped,
          },
          { 'tw-absolute sm:tw-static': areInverstorsSwiped },
        ]"
        @click="setInvestorBoxActive(investor.consumerId, index)"
      />

      <DirectionButtons
        v-if="shouldEnableArrowButtons"
        class="sm:tw-hidden"
        @left="shiftBoxes(true)"
        @right="shiftBoxes(false)"
      />
    </div>

    <!-- Exchange entities -->
    <div class="tw-w-full tw-grid tw-grid-cols-[repeat(2,50%)]">
      <router-link
        v-for="entity in EXCHANGE_FIELDS"
        :key="entity.routeName"
        :to="{ name: entity.routeName }"
        :class="[
          'tw-border-none tw-rounded tw-text-sm tw-py-2 tw-px-4 tw-m-1 tw-no-underline tw-text-center tw-truncate',
          route.name === entity.routeName
            ? 'tw-cursor-default tw-bg-primary tw-text-white'
            : 'tw-bg-white tw-text-primary hover:tw-bg-primary/5',
        ]"
      >
        <span class="tw-truncate">
          {{ t(entity.translationPath) }}
        </span>
      </router-link>
    </div>

    <router-view />
  </PageSection>
</template>
