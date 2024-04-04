<script lang="ts" setup>
import { ModalProps } from 'naive-ui';

/**
 * https://github.com/vuejs/core/issues/8286#issuecomment-1545659320
 * Remove once naive-ui updates (https://github.com/tusen-ai/naive-ui/issues/4810)
 */
interface Props extends /* @vue-ignore */ ModalProps {
  title?: string;
  innerClass?: string;
}

const props = defineProps<Props>();
const emits = defineEmits(['close']);
</script>

<template>
  <n-modal
    v-bind="$attrs"
    class="min-w-full max-w-full border border-solid border-tq bg-bg xs:min-w-[400px] sm:min-w-[487px]"
  >
    <div class="relative" :class="innerClass || 'px-3 py-6 sm:p-10'">
      <!-- Close Button -->
      <!-- eslint-disable vue/require-explicit-emits -->
      <button
        class="absolute right-3 top-2 z-10 block !p-0.5 text-tq hover:text-tq-hover sm:right-5 sm:top-5"
        @click="$emit('close', false)"
      >
        <NuxtIcon name="close" class="text-[18px]" />
      </button>

      <!-- Title -->
      <h2
        v-if="props.title"
        class="mb-6 text-center text-xl font-medium text-blue sm:mb-10 md:text-3xl"
      >
        {{ props.title }}
      </h2>

      <!-- Content -->
      <slot />
    </div>
  </n-modal>
</template>
