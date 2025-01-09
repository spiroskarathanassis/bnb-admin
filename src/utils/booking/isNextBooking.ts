import moment from 'moment';

const isNextBooking = ({ checkin }: { checkin: string }): boolean => {
  const currentDate = moment();
  const checkinMoment = moment(checkin, 'YYYY-MM-DD');

  return checkinMoment.isSameOrAfter(currentDate, 'day');
};

export default isNextBooking;
