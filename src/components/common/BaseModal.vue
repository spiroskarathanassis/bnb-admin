<script lang="ts" setup>
import { onUnmounted, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    hideFixed?: boolean;
    bgColor?: string;
    minimize?: boolean;
    isOpen?: boolean;
  }>(),
  {
    bgColor: 'tw-bg-grannyWhite',
    hideFixed: false,
    isOpen: true,
    minimize: false,
  }
);

const slots = defineSlots<{
  default: null;
  title: null;
  footer: null;
}>();

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  document.body.style.removeProperty('overflow');
});
</script>

<template>
  <div
    v-if="isOpen"
    :class="[
      {
        'tw-fixed tw-top-0 tw-left-0 tw-z-[1000] tw-h-[100dvh] tw-backdrop-blur-sm':
          !hideFixed,
      },
      'tw-w-full tw-flex tw-justify-center tw-items-center',
      minimize ? 'tw-p-2' : 'tw-p-4',
    ]"
  >
    <div
      :class="[
        'tw-w-full tw-max-w-[600px] tw-rounded-lg tw-shadow-md tw-overflow-hidden tw-flex tw-flex-col',
        bgColor,
        { 'tw-max-h-[80%]': !hideFixed },
      ]"
    >
      <div
        v-if="slots.title"
        class="tw-py-4 tw-px-2 sm:tw-px-4 tw-bg-primary tw-text-white tw-w-full"
      >
        <h2
          class="tw-text-2xl tw-font-bold tw-leading-8 tw-text-center tw-line-clamp-2"
        >
          <slot name="title" />
        </h2>
      </div>

      <div class="tw-py-4 tw-px-2 sm:tw-px-4 tw-flex-1 tw-overflow-y-auto">
        <slot />
      </div>

      <div
        v-if="slots.footer"
        class="tw-py-4 tw-px-2 sm:tw-px-4 tw-border-t tw-border-primary"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
