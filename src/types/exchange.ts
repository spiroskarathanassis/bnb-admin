import { MonthName, PeriodName } from '@/enums';
import { AppUser } from '@/types/config';

export enum ExchangeInvestors {
  SELECT_ALL = 'All',
}

export interface InvestorDetails {
  consumerId: AppUser['userId'];
  consumerName?: string;
  balance: number;
  spent: number;
  income?: number;
}

export interface TransactionType {
  senderId: AppUser['userId'];
  receiverId: AppUser['userId'];
  price: number;
  month: MonthName;
  year: number;
  notes: string;
}

export interface BillType {
  payer: AppUser['userId'] | ExchangeInvestors.SELECT_ALL;
  description: string;
  month: MonthName;
  notes: string;
  price: number;
  year: number;
}

export interface PurchaseType {
  purchaser: AppUser['userId'] | ExchangeInvestors.SELECT_ALL;
  description: string;
  month: PeriodName;
  notes: string;
  price: number;
  year: number;
}

export interface RevenueType {
  description: string;
  from: string;
  month: MonthName;
  notes: string;
  price: number;
  year: number;
}

export type ExchangeItem = (TransactionType | BillType | PurchaseType) & {
  isPrev: boolean;
};

export interface ExchangeNotesPreview {
  title: string;
  text: string;
}
