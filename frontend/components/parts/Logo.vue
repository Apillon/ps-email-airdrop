<template>
  <img src="/images/logo/apillon.png" :width="width" :height="height" :alt="alt" />
</template>

<script lang="ts" setup>
defineProps({
  alt: { type: String, default: 'Apillon logo' },
  height: { type: Number, default: 19 },
  width: { type: Number, default: 110 },
});
</script>
