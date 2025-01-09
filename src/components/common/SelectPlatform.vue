<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { Platform } from '@/enums';

const platformModel = defineModel();
const { t } = useI18n();
</script>

<template>
  <q-select
    v-model="platformModel"
    :options="Object.values(Platform)"
    :label="t('reuse.platform')"
    outlined
    options-dense
    dense
    bg-color="white"
    style="min-width: 120px"
  />
</template>
