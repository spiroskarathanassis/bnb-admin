<script setup lang="ts">
import { ref } from 'vue';

import LineItem from '@/components/common/LineItem/LineItem.vue';
import ModalNotesPreview from '@/components/layout/modals/ModalNotesPreview.vue';
import { DbTypeWithKey, PurchaseType } from '@/types';

import AddNewPurchase from './AddNewPurchase.vue';

const props = defineProps<{
  purchaseItem: DbTypeWithKey<PurchaseType> & {
    purchaserName: string;
  };
}>();

const isEditingFieldOpened = ref(false);
const currentPreviewNote = ref<{
  title: string;
  text: string;
} | null>(null);

const openNotes = () => {
  currentPreviewNote.value = {
    text: props.purchaseItem.notes,
    title: `${props.purchaseItem.description}`,
  };
};
</script>

<template>
  <LineItem
    :tabText="purchaseItem.purchaserName"
    :price="(+purchaseItem.price).toFixed(2)"
    :description="purchaseItem.description"
    responsive
  >
    <q-btn v-if="purchaseItem.notes" flat dense size="small" @click="openNotes">
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

  <AddNewPurchase
    v-if="isEditingFieldOpened"
    :purchase="purchaseItem"
    @closeModal="isEditingFieldOpened = false"
  />
  <ModalNotesPreview
    v-if="currentPreviewNote"
    :notes="currentPreviewNote"
    @closeModal="currentPreviewNote = null"
  />
</template>
