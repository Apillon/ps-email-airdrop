<template>
  <nav class="max-w-7xl w-full px-8 py-5 mx-auto flex gap-8 justify-between items-center">
    <div class="py-2">
      <RouterLink to="/">
        <Logo :width="162" :height="28" />
      </RouterLink>
    </div>
    <div>
      <!-- <Btn type="secondary" size="small" class="bg-bg-dark !text-blue" @click="">
        Disconnect Sporran
      </Btn>
      <Btn class="opacity-60 cursor-default" type="primary" size="large" :color="colors.blue" round>
        selectPlan
      </Btn> -->
    </div>
  </nav>
</template>
<script lang="ts" setup>
import colors from '~/tailwind.colors';
</script>
