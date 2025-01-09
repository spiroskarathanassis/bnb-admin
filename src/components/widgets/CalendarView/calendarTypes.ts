import { Platform } from '@/enums';

export enum CalendarEventType {
  BOOKING = 'BOOKING',
  UNAVAILABLE = 'UNAVAILABLE',
}

export interface BookEvent {
  platform: Platform;
  platformStyleClasses?: string;
  totalGuests: number;
}

export interface CalendarEvent {
  eventType: CalendarEventType;
  bookEvent?: BookEvent;
  end: Date;
  price?: number;
  start: Date;
  title?: string;
}
export type RequiredCalendarBookEvent = CalendarEvent &
  Required<Pick<CalendarEvent, 'bookEvent'>>;

export interface Cell {
  formattedDate: string;
  endDate: string;
  content: string;
  today: boolean;
  outOfScope: boolean;
}
