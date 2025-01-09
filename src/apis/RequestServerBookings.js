import { ServerApiRequest } from './ServerApiRequest';

export class RequestServerBookings extends ServerApiRequest {
  static bookingConfirmation = ({ bookId }) => {
    const requestPath = `booking/${bookId}/confirm`;
    return super.UPDATE(requestPath);
  };

  static bookingRejection = ({ bookId, params }) => {
    const requestPath = `booking/${bookId}/reject`;
    return super.UPDATE(requestPath, params);
  };

  static bookingCheckinReminder = ({ bookId }) => {
    const requestPath = `booking/${bookId}/reminder/checkin`;
    return super.POST(requestPath);
  };

  static bookingCheckoutReminder = ({ bookId }) => {
    const requestPath = `booking/${bookId}/reminder/checkout`;
    return super.POST(requestPath);
  };
}
