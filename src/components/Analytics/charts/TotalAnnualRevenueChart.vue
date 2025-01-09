<script setup lang="ts">
import { Chart, registerables } from 'chart.js';
import { computed } from 'vue';
import { BarChart, useBarChart } from 'vue-chart-3';

import { useBookingsStore } from '@/stores';
import { BookingType, DbTypeWithKey } from '@/types';

interface TotalAnnualRevenue {
  [year: string]: number;
}

Chart.register(...registerables);

const chartBarColors = [
  '#77CEFF',
  '#0079AF',
  '#123E6B',
  '#97B0C4',
  '#A5C8ED',
  '#C403f0',
];

const bookingsStore = useBookingsStore();

const bookings = computed<DbTypeWithKey<BookingType>[]>(
  () => bookingsStore.bookings
);

const revenueSortedByYear = computed(() => {
  const categorizedItems: TotalAnnualRevenue = {};

  bookings.value.forEach((el: BookingType) => {
    const itemYear = String(el.year);

    if (!categorizedItems[itemYear]) {
      categorizedItems[itemYear] = 0;
    }

    categorizedItems[itemYear] += el.price;
  });

  const finallySorted = Object.entries(categorizedItems).sort(
    (prevYear, nextYear) => parseInt(nextYear[0]) - parseInt(prevYear[0])
  );

  return finallySorted;
});

const chartRevenue = computed(() => {
  const annualRevenueDataset: TotalAnnualRevenue = {};

  revenueSortedByYear.value.forEach(([year, price]: [string, number]) => {
    annualRevenueDataset[year] = +price.toFixed(2);
  });

  return [
    {
      backgroundColor: chartBarColors[0],
      data: annualRevenueDataset,
      label: '',
    },
  ];
});

const chartData = computed(() => ({
  datasets: chartRevenue.value,
}));

const { barChartProps } = useBarChart({
  chartData,
});
</script>

<template>
  <BarChart v-bind="barChartProps" :height="250" />
</template>
