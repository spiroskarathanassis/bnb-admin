import { MonthName, Platform } from '@/enums';
import { BookingType, RevenueType } from '@/types';

import mapRevenueBookings from './mapRevenueBookings';

const formatRevenueBookings = (bks: BookingType[]): RevenueType[] => {
  const monthBookings = mapRevenueBookings(bks);
  const adjustedBookings: RevenueType[] = [];

  Object.keys(monthBookings).forEach((yr) => {
    const year = +yr;

    Object.keys(monthBookings[year]).forEach((mnth) => {
      const month = mnth as MonthName;

      Object.entries(monthBookings[year][month]).forEach((monthEntries) => {
        const [platf, { price }] = monthEntries;
        adjustedBookings.push({
          description: 'Ενοικίαση',
          from: platf as Platform,
          month,
          notes: '',
          price: +price.toFixed(2),
          year: +year,
        });
      });
    });
  });

  return adjustedBookings;
};

export default formatRevenueBookings;
