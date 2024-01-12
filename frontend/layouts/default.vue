<template>
  <n-layout class="relative h-screen" :native-scrollbar="false">
    <Header />
    <div class="page-container flex-grow pb-32 pt-1 md:pt-12">
      <slot />
    </div>
  </n-layout>
</template>

<script lang="ts" setup></script>
