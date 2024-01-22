<template>
  <nav class="container py-5 flex gap-8 justify-between items-center">
    <div v-if="logoCenter" class="w-1/3"></div>
    <div class="py-2" :class="{ 'w-1/3 text-center': logoCenter }">
      <RouterLink class="inline-block" to="/">
        <Logo :width="162" :height="28" />
      </RouterLink>
    </div>
    <div :class="{ 'w-1/3 text-right': logoCenter }">
      <span v-if="address && (!admin || userStore.jwt)" class="mr-4">{{ shortHash(address) }}</span>
      <Btn
        v-if="isConnected && (!admin || userStore.jwt)"
        size="small"
        :color="colors.blue"
        :loading="loading"
        @click="disconnectWallet()"
      >
        Disconnect
      </Btn>
      <Btn
        v-else-if="isConnected"
        size="small"
        :color="colors.blue"
        :loading="loading"
        @click="login()"
      >
        Login
      </Btn>
      <Btn
        v-else
        size="small"
        :color="colors.blue"
        :loading="loading"
        @click="modalWalletVisible = true"
      >
        Connect wallet
      </Btn>
    </div>
  </nav>

  <modal
    :show="modalWalletVisible"
    @close="() => (modalWalletVisible = false)"
    @update:show="modalWalletVisible = false"
  >
    <FormWallet />
  </modal>
</template>

<script lang="ts" setup>
import colors from '~/tailwind.colors';
import { useAccount, useConnect, useDisconnect, useWalletClient } from 'use-wagmi';

type LoginInterface = {
  jwt: string;
};
type LoginResponse = GeneralResponse<LoginInterface>;

const props = defineProps({
  admin: { type: Boolean, default: false },
  logoCenter: { type: Boolean, default: false },
});

const { error } = useMessage();
const userStore = useUserStore();
const { handleError } = useErrors();

const { connect, connectors } = useConnect();
const { data: walletClient, refetch } = useWalletClient();
const { address, isConnected } = useAccount({ onConnect: loginDelay });
const { disconnect } = useDisconnect();

const loading = ref<boolean>(false);
const modalWalletVisible = ref<boolean>(false);

async function login() {
  loading.value = true;
  try {
    if (!isConnected.value) {
      await connect({ connector: connectors.value[0] });
    } else {
      await refetch();

      if (!walletClient.value) {
        await connect({ connector: connectors.value[0] });

        if (!walletClient.value) {
          error('Could not connect with wallet');
          loading.value = false;
          return;
        }
      }

      if (!props.admin) {
        loading.value = false;
        return;
      }

      const timestamp = new Date().getTime();
      const message = 'test';

      const signature = await walletClient.value.signMessage({
        message: `${message}\n${timestamp}`,
      });
      const res = await $api.post<LoginResponse>('/login', {
        signature,
        timestamp,
        address: walletClient.value.account.address,
      });
      if (res.data.jwt) {
        userStore.jwt = res.data.jwt;
        $api.setToken(res.data.jwt);
      }
      modalWalletVisible.value = false;
    }
  } catch (e) {
    handleError(e);
  }
  loading.value = false;
}

function loginDelay() {
  setTimeout(() => login(), 100);
}

function disconnectWallet() {
  userStore.jwt = '';
  disconnect();
}
</script>
