import { StandardRequest } from './StandardRequest';

export class RequestCalendarDates extends StandardRequest {
  static getCalendarDates = (params = null) => {
    const requestPath = `calendar_dates.json`;
    return super.GET(requestPath, params);
  };

  static updateCalendarDates = (data) => {
    const requestPath = `calendar_dates.json`;
    return super.UPDATE(requestPath, data);
  };
}
