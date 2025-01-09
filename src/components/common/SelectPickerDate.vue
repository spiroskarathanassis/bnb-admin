<script setup lang="ts">
import { ref } from 'vue';

defineProps(['selectedDate', 'fieldName', 'zIndex', 'disabled', 'dark']);
const emits = defineEmits(['update:selectedDate']);

const isModalOpened = ref(false);

const handleDateUpdate = (newDate: string) => {
  emits('update:selectedDate', newDate);
  isModalOpened.value = false;
};
</script>

<template>
  <q-input
    :model-value="selectedDate"
    readonly
    dense
    :dark="dark"
    @click="
      () => {
        if (!disabled) isModalOpened = true;
      }
    "
  />

  <Teleport to="body">
    <div
      v-if="isModalOpened"
      class="tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center"
      :style="`z-index: ${zIndex}`"
      @click.self="isModalOpened = false"
    >
      <q-date
        :subtitle="fieldName"
        :modelValue="selectedDate"
        mask="YYYY-MM-DD"
        first-day-of-week="1"
        :disable="disabled"
        :dark="dark"
        @update:modelValue="handleDateUpdate"
      />
    </div>
  </Teleport>
</template>
