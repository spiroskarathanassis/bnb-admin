<script setup lang="ts">
import { computed } from 'vue';
import CountUp from 'vue-countup-v3';
import { useI18n } from 'vue-i18n';

import { useExchangeStore } from '@/stores/exchange';
import { AppUser, InvestorDetails } from '@/types';

defineProps<{
  investor: InvestorDetails;
  admins: AppUser['userId'][];
}>();

const { t } = useI18n();
const exchangeStore = useExchangeStore();

const selectedCardPerson = computed(() => exchangeStore.selectedCardPerson);
</script>

<template>
  <div
    class="tw-grid tw-grid-rows-[60px_auto] tw-rounded-3xl tw-overflow-hidden tw-min-w-[120px] tw-w-[150px] tw-min-h-[120px] tw-cursor-pointer tw-shadow-lg"
  >
    <div
      :class="[
        'tw-flex tw-justify-center tw-items-center tw-w-full tw-h-full tw-p-3',
        selectedCardPerson == investor.consumerId
          ? 'tw-bg-primary'
          : 'tw-bg-primary/70',
      ]"
    >
      <h3
        class="tw-text-lg tw-text-paleSpringBud tw-text-center tw-font-bold tw-line-clamp-1"
      >
        {{ investor.consumerName }}
      </h3>
    </div>

    <div
      class="tw-flex tw-flex-col tw-justify-start tw-items-center tw-py-2 tw-px-3 tw-bg-grannyWhite tw-text-secondary tw-text-xs"
    >
      <span>
        {{ t('exchange_page.person_expenses_card.balance') }}
      </span>
      <div class="tw-flex tw-justify-between tw-items-center tw-gap-2">
        <span>€</span>

        <CountUp
          :end-val="Math.abs(investor.balance).toFixed(2)"
          :options="{
            prefix: +investor.balance > 0 ? '-' : '+',
            decimalPlaces: 2,
          }"
          class="[&>span]:tw-text-xl tw-text-primary"
        />
      </div>

      <div
        class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-full"
      >
        <div
          class="tw-w-full tw-grid tw-grid-flow-col tw-justify-between tw-items-center tw-gap-0.5 tw-my-1 tw-text-xs tw-text-black"
        >
          <span class="tw-flex-1 tw-text-black7 tw-truncate">
            {{ t('exchange_page.person_expenses_card.spent') }}
          </span>
          <CountUp
            :end-val="Math.abs(investor?.spent ?? 0)"
            :options="{
              suffix: ' €',
              decimalPlaces: 2,
            }"
            class="[&>span]:tw-text-xs"
          />
        </div>

        <div
          v-if="admins.includes(investor.consumerId)"
          class="tw-w-full tw-grid tw-grid-flow-col tw-justify-between tw-items-center tw-gap-0.5 tw-my-1 tw-text-xs tw-text-black"
        >
          <span class="tw-flex-1 tw-text-black7 tw-truncate">
            {{ t('exchange_page.person_expenses_card.income') }}
          </span>
          <CountUp
            :end-val="Math.abs(investor?.income ?? 0)"
            :options="{ suffix: ' €', decimalPlaces: 2 }"
            class="[&>span]:tw-text-xs"
          />
        </div>
      </div>
    </div>
  </div>
</template>
