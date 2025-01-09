<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import DailyAvgCostChart from '@/components/Analytics/charts/DailyAvgCostChart.vue';
import RevenueChart from '@/components/Analytics/charts/RevenueChart.vue';
import TotalAnnualRevenueChart from '@/components/Analytics/charts/TotalAnnualRevenueChart.vue';
import ChartWrapper from '@/components/Analytics/ChartWrapper.vue';
import { SelectYear } from '@/components/common';
import { useBookingsStore } from '@/stores';

const { t } = useI18n();
const bookingsStore = useBookingsStore();

const selectedDailyAvgCostYear = ref(new Date().getFullYear());
const selectedDailyAvgPaidYear = ref(new Date().getFullYear());

const hasBookings = computed(() => bookingsStore.bookings.length !== 0);

onMounted(async () => {
  await bookingsStore.requestBookings();
});
</script>

<template>
  <PageTitle>
    {{ t('routes.analytics') }}
  </PageTitle>

  <PageSection class="tw-gap-4">
    <ChartWrapper v-if="hasBookings">
      <template #title>
        {{ t('analytics_page.total_annual_revenue') }}
      </template>
      <TotalAnnualRevenueChart />
    </ChartWrapper>

    <ChartWrapper v-if="hasBookings">
      <template #title>
        {{ t('analytics_page.monthly_revenue_per_year') }}
      </template>
      <RevenueChart />
    </ChartWrapper>

    <ChartWrapper v-if="hasBookings">
      <template #title>
        <span>
          {{ t('analytics_page.avg_daily_profit_per_platform') }}
        </span>
        <SelectYear v-model="selectedDailyAvgCostYear" />
      </template>
      <DailyAvgCostChart :year="selectedDailyAvgCostYear" />
    </ChartWrapper>

    <ChartWrapper v-if="hasBookings">
      <template #title>
        <span>
          {{ t('analytics_page.avg_client_paid_per_platform') }}
        </span>
        <SelectYear v-model="selectedDailyAvgCostYear" />
      </template>
      <DailyAvgCostChart :year="selectedDailyAvgPaidYear" isClientPaid />
    </ChartWrapper>
  </PageSection>
</template>
