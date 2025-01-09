<template>
  <ViewModalBooking
    v-if="notyType === 'booking'"
    :nextBook="noty.item"
    :prevBook="noty.prev_item"
    @closeModal="closeModal"
  />
  <ViewModalExchange
    v-else-if="['purchase', 'bill', 'transaction'].includes(notyType)"
    :nextItem="noty.item"
    :prevItem="noty.prev_item"
    :notyType="noty.type"
    @closeModal="closeModal"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { Noty } from '@/types';

import ViewModalBooking from './ViewModal/ViewModalBooking.vue';
import ViewModalExchange from './ViewModal/ViewModalExchange.vue';

const emit = defineEmits(['closeModal']);
const props = defineProps<{
  noty: Noty;
}>();

const notyType = computed(() => props.noty?.type);

const closeModal = () => {
  emit('closeModal');
};
</script>
