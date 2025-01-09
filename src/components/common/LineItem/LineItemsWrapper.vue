<script setup lang="ts" generic="T">
defineProps<{
  lineItems: {
    [period: string]: T[];
  };
}>();
</script>

<template>
  <div class="tw-w-full tw-my-8 tw-min-w-[300px]">
    <div
      v-if="Object.keys(lineItems).length"
      class="tw-flex tw-flex-col tw-gap-8"
    >
      <div
        v-for="(lineItem, index) in Object.values(lineItems)"
        :key="index"
        class="tw-flex tw-flex-col tw-gap-2"
      >
        <span class="tw-text-primary/80">
          <slot name="perionName" :lineItem="lineItem" />
        </span>

        <slot :lineItem="lineItem" />
      </div>
    </div>
  </div>
</template>
