<template>
  <nav class="container py-5 flex gap-8 justify-between items-center">
    <div v-if="logoCenter" class="w-1/3"></div>
    <div class="py-2" :class="{ 'w-1/3 text-center': logoCenter }">
      <RouterLink class="inline-block" to="/">
        <Logo :width="162" :height="28" />
      </RouterLink>
    </div>
    <div v-if="!hideLogin" :class="{ 'w-1/3 text-right': logoCenter }">
      <ConnectWallet :admin="admin" :color="colors.blue" />
    </div>
    <div v-else-if="logoCenter" class="w-1/3"></div>
  </nav>
</template>

<script lang="ts" setup>
import colors from '~/tailwind.colors';

defineProps({
  admin: { type: Boolean, default: false },
  hideLogin: { type: Boolean, default: false },
  logoCenter: { type: Boolean, default: false },
});
</script>
