<script lang="ts" setup>
import { useAccount, useConnect, useWalletClient } from 'use-wagmi';

const { vueApp } = useNuxtApp();
const $papa = vueApp.config.globalProperties.$papa;
const $route = useRoute();
const token = computed(() => $route.query.token);
const { address, isConnected } = useAccount();
const { data: walletClient, refetch } = useWalletClient();

const { connect, connectors, isLoading, error, pendingConnector } = useConnect({
  onSuccess() {
    emit('connected');
  },
});

useHead({
  title: 'Apillon email airdrop prebuilt solution',
  titleTemplate: '',
});

async function claimAirdrop() {
  await refetch();
  const timestamp = new Date().getTime();
  if (!walletClient.value) {
    alert('walletNotConnected');
    return;
  }
  const signature = await walletClient.value.signMessage({ message: `test\n${timestamp}` });
  const res = await $api.post('/users/claim', {
    jwt: token?.value?.toString() || '',
    signature,
    address: address.value,
    timestamp,
  });
  if (res.data && res.data.success) {
    alert('airdropped');
  }
}

onMounted(async () => {});
</script>

<template>
  <div class="grid">
    <div class="text-lg">Claim airdrop</div>
    <br />
    <div>Token: {{ token }}</div>
    <Btn v-if="!isConnected" type="primary" @click="connect({ connector: connectors[0] })"
      >Connect wallet</Btn
    >
    <div v-else>
      {{ address }}
      <br />
      <Btn type="primary" @click="claimAirdrop()">Claim airdrop</Btn>
    </div>
  </div>
</template>
