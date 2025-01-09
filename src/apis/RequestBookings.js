import { StandardRequest } from './StandardRequest';

export class RequestBookings extends StandardRequest {
  static getBookings = (params = null) => {
    const requestPath = `bookings.json`;
    return super.GET(requestPath, params);
  };

  static addNewBooking = (payload) => {
    const requestPath = `bookings.json`;
    return super.POST(requestPath, payload);
  };

  static updateBooking = ({ data, bookId }) => {
    const requestPath = `bookings/${bookId}.json`;
    return super.UPDATE(requestPath, data);
  };

  static deleteBooking = ({ bookId }) => {
    const requestPath = `bookings/${bookId}.json`;
    return super.DELETE(requestPath);
  };
}
