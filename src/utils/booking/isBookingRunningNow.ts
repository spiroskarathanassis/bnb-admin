import moment from 'moment';

const isBookingRunningNow = (checkin: string, checkout: string): boolean => {
  const currentDate = moment();
  const checkinMoment = moment(checkin, 'YYYY-MM-DD');
  const checkoutMoment = moment(checkout, 'YYYY-MM-DD');

  return currentDate.isBetween(checkinMoment, checkoutMoment, null, '[]');
};

export default isBookingRunningNow;
