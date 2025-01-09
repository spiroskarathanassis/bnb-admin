import moment from 'moment';

import { BookingApprovalState, BookingPaymentStatus, Platform } from '@/enums';
import { BookingType } from '@/types';

const applyBookingInfo = (newData: Partial<BookingType>): BookingType => {
  return {
    checkin: newData.checkin ?? '',
    checkout: newData.checkout ?? '',
    client_info: {
      email: newData.client_info?.email ?? '',
      mobile: newData.client_info?.mobile ?? '',
      name: newData.client_info?.name ?? '',
    },
    guests: {
      adults: newData.guests?.adults ?? 2,
      children: newData.guests?.children ?? 0,
      infants: newData.guests?.infants ?? 0,
    },
    ...(newData.id ? { id: newData.id } : null),
    approval_status: newData.approval_status ?? BookingApprovalState.PENDING,
    is_booking_closed: newData.is_booking_closed || false,
    payment_status: newData.payment_status ?? BookingPaymentStatus.PENDING,
    ...(newData.keybox && { keybox: newData.keybox }),
    ...(newData.message ? { message: newData.message } : null), // user message from website
    notes: newData.notes,
    platform: newData.platform ?? Platform.PRIVATE,
    price: newData.price ?? 0,
    year: +moment(newData.checkin, 'YYYY-MM-DD').format('YYYY'),
  };
};

export default applyBookingInfo;
