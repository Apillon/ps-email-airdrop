<script lang="ts" setup>
import { NaiveTheme } from '~/lib/config/naive';
import { darkTheme } from 'naive-ui';
</script>

<template>
  <div class="h-full">
    <n-config-provider
      :theme="darkTheme"
      :theme-overrides="NaiveTheme"
      class="flex h-full flex-col"
    >
      <n-message-provider
        placement="bottom-right"
        :keep-alive-on-hover="true"
        :duration="3000"
        closable
      >
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </n-message-provider>

      <n-global-style />
    </n-config-provider>
  </div>
</template>
