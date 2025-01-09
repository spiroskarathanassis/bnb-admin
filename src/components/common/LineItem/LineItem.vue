<script setup lang="ts">
defineProps<{
  tabText: string;
  source?: string;
  price?: string;
  description?: string;
  responsive?: boolean;
}>();

const slots = defineSlots<{
  default: null;
  description: null;
}>();
</script>

<template>
  <div class="tw-w-full">
    <div
      :class="[
        'tw-grid tw-items-center tw-gap-2 tw-relative tw-w-full tw-p-2 tw-rounded-md tw-bg-white tw-overflow-hidden',
        slots.default
          ? 'tw-grid-cols-[min-content_auto_minmax(80px,_max-content)]'
          : 'tw-grid-cols-[min-content_auto]',
      ]"
    >
      <div
        :class="[
          'tw-flex tw-justify-center tw-items-center tw-bg-primary/80 tw-text-white tw-p-2 tw-rounded-md tw-h-full',
          responsive ? 'tw-w-[52px] sm:tw-w-[90px]' : 'tw-w-[90px]',
        ]"
      >
        <span class="tw-truncate">
          {{ tabText }}
        </span>
      </div>

      <div class="tw-grid tw-items-start">
        <span v-if="price" class="tw-text-lg tw-font-medium">
          € {{ price }}
        </span>
        <div class="tw-w-full tw-text-black7 tw-line-clamp-3">
          <span v-if="!slots.description">
            {{ description }}
          </span>
          <slot v-else name="description" />
        </div>
      </div>

      <div
        v-if="slots.default"
        class="tw-flex tw-items-center tw-justify-end tw-gap-2"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
