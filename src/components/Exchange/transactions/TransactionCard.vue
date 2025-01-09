<script setup lang="ts">
import { ref } from 'vue';

import ModalNotesPreview from '@/components/layout/modals/ModalNotesPreview.vue';
import { useExchangeTransactionsStore } from '@/stores/exchange';
import { DbTypeWithKey, ExchangeNotesPreview, TransactionType } from '@/types';

import AddNewTransaction from './AddNewTransaction.vue';

const props = defineProps<{
  transaction: DbTypeWithKey<TransactionType> & {
    senderName: string;
    receiverName: string;
  };
}>();

const transactionsStore = useExchangeTransactionsStore();

const isEditingFieldOpened = ref(false);
const currentPreviewNote = ref<ExchangeNotesPreview | null>(null);
const showingActions = ref(false);

const touchstartX = ref(0);
const touchendX = ref(0);

const closeTransactionModal = () => {
  isEditingFieldOpened.value = false;
  showingActions.value = false;
};

const openNotes = () => {
  currentPreviewNote.value = {
    text: props.transaction.notes,
    title: `${props.transaction.senderName} to ${props.transaction.receiverName} ${props.transaction.price}€`,
  };
};

const editItem = () => {
  isEditingFieldOpened.value = true;
};
const deleteItem = async () => {
  const isConfirmed = window.confirm('Are you sure you want to delete ?');

  if (isConfirmed) {
    await transactionsStore.deleteTransaction({
      transactionId: props.transaction.key,
    });
  }

  showingActions.value = false;
};

// Touch
const startTouching = (e) => {
  touchstartX.value = e.changedTouches[0].screenX;
};
const endTouching = (e) => {
  touchendX.value = e.changedTouches[0].screenX;
  const diff = 50; // 50px swipe ay least

  if (Math.abs(touchendX.value) + diff < Math.abs(touchstartX.value)) {
    showingActions.value = true;
  }
};
</script>

<template>
  <div
    :class="[
      'tw-bg-gradient-to-r tw-from-white tw-to-primary',
      'tw-flex tw-justify-between tw-items-center tw-relative tw-w-full tw-py-2 tw-px-4 tw-rounded-lg tw-overflow-hidden',
    ]"
    @touchstart.passive="startTouching"
    @touchend.passive="endTouching"
    @dblclick="showingActions = true"
  >
    <div class="tw-flex tw-items-center tw-gap-2">
      <div>
        <div class="tw-grid tw-grid-cols-[80px_auto]">
          <span class="tw-text-black7">Sent by</span>
          <span>{{ transaction.senderName ?? '' }}</span>
        </div>
        <div class="tw-grid tw-grid-cols-[80px_auto]">
          <span>Receiver</span>
          <span>{{ transaction.receiverName ?? '' }}</span>
        </div>
      </div>
      <div
        v-if="transaction.notes"
        class="tw-flex tw-items-center tw-p-2 tw-rounded-lg tw-cursor-pointer hover:tw-bg-grannyWhite"
        @click="openNotes"
      >
        <img src="@/assets/images/icons/description_black_24dp.svg" alt="" />
      </div>
    </div>
    <div>
      <span class="tw-text-lg tw-text-paleSpringBud"
        >€ {{ (+transaction.price).toFixed(2) ?? '' }}</span
      >
    </div>
    <div
      v-show="showingActions"
      class="tw-absolute tw-flex tw-justify-between tw-items-center tw-h-full tw-w-full tw-bg-primary tw-right-0"
    >
      <div
        class="tw-flex tw-items-center tw-cursor-pointer tw-p-2 tw-bg-grannyWhite tw-rounded-lg tw-ml-2 hover:tw-opacity-70"
        @click.prevent="showingActions = false"
      >
        <img
          src="@/assets/images/icons/close_black_24dp.svg"
          alt=""
          width="20"
        />
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-h-full">
        <div
          class="tw-flex tw-items-center tw-cursor-pointer tw-p-2 tw-bg-white hover:tw-bg-opacity-80"
          @click="editItem"
        >
          <img src="@/assets/images/icons/edit_black_24dp.svg" alt="" />
        </div>
        <div
          class="tw-flex tw-items-center tw-cursor-pointer tw-p-2 tw-bg-error hover:tw-bg-opacity-80"
          @click="deleteItem"
        >
          <img src="@/assets/images/icons/delete_black_24dp.svg" alt="" />
        </div>
      </div>
    </div>
  </div>

  <AddNewTransaction
    v-if="isEditingFieldOpened"
    :transaction="transaction"
    @closeModal="closeTransactionModal"
  />

  <ModalNotesPreview
    v-if="currentPreviewNote"
    :notes="currentPreviewNote"
    @closeModal="currentPreviewNote = null"
  />
</template>
