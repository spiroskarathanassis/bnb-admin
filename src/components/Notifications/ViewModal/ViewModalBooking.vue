<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import BaseModal from '@/components/common/BaseModal.vue';
import FormField from '@/components/common/FormField.vue';
import DirectionButtons from '@/components/layout/DirectionButtons.vue';
import useBookingTitle from '@/composables/useBookingTitle';
import { platformStyles } from '@/constants/platformStyles';
import { BookingPaymentStatus, DirectionBtn } from '@/enums';
import { BookingType } from '@/types';

interface BookingModalType extends BookingType {
  isPrev?: boolean;
}

const emit = defineEmits(['closeModal']);
const props = withDefaults(
  defineProps<{
    nextBook?: BookingType | null;
    prevBook?: BookingType | null;
  }>(),
  {
    nextBook: null,
    prevBook: null,
  }
);

const { t } = useI18n();
const { formatBookingTitle } = useBookingTitle();

const activeSmallScreenBookingIndex = ref(0);
const showDirectionButtons = ref<DirectionBtn[]>([DirectionBtn.RIGHT]);

const bookItems = computed<BookingModalType[]>(() => {
  const previousB = props.prevBook ? { ...props.prevBook, isPrev: true } : null;
  return [previousB, props.nextBook].filter((el) => !!el);
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
</script>

<template>
  <BaseModal :isOpen="!!bookItems.length">
    <div
      class="tw-w-full tw-relative tw-overflow-hidden sm:tw-overflow-visible"
    >
      <div
        :class="[
          'tw-flex tw-justify-between',
          bookItems.length === 2 ? 'tw-w-[200%] sm:tw-w-full' : 'tw-w-full ',
        ]"
      >
        <BaseModal
          v-for="(item, i) in bookItems"
          :key="i"
          hideFixed
          minimize
          :bgColor="item.isPrev ? 'tw-bg-black/20' : ''"
          :class="[
            `tw-transition-all tw-duration-1000 tw-ease-in-out`,
            bookItems.length > 1 &&
              bookItems.length === 2 &&
              (activeSmallScreenBookingIndex === 0
                ? 'tw-translate-x-0'
                : '-tw-translate-x-full sm:tw-translate-x-0'),
          ]"
        >
          <template #title>
            <div class="tw-flex tw-flex-col tw-gap-1">
              <span>
                {{ formatBookingTitle(item) }}
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
            <!-- Dates -->
            <FormField :label="t('booking_info.fields.dates')">
              <div class="tw-grid tw-grid-cols-2 tw-gap-4">
                <div>
                  <div class="tw-text-xs tw-text-primary">Check-in</div>
                  <span>{{ item.checkin }}</span>
                </div>
                <div>
                  <div class="tw-text-xs tw-text-primary">Check-out</div>
                  <span>{{ item.checkout }}</span>
                </div>
              </div>
            </FormField>
            <!-- Platform -->
            <FormField :label="t('reuse.platform')">
              <div
                :class="[
                  platformStyles[item.platform],
                  'tw-rounded tw-text-center',
                ]"
              >
                {{ item.platform }}
              </div>
            </FormField>
            <div
              class="tw-grid tw-grid-cols-[minmax(auto,1fr),minmax(auto,1fr)] tw-gap-4"
            >
              <!-- Guests -->
              <FormField :label="t('booking_info.fields.guests')">
                {{ sumGuests(item.guests) }}
              </FormField>
              <!-- Price -->
              <FormField :label="t('booking_info.fields.price')">
                <div>{{ item.price }}€</div>
              </FormField>
            </div>
            <FormField :label="t('booking_info.fields.payment_status_label')">
              <span
                v-if="item.payment_status === BookingPaymentStatus.SUCCESS"
                class="bg-positive text-white rounded-borders tw-p-1 tw-text-ellipsis"
              >
                {{ t('booking_info.fields.payment_status.paid') }}
              </span>
              <span
                v-else
                class="bg-orange text-white rounded-borders tw-p-1 tw-text-ellipsis"
              >
                {{ t('booking_info.fields.payment_status.pending') }}
              </span>
            </FormField>

            <!-- Notes -->
            <FormField :label="t('booking_info.fields.notes')">
              <div>{{ item.notes || '-' }}</div>
            </FormField>
          </form>
        </BaseModal>
      </div>

      <DirectionButtons
        v-if="bookItems.length > 1"
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
