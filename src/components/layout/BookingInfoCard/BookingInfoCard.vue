<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { BaseAnchorLink } from '@/components/common';
import useBookingTitle from '@/composables/useBookingTitle';
import { platformStyles } from '@/constants/platformStyles';
import { BookingApprovalState, Platform } from '@/enums';
import { useBookingsStore, useUserFeatures } from '@/stores';
import { BookingType } from '@/types';

import BookingInfoCardMiniInfoCard from './BookingInfoCardMiniInfoCard.vue';
import BookingInfoCardSectionClientInfoRow from './BookingInfoCardSectionClientInfoRow.vue';

const emits = defineEmits(['edit']);
const props = defineProps<{
  book: BookingType;
  isAdminPage?: boolean;
}>();

const featureStore = useUserFeatures();
const bookingsStore = useBookingsStore();
const $q = useQuasar();
const { t } = useI18n();
const { formatBookingTitle } = useBookingTitle();

const isShowingGuestsDetailed = ref(false);
const isShowingMore = ref(false);

const reservationId = computed(() => props.book.id ?? `bnb-${props.book.id}`);
const isPlatformWebsite = computed(
  () => props.book.platform === Platform.WEBSITE
);
const isBookingApproved = computed(
  () => props.book.approval_status === BookingApprovalState.CONFIRMED
);
const isNotYetConfirmed = computed(
  () =>
    isPlatformWebsite.value &&
    props.book.approval_status === BookingApprovalState.PENDING
);

const quickActionButtons = computed(() => ({
  ...(featureStore.canConfirmBookings &&
    props.book.client_info?.email &&
    isPlatformWebsite.value &&
    isBookingApproved &&
    props.isAdminPage && { sendConfirmationEmail: true }),
  ...(featureStore.canConfirmBookings &&
    props.book.client_info?.email &&
    isPlatformWebsite.value &&
    props.isAdminPage && { sendCheckinReminderEmail: true }),
  ...(featureStore.canConfirmBookings &&
    props.book.client_info?.email &&
    isPlatformWebsite.value &&
    props.isAdminPage && { sendCheckoutReminderEmail: true }),
}));

const defaultCopy = (textToCopy: string) => {
  navigator.clipboard.writeText(textToCopy);
  $q.notify({
    color: 'success',
    message: t('reuse.copied'),
  });
};

const copyCode = (code?: string) => {
  if (!code) return;

  navigator.clipboard.writeText(code);
  $q.notify({
    color: 'success',
    message: t('reuse.copiedCode') + ` ${code}`,
  });
};

const confirmBooking = async (isConfirmed: boolean) => {
  if (!props.book.id) return;

  if (isConfirmed) {
    await bookingsStore.confirmBooking({
      bookId: props.book.id,
    });
  } else {
    await bookingsStore.rejectBooking({
      bookId: props.book.id,
    });
  }
};

const sendCheckinReminder = async () => {
  if (!props.book.id) return;
  await bookingsStore.sendCheckinReminder({
    bookId: props.book.id,
  });
};
const sendCheckoutReminder = async () => {
  if (!props.book.id) return;
  await bookingsStore.sendCheckoutReminder({
    bookId: props.book.id,
  });
};
</script>

<template>
  <div
    :class="[
      'tw-relative',
      'tw-rounded-md tw-flex tw-flex-col sm:tw-flex-row tw-justify-evenly tw-items-stretch tw-overflow-hidden tw-shadow-[0_0_4px_2px_rgba(0,0,0,0.15)]',
      { 'tw-bg-gradient-to-r tw-from-error tw-to-white': isNotYetConfirmed },
      { 'tw-bg-primary/20': book.current },
    ]"
  >
    <div class="tw-w-full tw-flex tw-flex-col tw-gap-2">
      <div class="tw-w-full tw-px-4 tw-py-2">
        <div>
          <div class="tw-flex tw-items-start tw-gap-2">
            <div class="tw-flex tw-items-center tw-gap-2">
              <img
                v-if="isNotYetConfirmed"
                src="../../../assets/images/icons/report_white_24dp.svg"
                width="24"
              />
              <h5 class="tw-text-base tw-font-bold">
                {{ formatBookingTitle(book) }}
              </h5>
            </div>

            <span
              :class="[
                'tw-w-16 tw-text-center tw-text-[8px] tw-font-bold tw-leading-3 tw-px-3 tw-py-px tw-rounded-full tw-shadow-sm',
                platformStyles[book.platform],
              ]"
            >
              {{ book.platform }}
            </span>
          </div>
          <div v-if="book.notes" class="tw-mt-2 tw-text-sm tw-text-black7">
            {{ book.notes }}
          </div>
        </div>
      </div>

      <div
        :class="[
          'tw-w-full tw-px-4 tw-py-2',
          'tw-flex tw-flex-col tw-gap-1 tw-text-sm',
        ]"
      >
        <div :class="['tw-w-full tw-grid tw-grid-cols-2 tw-gap-2']">
          <BookingInfoCardMiniInfoCard
            v-show="isShowingMore"
            row-title="Check-in"
            strecth
          >
            <span class="tw-font-bold tw-text-base">{{ '14:00' }}</span>
          </BookingInfoCardMiniInfoCard>
          <BookingInfoCardMiniInfoCard
            v-show="isShowingMore"
            row-title="Check-out"
            strecth
          >
            <span class="tw-font-bold tw-text-base">{{ '10:00' }}</span>
          </BookingInfoCardMiniInfoCard>
          <BookingInfoCardMiniInfoCard
            v-if="book.keybox?.first_code"
            :row-title="t('booking_info.fields.keybox')"
            strecth
          >
            <q-chip
              v-if="book.keybox?.first_code"
              label="13:00 to 03:00"
              clickable
              size="xs"
              class="tw-m-0"
              @click="copyCode(book.keybox.first_code)"
            />
            <q-chip
              v-if="book.keybox?.second_code"
              label="Backup"
              clickable
              size="xs"
              class="tw-m-0"
              @click="copyCode(book.keybox.second_code)"
            />
          </BookingInfoCardMiniInfoCard>
          <BookingInfoCardMiniInfoCard
            v-if="isAdminPage"
            :row-title="t('booking_info.fields.price')"
            strecth
          >
            <q-icon name="euro" />
            <span>{{ book.price ?? 0 }}</span>
          </BookingInfoCardMiniInfoCard>
        </div>

        <BookingInfoCardMiniInfoCard
          :row-title="`${t('booking_info.fields.guests')}: ${sumGuests(book.guests)}`"
          strecth
          :hideContent="!isShowingGuestsDetailed"
        >
          <template #action>
            <q-btn
              flat
              size="md"
              padding="0"
              :icon-right="
                isShowingGuestsDetailed ? 'expand_less' : 'expand_more'
              "
              class="tw-size-6"
              @click="isShowingGuestsDetailed = !isShowingGuestsDetailed"
            />
          </template>

          <div
            v-show="isShowingGuestsDetailed"
            class="tw-w-full tw-py-2 tw-flex tw-justify-between tw-items-center tw-gap-2 tw-text-[11px] tw-font-bold"
          >
            <div
              v-if="book.guests.adults"
              class="tw-flex tw-flex-col tw-justify-center tw-items-center"
            >
              <span>{{ book.guests.adults || 0 }} 🧑🏻</span>
              <span>{{ t('booking_info.fields.adults') }} (18+)</span>
            </div>
            <div class="tw-flex tw-flex-col tw-justify-center tw-items-center">
              <span>{{ book.guests.children || 0 }} 🧒🏻</span>
              <span>{{ t('booking_info.fields.children') }} (3+)</span>
            </div>
            <div class="tw-flex tw-flex-col tw-justify-center tw-items-center">
              <span>{{ book.guests.infants || 0 }} 👶🏻</span>
              <span>{{ t('booking_info.fields.infants') }}</span>
            </div>
          </div>
        </BookingInfoCardMiniInfoCard>

        <div
          v-if="!isShowingMore"
          class="tw-mt-2 tw-flex tw-justify-center tw-items-center"
        >
          <q-btn
            fab
            dense
            size="xs"
            padding="0"
            :icon="isShowingMore ? 'expand_less' : 'expand_more'"
            @click="isShowingMore = !isShowingMore"
          />
        </div>

        <BookingInfoCardMiniInfoCard
          v-if="isShowingMore && reservationId"
          :row-title="t('booking_info.fields.booking_code')"
          strecth
        >
          <template #action>
            <q-btn
              flat
              dense
              size="sm"
              @click="defaultCopy(String(reservationId))"
            >
              <q-icon name="content_copy" size="xs" />
            </q-btn>
          </template>

          <BaseAnchorLink
            :href="`https://happyplacepatras.gr/?reservation=${reservationId}`"
            target="_blank"
            rel="opener"
            class="tw-truncate"
          >
            {{ reservationId }}
          </BaseAnchorLink>
        </BookingInfoCardMiniInfoCard>

        <BookingInfoCardMiniInfoCard
          v-if="
            isShowingMore &&
            (book.client_info?.name ||
              book.client_info?.email ||
              book.client_info?.mobile)
          "
          :row-title="t('booking_info.fields.info_details')"
          strecth
        >
          <div
            v-if="book.client_info?.name"
            class="tw-w-full tw-flex tw-flex-col tw-gap-1"
          >
            <div class="tw-flex tw-gap-2 tw-text-sm">
              <q-icon name="person" size="xs" />
              <div class="tw-line-clamp-2 tw-text-xs">
                {{ book.client_info?.name }}
              </div>
            </div>

            <div
              v-if="book.client_info?.email"
              class="tw-flex tw-gap-2 tw-text-sm"
            >
              <q-icon name="email" size="xs" />
              <BaseAnchorLink
                :href="`mailto:${book.client_info.email}`"
                class="tw-break-all"
              >
                {{ book.client_info.email }}
              </BaseAnchorLink>
            </div>

            <div
              v-if="book.client_info?.mobile"
              class="tw-flex tw-gap-2 tw-text-sm"
            >
              <q-icon name="phone" size="xs" />
              <BaseAnchorLink :href="`tel:${book.client_info.mobile}`">
                {{ book.client_info.mobile }}
              </BaseAnchorLink>
            </div>
          </div>
        </BookingInfoCardMiniInfoCard>

        <BookingInfoCardSectionClientInfoRow
          v-if="book.message && isShowingMore"
          :row-title="t('booking_info.fields.client_message')"
        >
          <div
            class="tw-my-1 tw-text-xs tw-italic tw-text-black8 tw-line-clamp-3"
          >
            {{ book.message }}
          </div>
        </BookingInfoCardSectionClientInfoRow>
      </div>

      <!-- Quick card actions approve/reject -->
      <div
        v-if="isNotYetConfirmed && featureStore.canConfirmBookings"
        :class="[
          'tw-w-full tw-px-4 tw-py-2',
          'tw-border-t tw-border-black/10',
          'tw-flex tw-flex-wrap tw-justify-start tw-items-center tw-gap-2',
        ]"
      >
        <q-btn
          size="sm"
          color="negative"
          @click.prevent="() => confirmBooking(false)"
        >
          {{ t('booking_info.actions.reject') }}
        </q-btn>
        <q-btn
          size="sm"
          color="positive"
          @click.prevent="() => confirmBooking(true)"
        >
          {{ t('booking_info.actions.confirm') }}
        </q-btn>
      </div>

      <!-- Quick card general actions -->
      <div
        v-if="Object.keys(quickActionButtons).length && isShowingMore"
        :class="[
          'tw-w-full tw-px-4 tw-py-2',
          'tw-border-t tw-border-black/10',
          'tw-flex tw-flex-wrap tw-justify-start tw-items-center tw-gap-2',
        ]"
      >
        <q-btn
          v-if="quickActionButtons.sendConfirmationEmail"
          size="sm"
          color="orange"
          no-caps
          class="tw-basis-1"
          @click.prevent="() => confirmBooking(true)"
        >
          {{ t('booking_info.actions.resend_confirmation_email') }}
        </q-btn>
        <q-btn
          v-if="quickActionButtons.sendCheckinReminderEmail"
          size="sm"
          color="info"
          no-caps
          class="tw-basis-1"
          @click.prevent="sendCheckinReminder"
        >
          {{ t('booking_info.actions.send_check_in_reminder_email') }}
        </q-btn>
        <q-btn
          v-if="quickActionButtons.sendCheckoutReminderEmail"
          size="sm"
          color="info"
          no-caps
          class="tw-basis-1"
          @click.prevent="sendCheckoutReminder"
        >
          {{ t('booking_info.actions.send_check_out_reminder_email') }}
        </q-btn>
      </div>
    </div>

    <div
      v-if="isAdminPage"
      class="tw-absolute tw-top-0 tw-right-0 tw-rounded tw-overflow-hidden tw-shadow-[-3px_0_1rem_0_rgba(5,5,2,0.15)]"
    >
      <q-btn
        v-if="book.is_booking_closed"
        unelevated
        dense
        square
        icon="check"
        color="positive"
        :disable="book.is_booking_closed"
        class="tw-w-full tw-h-full"
        @click="emits('edit', book)"
      />
      <q-btn
        v-else
        unelevated
        dense
        square
        icon="edit"
        color="white"
        text-color="black"
        class="tw-w-full tw-h-full"
        @click="emits('edit', book)"
      />
    </div>
  </div>
</template>
