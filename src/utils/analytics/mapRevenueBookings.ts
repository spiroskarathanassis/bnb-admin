import moment from 'moment';

import { MonthName } from '@/enums';
import { AnnualMonthlyAnalyticsByPlatform, BookingType } from '@/types';
import { isNextBooking } from '@/utils/booking';
import getMonthIndex from '@/utils/getMonthIndex';

import { PROPERTY_STARTING_YEAR } from '../constants';

const mapRevenueBookings = (
  bookings: BookingType[]
): AnnualMonthlyAnalyticsByPlatform => {
  let monthBookings: AnnualMonthlyAnalyticsByPlatform = {};

  bookings
    .filter((currBook) => {
      const isPriceApproved = !!currBook.is_booking_closed;
      const isPreviousBooking = !isNextBooking(currBook);

      return isPriceApproved && isPreviousBooking;
    })
    .forEach((book) => {
      const platform = book.platform;
      const currYear = book.year ?? PROPERTY_STARTING_YEAR;
      const checkinMonthName = moment(book.checkin).format('MMMM') as MonthName;
      const checkoutMonthName = moment(book.checkout).format(
        'MMMM'
      ) as MonthName;
      const checkinDate = moment(book.checkin, 'YYYY-MM-DD');
      const checkoutDate = moment(book.checkout, 'YYYY-MM-DD');

      const currPlatfPrice =
        monthBookings?.[currYear]?.[checkinMonthName]?.[platform]?.price ?? 0;
      const currPlatfTotalDays =
        monthBookings?.[currYear]?.[checkinMonthName]?.[platform]?.total_days ??
        0;
      const priceToAdd = +book.price;
      const totalPrice = currPlatfPrice + priceToAdd;

      const totalDays = checkoutDate.diff(checkinDate, 'days');
      const isSameMonth = checkinDate.isSame(checkoutDate, 'month');
      const isSameYear = checkinDate.isSame(checkoutDate, 'year');

      const spreadMonths = [
        {
          month: checkinMonthName,
          price: totalPrice,
          total_days: currPlatfTotalDays + totalDays,
        },
      ];

      // if booking covers next month dates
      if (priceToAdd > 0 && !isSameMonth) {
        const checkinMonthLastDayNumber = new Date(
          book.year,
          getMonthIndex(checkoutMonthName),
          0
        ).getDate();

        const checkinDateIndex = parseInt(checkinDate.format('DD'), 10);
        const checkoutDateIndex = parseInt(checkoutDate.format('DD'), 10);

        const checkinMonthDays =
          checkinMonthLastDayNumber - checkinDateIndex + 1;
        const checkoutMonthDays = checkoutDateIndex - 1;

        const totalBookDays = checkinMonthDays + checkoutMonthDays;
        const avgBookDayPrice = priceToAdd / totalBookDays;

        const checkinMonthPrice = checkinMonthDays * avgBookDayPrice;
        const checkoutMonthPrice = checkoutMonthDays * avgBookDayPrice;

        spreadMonths[0] = {
          month: checkinMonthName,
          price: +(currPlatfPrice + checkinMonthPrice).toFixed(2),
          total_days: currPlatfTotalDays + checkinMonthDays,
        };

        const checkoutPlatfPreviousPrice =
          monthBookings?.[currYear]?.[checkoutMonthName]?.[platform]?.price ??
          0;
        const checkoutPlatfTotalDays =
          monthBookings?.[currYear]?.[checkoutMonthName]?.[platform]
            ?.total_days ?? 0;

        spreadMonths.push({
          month: checkoutMonthName,
          price: +(checkoutPlatfPreviousPrice + checkoutMonthPrice).toFixed(2),
          total_days: checkoutPlatfTotalDays + checkoutMonthDays,
        });
      }

      spreadMonths.forEach((spreadBook) => {
        const spreadYear = isSameYear ? currYear : currYear + 1;

        monthBookings = {
          ...monthBookings,
          [spreadYear]: {
            ...(monthBookings[spreadYear] || {}),
            [spreadBook.month]: {
              ...monthBookings[spreadYear]?.[spreadBook.month],
              [platform]: {
                price: spreadBook.price,
                total_days: spreadBook.total_days,
              },
            },
          },
        };
      });
    });

  return monthBookings;
};

export default mapRevenueBookings;
