import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { Locales, MonthName, PeriodName } from '@/enums';
import { FilterMonthOption, FilterPeriodOption } from '@/types';
import { getLocaleMonthName } from '@/utils/months';
import { getPeriodTranslation } from '@/utils/periods';

const useFilterOptions = () => {
  const { locale } = useI18n();

  const localeMonths = computed<FilterMonthOption[]>(() =>
    Object.values(MonthName).map((month) => ({
      label: getLocaleMonthName(month as MonthName, locale.value as Locales),
      value: month,
    }))
  );

  const localePeriods = computed<FilterPeriodOption[]>(() =>
    Object.values(PeriodName).map((period) => ({
      label: getPeriodTranslation(
        period as PeriodName,
        locale.value as Locales
      ),
      value: period,
    }))
  );

  return {
    localeMonths,
    localePeriods,
  };
};

export default useFilterOptions;
