import moment from 'moment';
import { useI18n } from 'vue-i18n';

import { Locales, MonthName } from '@/enums';
import { getLocaleMonthName } from '@/utils/months';

interface BookingDates {
  checkin: string;
  checkout: string;
}

const useBookingTitle = () => {
  const { locale } = useI18n();

  const formatBookingTitle = ({ checkin, checkout }: BookingDates): string => {
    const checkinMoment = moment(checkin);
    const checkoutMoment = moment(checkout);
    const checkinMonth = checkinMoment.format('MMMM') as MonthName;
    const checkinDate = checkinMoment.format('DD');
    // const checkoutMonth = checkoutMoment.format("MMMM");
    const checkoutDate = checkoutMoment.format('DD');

    // if (checkinMonth !== checkoutMonth) {
    //   return `${checkinMonth} ${checkinDate} - ${checkoutMonth} ${checkoutDate}`;
    // }

    const greekMonth = getLocaleMonthName(
      checkinMonth,
      locale.value as Locales
    );
    return `${greekMonth} ${checkinDate}-${checkoutDate}`;
  };

  return { formatBookingTitle };
};

export default useBookingTitle;
