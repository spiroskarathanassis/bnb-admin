<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import BaseModal from '@/components/common/BaseModal.vue';
import FormField from '@/components/common/FormField.vue';
import DirectionButtons from '@/components/layout/DirectionButtons.vue';
import { DirectionBtn, PeriodName } from '@/enums';
import { useUserFeatures } from '@/stores';
import {
  BillType,
  ExchangeInvestors,
  ExchangeItem,
  NotificationType,
  PurchaseType,
  TransactionType,
} from '@/types';

const emit = defineEmits(['closeModal']);
const props = withDefaults(
  defineProps<{
    nextItem?: ExchangeItem | null;
    prevItem?: ExchangeItem | null;
    notyType?: NotificationType;
  }>(),
  {
    nextItem: null,
    notyType: undefined,
    prevItem: null,
  }
);

const { t } = useI18n();
const userFeatures = useUserFeatures();

const activeSmallScreenBookingIndex = ref(0);
const showDirectionButtons = ref([DirectionBtn.RIGHT]);

const exchangeItems = computed<ExchangeItem[]>(() => {
  const previousB = props.prevItem ? { ...props.prevItem, isPrev: true } : null;
  return [previousB, props.nextItem].filter((el) => !!el);
});

const clickedLeft = () => {
  showDirectionButtons.value = [DirectionBtn.RIGHT];
  activeSmallScreenBookingIndex.value = 0;
};
const clickedRight = () => {
  showDirectionButtons.value = [DirectionBtn.LEFT];
  activeSmallScreenBookingIndex.value = 1;
};

const closeModal = () => {
  emit('closeModal');
};

const getTitle = (exchangeItem: ExchangeItem) => {
  if (props.notyType === NotificationType.TRANSACTION) {
    const item = exchangeItem as TransactionType;
    const senderName = userFeatures.getUserById(item.senderId)?.first_name;
    const receiverName = userFeatures.getUserById(item.receiverId)?.first_name;

    return `${senderName} to ${receiverName} ${item.price}€`;
  }

  const item = exchangeItem as BillType | PurchaseType;
  return `${item.description} '${item.year}`;
};

const getExchangeExecutionBy = (exchangeItem: ExchangeItem) => {
  console.log(exchangeItem);

  if (props.notyType === NotificationType.TRANSACTION) {
    const item = exchangeItem as TransactionType;
    const senderName = userFeatures.getUserById(item.senderId)?.first_name;
    const receiverName = userFeatures.getUserById(item.receiverId)?.first_name;

    return `${senderName} to ${receiverName}`;
  }

  if (props.notyType === NotificationType.BILL) {
    const item = exchangeItem as BillType;
    const payerName =
      item.payer === ExchangeInvestors.SELECT_ALL
        ? ExchangeInvestors.SELECT_ALL
        : userFeatures.getUserById(item.payer)?.first_name || '';

    return payerName;
  }

  if (props.notyType === NotificationType.PURCHASE) {
    const item = exchangeItem as PurchaseType;
    const purchaserName =
      item.purchaser === ExchangeInvestors.SELECT_ALL
        ? ExchangeInvestors.SELECT_ALL
        : userFeatures.getUserById(item.purchaser)?.first_name || '';

    return purchaserName;
  }

  return '';
};
</script>

<template>
  <BaseModal :isOpen="!!exchangeItems.length">
    <div
      class="tw-w-full tw-relative tw-overflow-hidden sm:tw-overflow-visible"
    >
      <div
        :class="[
          'tw-flex tw-justify-between',
          exchangeItems.length === 2 ? 'tw-w-[200%] sm:tw-w-full' : 'tw-w-full',
        ]"
      >
        <BaseModal
          v-for="(item, i) in exchangeItems"
          :key="i"
          hideFixed
          minimize
          :bgColor="item.isPrev ? 'tw-bg-black/20' : ''"
          :class="[
            `tw-transition-all tw-duration-1000 tw-ease-in-out`,
            exchangeItems.length > 1 &&
              exchangeItems.length === 2 &&
              (activeSmallScreenBookingIndex === 0
                ? 'tw-translate-x-0'
                : '-tw-translate-x-full sm:tw-translate-x-0'),
          ]"
        >
          <template #title>
            <div class="tw-flex tw-flex-col tw-gap-1">
              <span>
                {{ getTitle(item) }}
              </span>
              <span>
                ({{
                  item.isPrev
                    ? t('noties_page.diff.before')
                    : t('noties_page.diff.after')
                }})
              </span>
            </div>
          </template>

          <form class="tw-flex tw-flex-col tw-gap-4">
            <!-- Price / Consumer Name -->
            <div class="tw-flex tw-justify-between tw-gap-4">
              <FormField :label="t('modals.exchange.price')">
                <div>{{ item.price }}€</div>
              </FormField>
              <FormField :label="t('modals.exchange.executed_by')">
                <div>{{ getExchangeExecutionBy(item) }}</div>
              </FormField>
            </div>
            <!-- Period -->
            <FormField :label="t('reuse.period')">
              <div>
                {{
                  item.month in PeriodName
                    ? t(`reuse.periods.${item.month}`)
                    : t(`reuse.months.${item.month}`)
                }}
              </div>
            </FormField>
            <!-- Year -->
            <FormField :label="t('reuse.year')">
              <div>{{ item.year }}</div>
            </FormField>
            <!-- Notes -->
            <FormField :label="t('modals.exchange.notes')">
              <div>{{ item.notes || '-' }}</div>
            </FormField>
          </form>
        </BaseModal>
      </div>

      <DirectionButtons
        v-if="exchangeItems.length > 1"
        :showButtons="showDirectionButtons"
        class="sm:tw-hidden"
        @left="clickedLeft"
        @right="clickedRight"
      />
    </div>

    <template #footer>
      <div class="tw-flex tw-justify-end tw-items-center tw-gap-4">
        <div class="tw-flex">
          <q-btn
            flat
            no-caps
            size="small"
            color="primary"
            @click.prevent="closeModal"
          >
            {{ t('modals.actions.close') }}
          </q-btn>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
