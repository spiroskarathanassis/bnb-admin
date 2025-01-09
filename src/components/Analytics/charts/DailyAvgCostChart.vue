<script setup lang="ts">
import { Chart, registerables } from 'chart.js';
import { computed } from 'vue';
import { LineChart, useLineChart } from 'vue-chart-3';

import { platformColors } from '@/constants/appTheme';
import { Platform } from '@/enums';
import { useBookingsStore } from '@/stores';
import adjPlatformBookings from '@/utils/analytics/adjPlatformBookings';
import mapRevenueBookings from '@/utils/analytics/mapRevenueBookings';
import labelingString from '@/utils/labelingString';

Chart.register(...registerables);

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const chartBgColors: Record<Platform, string> = {
  [Platform.AIRBNB]: platformColors.bg.airbnb,
  [Platform.BOOKING]: platformColors.bg.booking,
  [Platform.PRIVATE]: platformColors.bg.private,
  [Platform.WEBSITE]: platformColors.bg.website,
};

const props = defineProps<{
  year: number;
  isClientPaid?: boolean;
}>();

const bookingsStore = useBookingsStore();

const chartDailyCost = computed(() => {
  const yearlyData = mapPlatformBookings.value[props.year];

  return Object.entries(yearlyData).map(([platform, monthlyData]) => {
    return {
      backgroundColor: chartBgColors[platform as unknown as Platform],
      borderColor: chartBgColors[platform as unknown as Platform],
      data: monthlyData,
      label: labelingString(platform),
      // lineTension: 0.4,
    };
  });
});

const mapPlatformBookings = computed(() => {
  const spreadBookings = mapRevenueBookings(bookingsStore.bookings);
  const adjBookings = adjPlatformBookings(spreadBookings, props.isClientPaid);

  return adjBookings;
});

const chartData = computed(() => ({
  datasets: chartDailyCost.value,
  labels: MONTH_LABELS,
  options: {
    skipNull: true,
  },
}));

const { lineChartProps } = useLineChart({
  chartData,
});
</script>

<template>
  <LineChart v-bind="lineChartProps" :height="250" />
</template>
