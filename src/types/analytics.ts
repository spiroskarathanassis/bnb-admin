import { MonthName, Platform } from '@/enums';

type AnalyticsRevenue = number;

export interface PlatformAnalytics {
  price: number;
  total_days: number;
}

export interface AnnualMonthlyAnalyticsByPlatform {
  [year: number]: {
    [month in MonthName]: {
      [platform in Platform]: PlatformAnalytics;
    };
  };
}

export interface AnnualPlatformAnalyticsByMonth {
  [year: number]: {
    [platform in Platform]: {
      [monthIndex: number]: AnalyticsRevenue;
    };
  };
}
