<script lang="ts" setup>
import { useAccount, useConnect, useWalletClient } from 'use-wagmi';
const items = ref(null);
const { vueApp } = useNuxtApp();
const { data: walletClient, refetch } = useWalletClient();
const { isConnected } = useAccount();
const $papa = vueApp.config.globalProperties.$papa;

let jwt: any = null;

const { connect, connectors } = useConnect({
  onSuccess() {
    console.log('connected');
  },
});

useHead({
  title: 'Apillon email airdrop prebuilt solution',
  titleTemplate: '',
});

async function getUsers() {
  const res = await $api.get('/users');
  items.value = res.data.items;
}

onMounted(async () => {
  if (jwt) {
    await getUsers();
  }
});

function uploadFileRequest({ file, onError, onFinish }: NUploadCustomRequestOptions) {
  if (file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
    console.warn(file.type);
    // message.warning($i18n.t('validation.fileTypeNotCsv'));

    /** Mark file as failed */
    onError();
    return;
  }
  parseUploadedFile(file.file);
}

function parseUploadedFile(file?: File | null) {
  if (!file) {
    return;
  }
  console.log(file);

  $papa.parse(file, {
    header: false,
    skipEmptyLines: true,
    complete: async (results: CsvFileData) => {
      if (results.data.length) {
        const users = [];
        for (const r of results.data) {
          users.push({ email: r[0] });
        }
        await $api.post('/users', { users });
        await getUsers();
      } else {
        alert('empty csv');
      }
    },
    error: function (error: string) {
      console.log(error);
      alert('error reading csv');
    },
  });
}

async function login() {
  if (!isConnected.value) {
    await connect({ connector: connectors.value[0] });
  } else {
    await refetch();
    if (!walletClient.value) {
      alert('walletNotConnected');
      return;
    }
    console.log(walletClient.value);
    const timestamp = new Date().getTime();
    const message = 'test';

    const signature = await walletClient.value.signMessage({ message: `${message}\n${timestamp}` });
    const res = await $api.post('/login', {
      signature,
      timestamp,
    });
    jwt = res.data.jwt;
    if (jwt) {
      $api.setToken(jwt);
      await getUsers();
    }
  }
}
</script>

<template>
  <div class="grid">
    <div class="text-lg">Email airdrop</div>

    <Btn v-if="!isConnected" @click="connect({ connector: connectors[0] })">Connect wallet</Btn>
    <Btn v-if="isConnected && !items" type="primary" @click="login()">Login</Btn>
    <div v-if="isConnected && items">
      <br />
      <n-upload
        :show-file-list="false"
        accept=".csv, application/vnd.ms-excel"
        :custom-request="uploadFileRequest"
      >
        <Btn type="secondary"> Choose File </Btn>
      </n-upload>
      <Btn type="primary" @click="modalMetadataAttributesVisible = true"> Confirm </Btn>
      <br />
      <div class="grid grid-cols-4 gap-4 font-bold">
        <div>Email:</div>
        <div>Status:</div>
      </div>
      <div v-for="(item, index) in items" :key="index" class="grid grid-cols-4 gap-4">
        <div>{{ item.email }}</div>
        <div>{{ item.airdrop_status }}</div>
      </div>
    </div>
  </div>
</template>
