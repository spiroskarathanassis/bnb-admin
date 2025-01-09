import { Platform } from '@/enums';

export const platformStyles: Record<Platform, string> = {
  [Platform.AIRBNB]: 'tw-bg-platform-bg-airbnb tw-text-platform-text-airbnb',
  [Platform.BOOKING]: 'tw-bg-platform-bg-booking tw-text-platform-text-booking',
  [Platform.PRIVATE]: 'tw-bg-platform-bg-private tw-text-platform-text-private',
  [Platform.WEBSITE]: 'tw-bg-platform-bg-website tw-text-platform-text-website',
};
