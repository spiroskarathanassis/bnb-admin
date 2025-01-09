import moment from 'moment';

import { Locales, MonthName } from '@/enums';

export const isMonthBefore = (monthName1: MonthName, monthName2: MonthName) => {
  const date1 = moment(monthName1, 'MMMM'); // Parse month name
  const date2 = moment(monthName2, 'MMMM');
  return date1.isBefore(date2, 'month');
};

export const currentMonthName = () => {
  // Can be replaced by moment.js
  const monthIndex = new Date().getMonth();
  return Object.values(MonthName)[monthIndex];
};

// Use this one for mapping months from English to Greek
export const getLocaleMonthName = (
  englishMonthName: MonthName,
  locale: Locales = Locales.EN
) => {
  const localMonthMapper: Record<Locales, MonthName> = {
    [Locales.EN]: englishMonthName,
  };
  const localMonth = localMonthMapper[locale] ?? englishMonthName;
  return localMonth;
};
