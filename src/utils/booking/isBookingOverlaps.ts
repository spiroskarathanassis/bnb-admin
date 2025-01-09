import axios from 'axios';

import { BookingType } from '@/types';

const serverApi: string = import.meta.env.VITE_SERVER_API;

const isBookingOverlaps = async (
  currBooking: BookingType
): Promise<boolean> => {
  const { data } = await axios.get(`${serverApi}/booking_availability`, {
    params: {
      apartmentId: 1,
      checkin: currBooking.checkin,
      checkout: currBooking.checkout,
      guests:
        currBooking.guests.adults +
        (currBooking.guests.children ?? 0) +
        (currBooking.guests.infants ?? 0),
      isAdmin: true,
    },
  });

  return !data.availability;
};

export default isBookingOverlaps;
