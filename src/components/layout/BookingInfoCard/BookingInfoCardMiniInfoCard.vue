<script setup lang="ts">
defineProps<{
  rowTitle: string;
  strecth?: boolean;
  hideContent?: boolean;
}>();
</script>

<template>
  <div
    :class="[
      'tw-flex tw-flex-col tw-gap-1',
      'tw-border tw-border-gray-200 tw-rounded-md tw-p-2',
      strecth ? 'tw-w-full' : 'tw-max-w-[136px] sm:tw-max-w-[160px]',
    ]"
  >
    <div class="tw-h-6 tw-flex tw-justify-between tw-items-start tw-gap-1">
      <div class="tw-font-semibold tw-text-xs tw-leading-6 tw-line-clamp-1">
        {{ rowTitle }}
      </div>
      <div v-if="$slots.action" class="tw-size-6">
        <slot name="action" />
      </div>
    </div>
    <hr v-if="!hideContent" class="tw-border-gray-200 tw-m-0" />
    <div
      v-if="$slots.default && !hideContent"
      class="tw-flex tw-items-center tw-gap-2 tw-overflow-hidden tw-text-black8"
    >
      <slot />
    </div>
  </div>
</template>
