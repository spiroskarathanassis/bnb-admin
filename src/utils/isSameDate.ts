import moment from 'moment';

const isSameDate = (eventLastDate: Date, calendarDate: Date): boolean => {
  const evDate = moment(eventLastDate);
  const calDate = moment(calendarDate);

  return evDate.isSame(calDate, 'day');
};

export default isSameDate;
