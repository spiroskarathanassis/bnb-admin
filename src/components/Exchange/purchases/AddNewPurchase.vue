<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

import { SelectPeriod, SelectUser, SelectYear } from '@/components/common';
import BaseModal from '@/components/common/BaseModal.vue';
import FormField from '@/components/common/FormField.vue';
import { useExchangePurchasesStore, useUserFeatures } from '@/stores';
import { DbTypeWithKey, ExchangeInvestors, PurchaseType } from '@/types';
import { getCurrentPeriod } from '@/utils/periods';

interface NewPurchase extends Omit<PurchaseType, 'purchaser'> {
  purchaser?: number | ExchangeInvestors.SELECT_ALL;
}

const emit = defineEmits(['closeModal']);
const props = withDefaults(
  defineProps<{
    purchase?: DbTypeWithKey<PurchaseType> | null;
  }>(),
  {
    purchase: null,
  }
);

const { t } = useI18n();
const purchasesStore = useExchangePurchasesStore();
const userFeatures = useUserFeatures();

const newPurchase = reactive<NewPurchase>({
  description: '',
  month: getCurrentPeriod(),
  notes: '',
  price: 0,
  purchaser: undefined,
  year: new Date().getFullYear(),
});
const error = reactive({
  description: false,
  price: false,
  purchaser: false,
});

const isNewPurchase = computed(() => !props.purchase);
const purchaserOptions = computed(() => [
  ...userFeatures.exchangeUsers.map((user) => ({
    label: `${user.first_name} ${user.last_name}`,
    value: user.userId,
  })),
  {
    label: t('modals.new_purchase.all'),
    value: ExchangeInvestors.SELECT_ALL,
  },
]);

const closeModal = () => {
  // reset prop
  newPurchase.description = '';
  newPurchase.price = 0;
  newPurchase.purchaser = undefined;
  newPurchase.month = getCurrentPeriod();
  newPurchase.year = new Date().getFullYear();
  newPurchase.notes = '';

  emit('closeModal');
};

const applyPurchaseData = () => {
  if (!props.purchase) return;

  // reset prop
  newPurchase.description = props.purchase.description;
  newPurchase.price = props.purchase.price ?? 0;
  newPurchase.purchaser = props.purchase.purchaser;
  newPurchase.month = props.purchase.month;
  newPurchase.year = props.purchase.year ?? new Date().getFullYear();
  newPurchase.notes = props.purchase.notes;
};

const timeFormError = (field: keyof typeof error) => {
  error[field] = true;

  const timer = setTimeout(() => {
    error[field] = false;
    clearTimeout(timer);
  }, 5000);
};

const areRequiredFieldsValid = () => {
  if (!newPurchase.description) {
    timeFormError('description');
    return false;
  }

  if (newPurchase.price <= 0) {
    timeFormError('price');
    return false;
  }

  if (!newPurchase.purchaser) {
    timeFormError('purchaser');
    return false;
  }

  return true;
};

const deleteItem = async () => {
  if (!props.purchase?.key) return;

  await purchasesStore.deletePurchase({
    purchaseId: props.purchase.key,
  });
};

const saveItem = async () => {
  if (!areRequiredFieldsValid()) return;
  if (!newPurchase.purchaser) return;

  const purchaseData = { ...newPurchase } as PurchaseType;

  if (isNewPurchase.value) {
    const itemData = {
      ...purchaseData,
      id: Date.now(),
    };

    await purchasesStore.addNewPurchase(itemData);
  } else {
    if (!props.purchase?.key) return;

    await purchasesStore.editPurchases({
      data: { ...purchaseData },
      purchaseId: props.purchase.key,
    });
  }

  closeModal();
};

onMounted(() => {
  if (!isNewPurchase.value) {
    applyPurchaseData();
  }
});
</script>

<template>
  <BaseModal>
    <template #title>
      {{ isNewPurchase ? t('modals.add') : t('modals.edit') }}
      {{ t('modals.new_purchase.title') }}
    </template>

    <template #default>
      <form class="tw-flex tw-flex-col tw-gap-4">
        <!-- Description -->
        <FormField
          v-model="newPurchase.description"
          :label="`${t('modals.new_purchase.description')} *`"
          :errorField="error.description"
          :errorMessage="t('modals.errors.empty_field')"
        />
        <!-- Price -->
        <FormField
          v-model="newPurchase.price"
          type="number"
          :label="`${t('modals.new_purchase.price')} *`"
          :errorField="error.price"
          :errorMessage="t('modals.errors.invalid_number')"
        />
        <!-- Purchaser Name -->
        <FormField
          :label="`${t('modals.new_purchase.purchaser')} *`"
          :errorField="error.purchaser"
          :errorMessage="t('modals.errors.empty_field')"
        >
          <SelectUser
            v-model="newPurchase.purchaser"
            :options="purchaserOptions"
            hasFormStyles
          />
        </FormField>
        <!-- Period / Year -->
        <FormField :label="`${t('modals.new_purchase.period')} *`">
          <div class="tw-grid tw-grid-cols-2 tw-gap-2">
            <SelectPeriod v-model="newPurchase.month" hasFormStyles />
            <SelectYear v-model="newPurchase.year" hasFormStyles />
          </div>
        </FormField>
        <!-- Notes -->
        <FormField
          v-model="newPurchase.notes"
          type="textarea"
          variant="outlined"
          :label="`${t('modals.new_purchase.notes')}`"
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
            v-if="!isNewPurchase"
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
