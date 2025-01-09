<template>
  <div class="tw-h-[70vh] tw-w-full tw-overflow-hidden">
    <div
      :class="[
        'tw-overflow-y-auto tw-w-full tw-h-full tw-border tw-border-primary tw-rounded-lg tw-p-4',
      ]"
    >
      <div class="tw-flex tw-flex-col tw-gap-4">
        <slot />
      </div>
    </div>
  </div>
</template>
