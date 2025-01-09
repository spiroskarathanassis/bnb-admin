import moment from 'moment';

import { MonthName } from '@/enums';

const getMonthIndex = (monthName: MonthName): number => {
  // if (moment.months().includes(monthName)) return;

  const monthIndex = moment().month(monthName).format('M');
  return parseInt(monthIndex, 10);
};

export default getMonthIndex;
