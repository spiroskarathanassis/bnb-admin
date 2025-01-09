<script setup lang="ts">
defineProps<{
  rowTitle: string;
}>();
</script>

<template>
  <div class="tw-grid tw-grid-cols-[100px_auto] tw-gap-1">
    <div class="tw-text-xs first-line:tw-leading-6 tw-line-clamp-1">
      {{ rowTitle }}
    </div>
    <div class="tw-flex tw-items-center tw-gap-2">
      <slot />
    </div>
  </div>
</template>
