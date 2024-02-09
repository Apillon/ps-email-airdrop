<script lang="ts" setup>
import SuccessSVG from '~/assets/images/success.svg';
import { useAccount, useConnect, useWalletClient } from 'use-wagmi';

definePageMeta({
  layout: 'claim',
});
useHead({
  title: 'Apillon email airdrop prebuilt solution',
});

const { query } = useRoute();
const router = useRouter();
const message = useMessage();
const txWait = useTxWait();
const { handleError } = useErrors();

const { address, isConnected } = useAccount();
const { data: walletClient, refetch } = useWalletClient();
const { connect, connectors } = useConnect();

const loading = ref<boolean>(false);
const metadata = ref<Metadata | null>(null);
const txHash = ref<string | undefined>();

onBeforeMount(() => {
  if (!query.token) {
    router.push('/');
  }
});

async function claimAirdrop() {
  loading.value = true;
  try {
    await refetch();
    const timestamp = new Date().getTime();

    if (!walletClient.value) {
      await connect({ connector: connectors.value[0] });

      if (!walletClient.value) {
        message.error('Could not connect with wallet');
        loading.value = false;
        return;
      }
    }

    const signature = await walletClient.value.signMessage({ message: `test\n${timestamp}` });
    const res = await $api.post<ClaimResponse>('/users/claim', {
      jwt: query.token?.toString() || '',
      signature,
      address: address.value,
      timestamp,
    });

    if (res.data && res.data.success) {
      txWait.hash.value = res.data.transactionHash;

      console.debug('Transaction', txWait.hash.value);
      message.info('Your NFT Mint has started');

      const transaction = await txWait.wait();
      console.log(transaction);
      message.success('You successfully claimed NFT');

      loadNft();
    }
  } catch (e) {
    handleError(e);
  }
  loading.value = false;
}

async function loadNft() {}
</script>

<template>
  <FormShare v-if="metadata" :metadata="metadata" />
  <div v-else class="max-w-md w-full md:px-6 my-12 mx-auto">
    <img :src="SuccessSVG" class="mx-auto" width="165" height="169" alt="airdrop" />

    <div class="my-8 text-center">
      <h3 class="mb-6">Great Success!</h3>
      <p>
        To join this NFT airdrop, you need to connect your EVM compatible wallet. This step is
        crucial for securely receiving and managing the airdropped NFTs.
      </p>
    </div>

    <ConnectWallet v-if="!isConnected" size="large" />
    <Btn v-else size="large" :loading="loading" @click="claimAirdrop()">Claim airdrop</Btn>
  </div>
</template>
