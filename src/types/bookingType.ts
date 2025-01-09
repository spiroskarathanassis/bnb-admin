import { BookingApprovalState, BookingPaymentStatus, Platform } from '@/enums';

export interface ClientType {
  mobile?: string;
  name: string;
  email: string;
}

export interface BookingGuests {
  adults: number;
  children?: number;
  infants?: number;
}

export interface BookingType {
  apartmentId?: number;
  approval_status: BookingApprovalState; // Host approval
  checkin: string;
  checkout: string;
  client_info: ClientType | null;
  guests: BookingGuests;
  id?: number | null;
  is_booking_closed?: boolean; // To close the editing of booking when hosts agree no further action is needed
  keybox?: {
    first_code: string;
    second_code: string;
  };
  message?: string; // client info
  notes?: string; // Admin - Host info
  payment_status: BookingPaymentStatus;
  people?: number;
  platform: Platform;
  price: number;
  stripeId?: string;
  year: number;

  // Extra db fields
  current?: boolean;
}
