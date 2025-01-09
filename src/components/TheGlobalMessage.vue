<script setup lang="ts">
import { useQuasar } from 'quasar';
import { watch } from 'vue';

import { useMainStore } from '@/stores';

const mainStore = useMainStore();
const $q = useQuasar();

watch(
  () => mainStore.globalAlert,
  (nextAlert) => {
    if (nextAlert.message)
      $q.notify({
        color: nextAlert.type,
        message: nextAlert.message,
      });
  }
);
</script>
