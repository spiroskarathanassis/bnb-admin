<script setup lang="ts">
// import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
// import { useRouter } from 'vue-router';

// import { signInWithGoogle } from '@/firebase/actions';

// const SIGN_IN_METHOD = 'google';

const { t } = useI18n();
// const router = useRouter();

// const mapSignSocialProvider = {
//   google: signInWithGoogle,
// };

// const requestSignIn = async () => {
//   await mapSignSocialProvider[SIGN_IN_METHOD]()
//     .then(() => {
//       router.push({ name: 'Calendar' });
//     })
//     .catch((e) => {
//       console.log(e);
//     });
// };
</script>

<template>
  <div
    class="tw-bg-[rgba(208,208,234,0.35)] tw-p-4 tw-rounded-lg tw-backdrop-blur-sm tw-w-full tw-max-w-[300px]"
  >
    <div class="tw-text-center tw-text-2xl tw-mb-6">
      {{ t('reuse.sign_in') }}
    </div>
    <div class="tw-mt-4">
      <q-btn
        class="tw-px-6 tw-py-2 tw-mb-4 tw-w-full"
        label="Go"
        color="primary"
        to="/"
      />
    </div>
  </div>
</template>
