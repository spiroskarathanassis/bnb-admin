import { Locales } from '@/enums';
import { YYYY_MM_DD } from '@/types';

export type UnavailableDate = YYYY_MM_DD | { from: YYYY_MM_DD; to: YYYY_MM_DD };

export interface SpecialPrice {
  from: YYYY_MM_DD;
  price: number;
  to: YYYY_MM_DD;
}

export interface AppUser {
  email: string;
  first_name: string;
  last_name: string;
  short_name: string;
  is_admin: boolean;
  lang: Locales;
  userId: number;
  is_app_owner?: boolean;
}
