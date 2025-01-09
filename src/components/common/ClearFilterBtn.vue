<script setup lang="ts">
defineProps<{ isDisabled: boolean }>();

const emit = defineEmits(['clear']);
</script>

<template>
  <q-btn
    outline
    padding="sm"
    unelevated
    :color="!isDisabled ? 'primary' : 'grey'"
    style="background: white"
    :icon="isDisabled ? 'filter_list' : 'filter_list_off'"
    :disable="isDisabled"
    @click="!isDisabled && emit('clear')"
  />
</template>
