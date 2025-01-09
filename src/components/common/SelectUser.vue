<script setup lang="ts">
import { computed } from 'vue';

const userModel = defineModel();
const props = defineProps<{
  hasFormStyles?: boolean;
  options: string[] | { label: string; value: string | number }[];
}>();

const selectProps = computed(() => ({
  bgColor: !props.hasFormStyles ? 'white' : undefined,
  inlineStyles: props.hasFormStyles ? '' : 'min-width: 120px',
  outlined: !props.hasFormStyles,
}));

const updateUserModel = (option: string) => {
  userModel.value = option;
};
</script>

<template>
  <q-select
    :model-value="userModel"
    :options="options"
    :outlined="selectProps.outlined"
    options-dense
    dense
    emit-value
    map-options
    :bg-color="selectProps.bgColor"
    :style="selectProps.inlineStyles"
    @update:modelValue="updateUserModel"
  />
</template>
