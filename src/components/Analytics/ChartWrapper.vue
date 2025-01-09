<template>
  <div class="tw-w-full tw-rounded-xl tw-bg-primary">
    <h4
      class="tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-2 tw-p-4 tw-text-lg tw-text-white tw-leading-6 tw-border-b tw-border-gray-600"
    >
      <slot name="title" />
    </h4>
    <div class="tw-p-4">
      <slot />
    </div>
  </div>
</template>
