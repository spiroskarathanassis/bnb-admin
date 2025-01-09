<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    subLabel?: string;
    errorMessage?: string;
    errorField?: boolean;
    type?: 'text' | 'number' | 'textarea';
    variant?: 'outlined' | 'standard';
    min?: number | string;
    dark?: boolean;
  }>(),
  {
    dark: false,
    errorField: false,
    errorMessage: undefined,
    label: '',
    min: undefined,
    subLabel: '',
    type: 'text',
    variant: 'standard',
  }
);

const model = defineModel<string | number | undefined>();
const slots = defineSlots<{
  default: null;
  error: null;
}>();
</script>

<template>
  <div class="tw-flex tw-flex-col tw-gap-2">
    <label
      v-if="label || subLabel"
      :class="[
        !dark ? 'tw-text-primary' : 'tw-text-grannyWhite',
        { 'tw-text-xs': subLabel },
      ]"
    >
      {{ label || subLabel }}
    </label>

    <span v-if="slots.default && errorField" class="tw-text-error tw-text-xs">
      {{ errorMessage }}
    </span>

    <div class="tw-w-full">
      <q-input
        v-if="!slots.default"
        v-model.trim="model"
        dense
        :outlined="variant === 'outlined'"
        :type="type"
        :error="errorField"
        :error-message="errorMessage"
        hide-bottom-space
        rows="4"
        :min="min"
        :dark="dark"
      />
      <slot v-else />
    </div>
  </div>
</template>
