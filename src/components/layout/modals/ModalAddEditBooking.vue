<script setup lang="ts">
import moment from 'moment';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import BaseModal from '@/components/common/BaseModal.vue';
import BookingForm from '@/components/layout/BookingForm.vue';
import useBookingTitle from '@/composables/useBookingTitle';
import { BookingApprovalState, Platform } from '@/enums';
import { useBookingsStore } from '@/stores';
import { BookingFormType, BookingType, DbTypeWithKey } from '@/types';
import applyBookingInfo from '@/utils/booking/applyBookingInfo';

const emit = defineEmits(['closeModal']);
const props = defineProps<{
  book: DbTypeWithKey<BookingType>;
}>();

const { t } = useI18n();
const { formatBookingTitle } = useBookingTitle();
const bookingsStore = useBookingsStore();

const editedBooking = ref<BookingType | null>(null);

const shouldSaveBooking = computed(
  () =>
    !(
      props.book.platform === Platform.WEBSITE &&
      props.book.approval_status === BookingApprovalState.PENDING
    )
);

const closeModal = () => {
  editedBooking.value = null;
  emit('closeModal');
};
const deleteBooking = async () => {
  await bookingsStore.deleteBooking({
    bookId: props.book.key,
  });
  closeModal();
};
const applyChanges = async () => {
  if (!editedBooking.value) return;

  const reqData = {
    bookId: props.book.key,
    data: applyBookingInfo(editedBooking.value),
  };
  await bookingsStore.editBooking(reqData);
  closeModal();
};

const updateForm = (data: BookingFormType) => {
  const year = moment(props.book.checkin).year();

  editedBooking.value = { ...editedBooking.value, ...data, year };
};

onMounted(() => {
  editedBooking.value = {
    ...props.book,
    price: props.book.price ?? 0,
  };
});
</script>

<template>
  <BaseModal :isOpen="!!editedBooking">
    <template #title>
      {{ formatBookingTitle(book) }}
    </template>

    <template #default>
      <BookingForm :fields="book" @update="updateForm" />
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
            {{ t('modals.actions.close') }}
          </q-btn>
        </div>
        <div class="tw-flex tw-justify-end tw-gap-2">
          <q-btn
            outline
            no-caps
            size="small"
            color="primary"
            @click.prevent="deleteBooking"
          >
            {{ t('modals.actions.delete') }}
          </q-btn>
          <q-btn
            v-if="shouldSaveBooking"
            no-caps
            size="small"
            color="primary"
            @click.prevent="applyChanges"
          >
            {{ t('modals.actions.save') }}
          </q-btn>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
