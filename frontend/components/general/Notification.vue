<template>
  <div
    class="inline-block py-2 px-5 border-l-4 w-full bg-bg-dark text-sm"
    :class="notificationClass"
  >
    <span :class="iconClass"></span>
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    validator: (value: string) => ['info', 'error', 'warning', 'success'].includes(value),
    default: 'success',
  },
});

const $style = useCssModule();

const notificationClass = computed(() => {
  return [
    $style.notification,
    {
      'border-blue': props.type === 'info',
      'border-yellow': props.type === 'warning',
      'border-pink': props.type === 'error',
      'border-green': props.type === 'success',
    },
  ];
});

const iconClass = computed(() => {
  return [
    $style.icon,
    {
      'text-blue icon-info': props.type === 'info',
      'text-yellow icon-info': props.type === 'warning',
      'text-pink icon-info': props.type === 'error',
      'text-green icon-check': props.type === 'success',
    },
  ];
});
</script>

<style lang="postcss" module>
.icon {
  @apply mr-2 align-middle text-xl;
}
</style>
