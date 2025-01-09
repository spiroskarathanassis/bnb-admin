import { computed, ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';

import { PropertySettingsTranslationsTypes } from '../components/widgets/CalendarView/propertySettingsTranslationsTypes';

export const useHppCalendarTranslations = (): {
  propertySettings: ComputedRef<Partial<PropertySettingsTranslationsTypes>>;
} => {
  const { t } = useI18n();

  const propertySettingsTranslations =
    computed<PropertySettingsTranslationsTypes>(() => ({
      availability: t('propertySettings.availability'),
      basePriceAppliesTo: t('propertySettings.basePriceAppliesTo'),
      checkin: t('propertySettings.checkin'),
      checkinCheckout: t('propertySettings.checkinCheckout'),
      checkout: t('propertySettings.checkout'),
      defineSpecialPrice: t('propertySettings.defineSpecialPrice'),
      extraPricePerPerson: t('propertySettings.extraPricePerPerson'),
      guests: t('propertySettings.guests'),
      markedAsUnavailable: t('propertySettings.markedAsUnavailable'),
      maxGuests: t('propertySettings.maxGuests'),
      maximumDays: t('propertySettings.maximumDays'),
      minimumDays: t('propertySettings.minimumDays'),
      pricePerNight: t('propertySettings.pricePerNight'),
      prices: t('propertySettings.prices'),
      pricing: t('propertySettings.pricing'),
      reservationLength: t('propertySettings.reservationLength'),
      save: t('propertySettings.save'),
      selectedDates: t('propertySettings.selectedDates'),
      selectedDatesAvgPrice: t('propertySettings.selectedDatesAvgPrice'),
      settings: t('propertySettings.settings'),
      specialPrice: t('propertySettings.specialPrice'),
    }));

  return {
    propertySettings: propertySettingsTranslations,
  };
};
