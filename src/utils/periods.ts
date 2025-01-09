import { Locales, PeriodName } from '@/enums';

export const EL_PERIODS: Record<PeriodName, string> = {
  [PeriodName.JANUARY_MARCH]: 'Ιανουάριος - Μάρτιος',
  [PeriodName.APRIL_JUNE]: 'Απρίλιος - Ιούνιος',
  [PeriodName.JULY_SEPTEMBER]: 'Ιούλιος - Σεπτέμβριος',
  [PeriodName.OCTOBER_DECEMBER]: 'Οκτώβριος - Δεκέμβριος',
};
export const EN_PERIODS: Record<PeriodName, string> = {
  [PeriodName.JANUARY_MARCH]: 'January - March',
  [PeriodName.APRIL_JUNE]: 'April - June',
  [PeriodName.JULY_SEPTEMBER]: 'July - September',
  [PeriodName.OCTOBER_DECEMBER]: 'October - December',
};

export const PERIODS = {
  [Locales.EL]: { ...EL_PERIODS },
  [Locales.EN]: { ...EN_PERIODS },
};

export const getPeriodTranslation = (
  period: PeriodName,
  locale = Locales.EN
): string => {
  return PERIODS[locale]?.[period] ?? '';
};

export const getCurrentPeriod = (): PeriodName => {
  const month = new Date().getMonth();
  const periods = [
    PeriodName.JANUARY_MARCH,
    PeriodName.APRIL_JUNE,
    PeriodName.JULY_SEPTEMBER,
    PeriodName.OCTOBER_DECEMBER,
  ];

  return periods[Math.floor(month / 3)];
};
