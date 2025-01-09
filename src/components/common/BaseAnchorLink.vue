<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  href: string;
  isInternal?: boolean;
}>();

const elementTag = computed(() => {
  return props.isInternal ? 'router-link' : 'a';
});
</script>

<template>
  <component
    :is="elementTag"
    :to="href"
    :href="href"
    :class="[
      'tw-text-accent',
      'tw-font-bold',
      'tw-no-underline',
      'tw-transition',
      'tw-duration-200',
      'tw-ease-in-out',
      'hover:tw-text-primary/90',
    ]"
  >
    <slot />
  </component>
</template>
