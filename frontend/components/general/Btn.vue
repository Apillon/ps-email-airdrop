<template>
  <component
    :is="href ? 'a' : to ? NuxtLink : type === 'link' ? 'button' : NButton"
    v-if="type === 'link' || (!to && !href)"
    v-bind="$attrs"
    :to="to || undefined"
    :href="href || undefined"
    :target="href ? '_blank' : undefined"
    :class="btnClass"
    :type="!href && !to ? (type === 'secondary' ? 'primary' : type) : ''"
    :size="size"
    :disabled="disabled"
    :bordered="type === 'secondary' || type === 'error' ? true : false"
    :ghost="type === 'secondary' || type === 'error' ? true : false"
    :quaternary="quaternary || type === 'builders' ? true : false"
    @click="onClick"
  >
    <span v-if="loading" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <Spinner />
    </span>
    <span :class="[innerClass, { 'opacity-0': loading }]">
      <slot />
    </span>
  </component>
  <component
    :is="to ? NuxtLink : 'a'"
    v-else
    class="inline-block"
    :class="[
      { 'w-full': size === 'large' },
      { 'pointer-events-none pointer-default': props.disabled || props.loading },
    ]"
    :to="props.disabled || props.loading || !to ? undefined : to"
    :href="props.disabled || props.loading || !href ? undefined : href"
    :target="href ? '_blank' : undefined"
  >
    <n-button
      v-bind="$attrs"
      :class="btnClass"
      :type="type === 'secondary' ? 'primary' : (type as NButtonType)"
      :size="size"
      :disabled="disabled"
      :bordered="type === 'secondary' || type === 'error' ? true : false"
      :ghost="type === 'secondary' || type === 'error' ? true : false"
      :quaternary="quaternary || type === 'builders' ? true : false"
      @click="onClick"
    >
      <span v-if="loading" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Spinner />
      </span>
      <span :class="[innerClass, { 'opacity-0': loading }]">
        <slot />
      </span>
    </n-button>
  </component>
</template>

<script lang="ts" setup>
import { NButton } from 'naive-ui';
import {
  type Type as NButtonType,
  type Size as ButtonSize,
} from 'naive-ui/es/button/src/interface';

type ButtonType = NButtonType | 'secondary' | 'builders' | 'link';

const props = defineProps({
  href: { type: String, default: null },
  to: { type: [String, Object], default: null },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  type: { type: String as PropType<ButtonType>, default: 'primary' },
  size: { type: String as PropType<ButtonSize>, default: 'medium' },
  innerClass: { type: [String, Array, Object], default: '' },
  ridged: { type: Boolean, default: false }, // Add ridge border effect instead of solid color
  borderless: { type: Boolean, default: false },
  faded: { type: Boolean, default: false }, // greyed out
  quaternary: { type: Boolean, default: false },
});
const emit = defineEmits(['click']);

const NuxtLink = resolveComponent('NuxtLink');

/** Disable animation on load */
const isBtnLocked = ref<boolean>(!props.href && !props.to);
setTimeout(() => (isBtnLocked.value = false), 1000);

const btnClass = computed(() => {
  return [
    props.type === 'link' ? 'font-sans' : 'font-mono',
    {
      'w-full': props.type !== 'link' && props.size === 'large',
      'text-primary underline': props.type === 'link',
      'font-bold': props.type !== 'link',
      'pointer-events-none pointer-default': props.disabled || props.loading,
      'opacity-60': props.disabled,
      'hover-bounce': props.type !== 'link' && props.type !== 'builders',
      quaternary: props.quaternary || props.type === 'builders',
      locked: isBtnLocked.value,
    },
  ];
});

function onClick(event: MouseEvent) {
  if (props.disabled || props.loading) {
    event.preventDefault();
    event.stopPropagation();
  } else {
    emit('click', event);
  }
}
</script>
