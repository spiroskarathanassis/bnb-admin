<script setup lang="ts">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

import { SelectMonth, SelectYear } from '@/components/common';
import BaseModal from '@/components/common/BaseModal.vue';
import FormField from '@/components/common/FormField.vue';
import { useExchangeRevenuesStore } from '@/stores/exchange';
import { RevenueType } from '@/types';
import { currentMonthName } from '@/utils/months';

const emit = defineEmits(['closeModal']);
defineProps<{
  title: string;
}>();

const { t } = useI18n();
const revenuesStore = useExchangeRevenuesStore();

const newItem = reactive<RevenueType>({
  description: '',
  from: '',
  month: currentMonthName(),
  notes: '',
  price: 0,
  year: new Date().getFullYear(),
});
const error = reactive({
  description: false,
  price: false,
});

const closeModal = () => {
  // reset prop
  newItem.description = '';
  newItem.price = 0;
  newItem.from = '';
  newItem.month = currentMonthName();
  newItem.year = new Date().getFullYear();
  newItem.notes = '';

  emit('closeModal');
};

const timeFormError = (field: keyof typeof error) => {
  error[field] = true;

  const timer = setTimeout(() => {
    error[field] = false;
    clearTimeout(timer);
  }, 5000);
};

const areRequiredFieldsValid = () => {
  if (!newItem.description) {
    timeFormError('description');
    return false;
  }

  if (newItem.price <= 0) {
    timeFormError('price');
    return false;
  }

  return true;
};

const addNewItem = async () => {
  if (!areRequiredFieldsValid()) return;

  const itemData = {
    ...newItem,
    id: Date.now(),
  };

  await revenuesStore.addNewRevenue(itemData);

  closeModal();
};
</script>

<template>
  <BaseModal>
    <template #title>
      {{ title }}
    </template>

    <template #default>
      <form class="tw-flex tw-flex-col tw-gap-4">
        <!-- Description -->
        <FormField
          v-model="newItem.description"
          :label="`${t('modals.revenue.description')} *`"
          :errorField="error.description"
          :errorMessage="t('modals.errors.empty_field')"
        />
        <!-- Price -->
        <FormField
          v-model="newItem.price"
          :label="`${t('modals.revenue.price')} *`"
          :errorField="error.price"
          :errorMessage="t('modals.errors.invalid_number')"
          type="number"
        />
        <!-- From -->
        <FormField
          v-model="newItem.from"
          :label="t('modals.revenue.coming_from')"
        />
        <!-- Month / Year -->
        <FormField :label="`${t('reuse.month')} - ${t('reuse.year')}`">
          <div class="tw-grid tw-grid-cols-2 tw-gap-2">
            <SelectMonth v-model="newItem.month" hasFormStyles />
            <SelectYear v-model="newItem.year" hasFormStyles />
          </div>
        </FormField>
        <!-- Notes -->
        <FormField
          v-model="newItem.notes"
          type="textarea"
          variant="outlined"
          :label="`${t('modals.revenue.notes')}`"
        />
      </form>
    </template>

    <template #footer>
      <div
        class="tw-flex tw-flex-wrap tw-justify-between tw-items-center tw-gap-4"
      >
        <div class="tw-flex">
          <q-btn
            flat
            no-caps
            size="small"
            color="primary"
            @click.prevent="closeModal"
          >
            {{ t('modals.actions.cancel') }}
          </q-btn>
        </div>
        <div class="tw-flex tw-justify-end tw-gap-2">
          <q-btn
            no-caps
            size="small"
            color="primary"
            @click.prevent="addNewItem"
          >
            {{ t('modals.actions.save') }}
          </q-btn>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
