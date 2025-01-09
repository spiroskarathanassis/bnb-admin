import { BookingType } from './bookingType';

export enum NotificationType {
  BOOKING = 'booking',
  PURCHASE = 'purchase',
  BILL = 'bill',
  TRANSACTION = 'transaction',
  TODO = 'todo',
}
export enum NotificationStatus {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
}
export type NotificationItem<Type extends NotificationType> =
  Type extends NotificationType.BOOKING ? BookingType : any;

export interface Noty<Type extends NotificationType = NotificationType> {
  type: Type;
  item: NotificationItem<Type>;
  prev_item?: NotificationItem<Type>;
  last_change: {
    email?: string;
    name?: string;
    timestamp: string; // ISOString
  };
  status: NotificationStatus;
  unread_by: string[]; // app users email
  key?: string;
}
