<script setup lang="ts">
import { Chart, registerables } from 'chart.js';
import { computed } from 'vue';
import { BarChart, useBarChart } from 'vue-chart-3';

import { useExchangeRevenuesStore } from '@/stores';
import { RevenueType } from '@/types';
import { PROPERTY_STARTING_YEAR } from '@/utils/constants';
import getMonthIndex from '@/utils/getMonthIndex';

interface SortedAnnualRevenue {
  [year: string]: {
    [mnth: string]: RevenueType[];
  };
}

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
const chartBarColors = [
  '#77CEFF',
  '#0079AF',
  '#123E6B',
  '#97B0C4',
  '#A5C8ED',
  '#C403f0',
];

const revenuesStore = useExchangeRevenuesStore();

const totalRevenueBookings = computed<RevenueType[]>(
  () => revenuesStore.totalRevenueBookings
);

const revenueSortedByMonth = computed(() => {
  const categorizedItems: SortedAnnualRevenue = {};

  totalRevenueBookings.value.forEach((el) => {
    const itemYear = String(el.year ?? PROPERTY_STARTING_YEAR);
    const month = el.month;

    if (!categorizedItems[itemYear]) {
      categorizedItems[itemYear] = {};
    }
    if (!categorizedItems[itemYear][month]) {
      categorizedItems[itemYear][month] = [];
    }

    categorizedItems[itemYear][month].push(el);
  });

  const finallySorted = Object.entries(categorizedItems).sort(
    (prevYear, nextYear) => parseInt(nextYear[0]) - parseInt(prevYear[0])
  );

  return finallySorted;
});

const chartRevenue = computed(() =>
  revenueSortedByMonth.value.map(([year, monthData], index) => {
    const revenueData = Array(12).fill(0);

    Object.values(monthData).forEach((revenues) => {
      let monthPrice = 0;

      revenues.forEach((pltf) => {
        monthPrice += +pltf.price;
      });

      if (monthPrice > 0) {
        const currMonthIndex = getMonthIndex(revenues[0].month);
        revenueData[currMonthIndex] = monthPrice;
      }
    });

    return {
      backgroundColor: chartBarColors[index],
      data: revenueData,
      label: year,
    };
  })
);

const chartData = computed(() => ({
  datasets: chartRevenue.value,
  labels: MONTH_LABELS,
}));

const { barChartProps } = useBarChart({
  chartData,
});
</script>

<template>
  <BarChart v-bind="barChartProps" :height="250" />
</template>
