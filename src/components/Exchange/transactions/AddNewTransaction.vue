<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

import { SelectMonth, SelectUser, SelectYear } from '@/components/common';
import BaseModal from '@/components/common/BaseModal.vue';
import FormField from '@/components/common/FormField.vue';
import { useExchangeTransactionsStore, useUserFeatures } from '@/stores';
import { DbTypeWithKey, TransactionType } from '@/types';
import { currentMonthName } from '@/utils/months';

interface NewTransaction
  extends Omit<TransactionType, 'senderId' | 'receiverId'> {
  receiverId?: number;
  senderId?: number;
}

const props = withDefaults(
  defineProps<{
    transaction?: DbTypeWithKey<TransactionType> | null;
  }>(),
  {
    transaction: null,
  }
);

const emit = defineEmits(['closeModal']);

const { t } = useI18n();
const transactionsStore = useExchangeTransactionsStore();
const userFeatures = useUserFeatures();

const newTransaction = reactive<NewTransaction>({
  month: currentMonthName(),
  notes: '',
  price: 0,
  receiverId: undefined,
  senderId: undefined,
  year: new Date().getFullYear(),
});
const error = reactive({
  price: false,
  receiverId: false,
  senderId: false,
});

const isNewTransaction = computed(() => !props.transaction);
const transactionUsersOptions = computed(() => [
  ...userFeatures.appUsers.map((user) => ({
    label: `${user.first_name} ${user.last_name}`,
    value: user.userId,
  })),
]);
const senderOptions = computed(() => [
  ...transactionUsersOptions.value.filter(
    (user) => user.value !== newTransaction.receiverId
  ),
]);
const receiverOptions = computed(() => [
  ...transactionUsersOptions.value.filter(
    (user) => user.value !== newTransaction.senderId
  ),
]);

const closeModal = () => {
  // reset prop
  newTransaction.senderId = undefined;
  newTransaction.price = 0;
  newTransaction.receiverId = undefined;
  newTransaction.month = currentMonthName();
  newTransaction.year = new Date().getFullYear();
  newTransaction.notes = '';

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
  if (!newTransaction.senderId) {
    timeFormError('senderId');
    return false;
  }
  if (!newTransaction.receiverId) {
    timeFormError('receiverId');
    return false;
  }

  if (newTransaction.price <= 0) {
    timeFormError('price');
    return false;
  }

  return true;
};

const saveItem = async () => {
  if (!areRequiredFieldsValid()) return;
  if (!newTransaction.senderId || !newTransaction.receiverId) return;

  const transactionData = { ...newTransaction } as TransactionType;

  if (isNewTransaction.value) {
    const itemData = {
      ...transactionData,
      id: Date.now(),
    };

    await transactionsStore.addNewTransaction(itemData);
  } else {
    if (!props.transaction?.key) return;

    await transactionsStore.editTransaction({
      data: { ...transactionData },
      transactionId: props.transaction.key,
    });
  }

  closeModal();
};

const applyTransactionToEdit = () => {
  if (!props.transaction) return;

  newTransaction.senderId = props.transaction.senderId;
  newTransaction.receiverId = props.transaction.receiverId;
  newTransaction.price = props.transaction.price ?? 0;
  newTransaction.month = props.transaction.month ?? currentMonthName();
  newTransaction.year = props.transaction.year ?? new Date().getFullYear();
  newTransaction.notes = props.transaction.notes;
};

onMounted(() => {
  if (!isNewTransaction.value) {
    applyTransactionToEdit();
  }
});
</script>

<template>
  <BaseModal>
    <template #title>
      {{ isNewTransaction ? t('modals.add') : t('modals.edit') }}
      {{ t('modals.transaction.title') }}
    </template>

    <template #default>
      <form class="tw-flex tw-flex-col tw-gap-4">
        <!-- Sender -->
        <FormField
          :label="`${t('modals.transaction.sender')} *`"
          :errorField="error.senderId"
          :errorMessage="t('modals.errors.empty_field')"
        >
          <SelectUser
            v-model="newTransaction.senderId"
            :options="senderOptions"
            hasFormStyles
          />
        </FormField>
        <!-- Receiver -->
        <FormField
          :label="`${t('modals.transaction.receiver')} *`"
          :errorField="error.receiverId"
          :errorMessage="t('modals.errors.empty_field')"
        >
          <SelectUser
            v-model="newTransaction.receiverId"
            :options="receiverOptions"
            hasFormStyles
          />
        </FormField>
        <!-- Price -->
        <FormField
          v-model="newTransaction.price"
          type="number"
          :label="`${t('modals.transaction.price')} *`"
          :errorField="error.price"
          :errorMessage="t('modals.errors.empty_field')"
        />
        <!-- Month / Year -->
        <FormField :label="`${t('reuse.month')} - ${t('reuse.year')}`">
          <div class="tw-grid tw-grid-cols-2 tw-gap-2">
            <SelectMonth v-model="newTransaction.month" hasFormStyles />
            <SelectYear v-model="newTransaction.year" hasFormStyles />
          </div>
        </FormField>
        <!-- Notes -->
        <FormField
          v-model="newTransaction.notes"
          type="textarea"
          variant="outlined"
          :label="`${t('modals.transaction.notes')}`"
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
          <q-btn no-caps size="small" color="primary" @click.prevent="saveItem">
            {{ t('modals.actions.save') }}
          </q-btn>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
