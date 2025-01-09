<script setup lang="ts">
import { DirectionBtn } from '@/enums';

const emit = defineEmits([DirectionBtn.LEFT, DirectionBtn.RIGHT]);
withDefaults(
  defineProps<{
    showButtons?: DirectionBtn[];
  }>(),
  {
    showButtons: () => Object.values(DirectionBtn),
  }
);

const clickDirection = (direction: DirectionBtn) => {
  emit(direction);
};
</script>

<template>
  <div class="tw-h-full">
    <q-btn
      v-show="showButtons.includes(DirectionBtn.LEFT)"
      color="white"
      fab
      dense
      padding="0.25rem"
      size="small"
      icon="chevron_left"
      text-color="black"
      class="tw-absolute tw-top-1/2 tw-left-4"
      @click="clickDirection(DirectionBtn.LEFT)"
    />
    <q-btn
      v-show="showButtons.includes(DirectionBtn.RIGHT)"
      color="white"
      fab
      dense
      padding="0.25rem"
      size="small"
      icon="chevron_right"
      text-color="black"
      class="tw-absolute tw-top-1/2 tw-right-4"
      @click="clickDirection(DirectionBtn.RIGHT)"
    />
  </div>
</template>
