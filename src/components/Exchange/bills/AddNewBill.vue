<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

import { SelectMonth, SelectUser, SelectYear } from '@/components/common';
import BaseModal from '@/components/common/BaseModal.vue';
import FormField from '@/components/common/FormField.vue';
import { useExchangeBillsStore, useUserFeatures } from '@/stores';
import { BillType, DbTypeWithKey, ExchangeInvestors } from '@/types';
import { currentMonthName } from '@/utils/months';

interface NewBill extends Omit<BillType, 'payer'> {
  payer?: number | ExchangeInvestors.SELECT_ALL;
}

const emit = defineEmits(['closeModal']);
const props = withDefaults(
  defineProps<{
    bill?: DbTypeWithKey<BillType>;
  }>(),
  {
    bill: undefined,
  }
);

const { t } = useI18n();
const billsStore = useExchangeBillsStore();
const userFeatures = useUserFeatures();

const newBill = reactive<NewBill>({
  description: '',
  month: currentMonthName(),
  notes: '',
  payer: undefined,
  price: 0,
  year: new Date().getFullYear(),
});
const error = reactive({
  description: false,
  payer: false,
  price: false,
});

const isNewBill = computed(() => !props.bill);
const payerOptions = computed(() => [
  ...userFeatures.exchangeUsers.map((user) => ({
    label: `${user.first_name} ${user.last_name}`,
    value: user.userId,
  })),
  {
    label: t('modals.bill.all'),
    value: ExchangeInvestors.SELECT_ALL,
  },
]);

const closeModal = () => {
  // reset prop
  newBill.description = '';
  newBill.price = 0;
  newBill.payer = undefined;
  newBill.month = currentMonthName();
  newBill.year = new Date().getFullYear();
  newBill.notes = '';

  emit('closeModal');
};

const applyBillData = () => {
  if (!props.bill) return;

  // reset prop
  newBill.description = props.bill.description;
  newBill.price = props.bill.price ?? 0;
  newBill.payer = props.bill.payer;
  newBill.month = props.bill.month;
  newBill.year = props.bill.year ?? new Date().getFullYear();
  newBill.notes = props.bill.notes;
};

const timeFormError = (field: keyof typeof error) => {
  error[field] = true;

  const timer = setTimeout(() => {
    error[field] = false;
    clearTimeout(timer);
  }, 5000);
};

const areRequiredFieldsValid = () => {
  if (!newBill.description) {
    timeFormError('description');
    return false;
  }

  if (newBill.price <= 0) {
    timeFormError('price');
    return false;
  }

  if (!newBill.payer) {
    timeFormError('payer');
    return false;
  }

  return true;
};

const deleteItem = async () => {
  if (!props.bill?.key) return;

  await billsStore.deleteBill({
    billId: props.bill.key,
  });
};

const saveItem = async () => {
  if (!areRequiredFieldsValid()) return;
  if (!newBill.payer) return;

  const billData = { ...newBill } as BillType;

  if (isNewBill.value) {
    const itemData = {
      ...billData,
      id: Date.now(),
    };

    await billsStore.addNewBill(itemData);
  } else {
    if (!props.bill?.key) return;

    await billsStore.editBills({
      billId: props.bill.key,
      data: { ...billData },
    });
  }

  closeModal();
};

onMounted(() => {
  if (!isNewBill.value) {
    applyBillData();
  }
});
</script>

<template>
  <BaseModal>
    <template #title>
      {{ isNewBill ? t('modals.add') : t('modals.edit') }}
      {{ t('modals.bill.title') }}
    </template>

    <template #default>
      <form class="tw-flex tw-flex-col tw-gap-4">
        <!-- Description -->
        <FormField
          v-model="newBill.description"
          :label="`${t('modals.bill.description')} *`"
          :errorField="error.description"
          :errorMessage="t('modals.errors.empty_field')"
        />
        <!-- Price -->
        <FormField
          v-model="newBill.price"
          type="number"
          :label="`${t('modals.bill.price')} *`"
          :errorField="error.price"
          :errorMessage="t('modals.errors.invalid_number')"
        />
        <!-- Payer Name -->
        <FormField
          :label="`${t('modals.bill.payer')} *`"
          :errorField="error.payer"
          :errorMessage="t('modals.errors.empty_field')"
        >
          <SelectUser
            v-model="newBill.payer"
            :options="payerOptions"
            hasFormStyles
          />
        </FormField>
        <!-- Month / Year -->
        <FormField :label="`${t('reuse.month')} - ${t('reuse.year')}`">
          <div class="tw-grid tw-grid-cols-2 tw-gap-2">
            <SelectMonth v-model="newBill.month" hasFormStyles />
            <SelectYear v-model="newBill.year" hasFormStyles />
          </div>
        </FormField>
        <!-- Notes -->
        <FormField
          v-model="newBill.notes"
          type="textarea"
          variant="outlined"
          :label="`${t('modals.bill.notes')}`"
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
            v-if="!isNewBill"
            outline
            no-caps
            size="small"
            color="primary"
            @click.prevent="deleteItem"
          >
            {{ t('modals.actions.delete') }}
          </q-btn>
          <q-btn no-caps size="small" color="primary" @click.prevent="saveItem">
            {{ t('modals.actions.save') }}
          </q-btn>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
