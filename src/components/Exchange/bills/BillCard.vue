<script setup lang="ts">
import { ref } from 'vue';

import LineItem from '@/components/common/LineItem/LineItem.vue';
import ModalNotesPreview from '@/components/layout/modals/ModalNotesPreview.vue';
import { BillType, DbTypeWithKey, ExchangeNotesPreview } from '@/types';

import AddNewBill from './AddNewBill.vue';

const props = defineProps<{
  billItem: DbTypeWithKey<BillType> & {
    payerName: string;
  };
}>();

const isEditingFieldOpened = ref(false);
const currentPreviewNote = ref<ExchangeNotesPreview | null>(null);

const openNotes = () => {
  currentPreviewNote.value = {
    text: props.billItem.notes,
    title: `${props.billItem.description}`,
  };
};
</script>

<template>
  <LineItem
    :tabText="billItem.payerName"
    :price="(+billItem.price).toFixed(2)"
    :description="billItem.description"
    responsive
  >
    <q-btn v-if="billItem.notes" flat dense size="small" @click="openNotes">
      <img src="@/assets/images/icons/description_black_24dp.svg" />
    </q-btn>
    <q-btn
      flat
      dense
      size="small"
      icon="edit"
      @click="isEditingFieldOpened = true"
    />
  </LineItem>

  <AddNewBill
    v-if="isEditingFieldOpened"
    :bill="billItem"
    @closeModal="isEditingFieldOpened = false"
  />
  <ModalNotesPreview
    v-if="currentPreviewNote"
    :notes="currentPreviewNote"
    @closeModal="currentPreviewNote = null"
  />
</template>
