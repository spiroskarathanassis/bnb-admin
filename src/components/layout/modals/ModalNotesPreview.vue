<script setup lang="ts">
import { toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import BaseModal from '@/components/common/BaseModal.vue';

const emit = defineEmits(['closeModal']);
const props = defineProps<{
  notes: {
    title: string;
    text: string;
  };
}>();

const { t } = useI18n();

const closeModal = () => {
  emit('closeModal');
};

const { title, text } = toRefs(props.notes);
</script>

<template>
  <BaseModal>
    <template #title>
      {{ title }}
    </template>

    <template #default>
      <div class="tw-min-h-20">{{ text }}</div>
    </template>

    <template #footer>
      <div class="tw-w-full tw-flex tw-justify-center tw-items-center">
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
    </template>
  </BaseModal>
</template>
