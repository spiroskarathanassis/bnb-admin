<script setup lang="ts">
import moment from 'moment';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import LineItem from '@/components/common/LineItem/LineItem.vue';
import LineItemsWrapper from '@/components/common/LineItem/LineItemsWrapper.vue';
import { useNotificationsStore } from '@/stores';
import { DbTypeWithKey, Noty } from '@/types';

import NotificationDiffView from '../Notifications/NotificationDiffView.vue';

const NOTY_SEPERATOR = '·';

const { t } = useI18n();
const notificationsStore = useNotificationsStore();

const isModalViewOpen = ref(false);
const viewingNoty = ref<DbTypeWithKey<Noty> | null>(null);

const userNoties = computed<DbTypeWithKey<Noty>[]>(
  () => notificationsStore.getUserNoties
);

const readNoty = (notyKey?: string) => {
  if (!notyKey) return;
  notificationsStore.removeNotyFromUser(notyKey);
};

const formatLastUpdateDate = (notyTime: string) => {
  return moment(notyTime).format('DD/MM/YY');
};

const showDiffs = (noty: DbTypeWithKey<Noty>) => {
  viewingNoty.value = noty;
  isModalViewOpen.value = true;
  // console.log(noty);
};

const closeViewModal = () => {
  isModalViewOpen.value = false;

  const TEN_SECONDS = 3000;
  const timeout = setTimeout(() => {
    readNoty(viewingNoty.value?.key);
    viewingNoty.value = null;
    clearTimeout(timeout);
  }, TEN_SECONDS);
};
</script>

<template>
  <PageTitle>
    {{ t('routes.notifications') }}
  </PageTitle>

  <PageSection v-if="userNoties.length">
    <LineItemsWrapper
      :lineItems="{
        title: userNoties,
      }"
    >
      <template #perionName>
        {{ t('noties_page.latest_notifications') }}
      </template>

      <template #default="{ lineItem }">
        <LineItem
          v-for="noty in lineItem"
          :key="noty.key"
          :source="noty.last_change?.name"
          :tabText="formatLastUpdateDate(noty.last_change.timestamp)"
          :description="t(`noties_page.status.${noty.status}`)"
          class="tw-cursor-pointer"
          @click.prevent="showDiffs(noty)"
        >
          <template #description>
            <strong v-if="noty.last_change?.name">
              {{ noty.last_change.name }} {{ NOTY_SEPERATOR }}
            </strong>
            {{ t(`noties_page.status.${noty.status}`) }}
            <a
              href="#"
              class="tw-text-primary tw-font-semibold hover:tw-opacity-80"
            >
              {{ t(`noties_page.a_type.${noty.type}`) }}
            </a>
          </template>

          <q-btn
            flat
            dense
            size="small"
            icon="close"
            @click.stop.prevent="readNoty(noty.key)"
          />
        </LineItem>
      </template>
    </LineItemsWrapper>
  </PageSection>

  <PageSection v-else>
    <h6 class="tw-text-center tw-text-gray-500">
      {{ t('noties_page.no_notifications') }}
    </h6>
  </PageSection>

  <NotificationDiffView
    v-if="isModalViewOpen && viewingNoty"
    :noty="viewingNoty"
    @closeModal="closeViewModal"
  />
</template>
