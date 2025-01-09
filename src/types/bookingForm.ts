import { BookingType, ClientType } from './bookingType';

export interface BookingFormType extends Omit<BookingType, 'year'> {
  checkinTime: string;
  checkoutTime: string;
  keybox: {
    first_code: string;
    second_code: string;
  };
  client_info: ClientType;
}
