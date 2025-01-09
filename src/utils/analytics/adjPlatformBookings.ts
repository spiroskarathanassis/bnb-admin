import { MonthName, Platform } from '@/enums';
import {
  AnnualMonthlyAnalyticsByPlatform,
  AnnualPlatformAnalyticsByMonth,
} from '@/types';
import getMonthIndex from '@/utils/getMonthIndex';

import { PROPERTY_STARTING_YEAR } from '../constants';

const tax: { [key: string]: number } = {
  [Platform.PRIVATE]: 0,
  [Platform.AIRBNB]: 0.15, // 15%
  [Platform.BOOKING]: 0.2, // 20% (includes ads)
  [Platform.WEBSITE]: 0,
};

const isFutureMonth = (year: number, monthIndex: number): boolean => {
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  if (year < currentYear) return false;

  const currentMonthIndex = currentDate.getMonth();
  if (monthIndex <= currentMonthIndex) return false;

  return true;
};

const adjPlatformBookings = (
  bookings: AnnualMonthlyAnalyticsByPlatform,
  isClientPaid: boolean
): AnnualPlatformAnalyticsByMonth => {
  const annualBookings: AnnualPlatformAnalyticsByMonth = {};

  // Initialize
  const currentYear = new Date().getFullYear();

  for (let year = PROPERTY_STARTING_YEAR; year <= currentYear; year++) {
    annualBookings[year] = {
      [Platform.AIRBNB]: Array(12)
        .fill(0)
        .map((mnth, idx) => (!isFutureMonth(year, idx) ? mnth : null)),
      [Platform.BOOKING]: Array(12)
        .fill(0)
        .map((mnth, idx) => (!isFutureMonth(year, idx) ? mnth : null)),
      [Platform.PRIVATE]: Array(12)
        .fill(0)
        .map((mnth, idx) => (!isFutureMonth(year, idx) ? mnth : null)),
      [Platform.WEBSITE]: Array(12)
        .fill(0)
        .map((mnth, idx) => (!isFutureMonth(year, idx) ? mnth : null)),
    };
  }

  Object.keys(bookings).forEach((currYear) => {
    const year = +currYear;

    Object.keys(bookings[year]).forEach((currMonth) => {
      const month = currMonth as MonthName;
      const monthIndex = getMonthIndex(month);

      (Object.keys(bookings[year][month]) as Platform[]).forEach((platf) => {
        const { price, total_days } = bookings[year][month][platf];

        if (total_days > 0) {
          const revenuePrice = +(price / total_days).toFixed(2);
          const avgPrice = +(revenuePrice / (1 - tax[platf])).toFixed(2);

          annualBookings[year][platf][monthIndex] = isClientPaid
            ? avgPrice
            : revenuePrice;
        }
      });
    });
  });

  return annualBookings;
};

export default adjPlatformBookings;
