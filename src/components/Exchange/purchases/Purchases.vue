<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { ClearFilterBtn, SelectPeriod, SelectYear } from '@/components/common';
import LineItemsWrapper from '@/components/common/LineItem/LineItemsWrapper.vue';
import { PeriodName } from '@/enums';
import {
  useExchangePurchasesStore,
  useExchangeStore,
  useUserFeatures,
} from '@/stores';
import { DbTypeWithKey, ExchangeInvestors, PurchaseType } from '@/types';
import { PROPERTY_STARTING_YEAR } from '@/utils/constants';

import AddNewPurchase from './AddNewPurchase.vue';
import PurchaseCard from './PurchaseCard.vue';

const { t } = useI18n();
const purchasesStore = useExchangePurchasesStore();
const exchangeStore = useExchangeStore();
const userFeatures = useUserFeatures();

const selectedPeriod = ref<PeriodName | null>(null);
const selectedYear = ref(new Date().getFullYear());
const isNewItemFieldOpened = ref(false);

const purchases = computed<DbTypeWithKey<PurchaseType>[]>(
  () => purchasesStore.purchases
);

// Filters
const selectedCardPerson = computed(() => exchangeStore.selectedCardPerson);

const selectedItems = computed(() => {
  return purchases.value
    .filter((item) => {
      const year = +item.year || PROPERTY_STARTING_YEAR;
      if (selectedYear.value !== year) return;

      if (selectedPeriod.value) {
        const isMonthMatching = selectedPeriod.value === item.month;
        if (!isMonthMatching) return;
      }

      if (selectedCardPerson.value) {
        const isPersonMatching = selectedCardPerson.value == item.purchaser;
        return isPersonMatching;
      }

      return true;
    })
    .sort((prevItem, nextItem) => {
      const periods = Object.values(PeriodName);

      // periods
      return periods.indexOf(nextItem.month) - periods.indexOf(prevItem.month);
    });
});

interface PurchaseItemsByMonth {
  [period: string]: (DbTypeWithKey<PurchaseType> & {
    purchaserName: string;
  })[];
}

const purchasesSortedByMonth = computed(() => {
  const categorizedItems: PurchaseItemsByMonth = {};

  selectedItems.value.forEach((el) => {
    if (!categorizedItems?.[el.month]) {
      categorizedItems[el.month] = [];
    }

    const purchaserDetails = userFeatures.appUsers.find(
      (user) => user.userId === el.purchaser
    );

    categorizedItems[el.month].push({
      ...el,
      purchaserName: purchaserDetails
        ? `${purchaserDetails.first_name} ${purchaserDetails.last_name}`
        : el.purchaser === ExchangeInvestors.SELECT_ALL
          ? ExchangeInvestors.SELECT_ALL
          : '',
    });
  });

  return categorizedItems;
});

const areFiltersEnabled = computed(() => {
  return selectedCardPerson.value || selectedPeriod.value;
});

const clearFilters = () => {
  exchangeStore.SELECT_CARD_PERSON();
  selectedPeriod.value = null;
};
</script>

<template>
  <!-- Filters -->
  <div
    class="tw-w-full tw-flex tw-justify-start tw-items-center tw-flex-wrap tw-gap-1 tw-my-4 tw-min-h-8 md:tw-min-h-10"
  >
    <ClearFilterBtn :isDisabled="!areFiltersEnabled" @clear="clearFilters" />
    <SelectPeriod v-model="selectedPeriod" />
    <SelectYear v-model="selectedYear" />
  </div>

  <div class="tw-w-full">
    <q-btn
      flat
      no-caps
      color="primary"
      icon-right="add"
      @click="isNewItemFieldOpened = true"
    >
      <span>{{ t('reuse.add_new') }}</span>
    </q-btn>
  </div>

  <LineItemsWrapper :lineItems="purchasesSortedByMonth">
    <template #perionName="{ lineItem }">
      {{ t(`reuse.periods.${lineItem[0].month}`) }}
    </template>

    <template #default="{ lineItem }">
      <PurchaseCard
        v-for="item in lineItem"
        :key="item.key"
        :purchase-item="item"
      />
    </template>
  </LineItemsWrapper>

  <AddNewPurchase
    v-if="isNewItemFieldOpened"
    @closeModal="isNewItemFieldOpened = false"
  />
</template>
