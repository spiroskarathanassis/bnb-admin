export type YYYY_MM_DD = string; // '2024-11-21'

export type DbTypeWithKey<T> = T & { key: string };

export interface AlertType {
  message: string;
  type?: string;
}

export interface StoreUser {
  email: string;
  // lang: Locales;
}
