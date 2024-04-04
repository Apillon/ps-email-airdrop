<script lang="ts" setup>
defineProps({
  size: { type: Number, default: 24 },
  width: { type: Number, default: 2 },
  color: { type: String, default: 'currentColor' },
});
</script>

<template>
  <svg
    :class="$style.spinner"
    :style="{
      margin: `-${size / 2}px 0 0 -${size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
    }"
    viewBox="0 0 50 50"
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
      :stroke="color"
      :stroke-width="width"
      :class="$style.path"
    ></circle>
  </svg>
</template>

<style module>
.spinner {
  animation: rotate 2s linear infinite;
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;

  .path {
    stroke-dasharray: 8, 10;
    animation: dash 8s ease-in-out infinite;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dashoffset: -124;
  }
}
</style>
