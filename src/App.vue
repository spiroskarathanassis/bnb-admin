<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import TheGlobalMessage from '@/components/TheGlobalMessage.vue';
import { useMainStore } from '@/stores/useMainStore';

const { locale } = useI18n();
const mainStore = useMainStore();

const route = useRoute();
const isNewBooking = computed(() => route.name === 'NewBooking');

const $q = useQuasar();
// Combine breakpoints with tailwindcss
$q.screen.setSizes({
  lg: 1024,
  md: 768,
  sm: 640,
  xl: 1280,
});

watch(
  () => mainStore.localeUserLanguage,
  (newVal) => {
    locale.value = newVal;
  }
);
</script>

<template>
  <RouterView v-if="route.name === 'Login'" />

  <div
    v-else
    :class="[
      'tw-flex tw-flex-col tw-min-h-dvh tw-h-full',
      isNewBooking ? 'tw-bg-primary' : 'tw-bg-grannyWhite',
    ]"
  >
    <Navbar />

    <div class="tw-flex-grow tw-flex tw-flex-col tw-px-4">
      <router-view />
    </div>

    <footer class="tw-pt-10" />
  </div>

  <TheGlobalMessage />
</template>
