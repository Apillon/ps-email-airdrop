<script lang="ts" setup>
import { prepareOG } from '~/lib/utils/helpers';
import { Chains } from '~/lib/values/general.values';

useHead({
  title: 'Mint your NFT Token',
});

const router = useRouter();
const { query } = useRoute();
const config = useRuntimeConfig();
const { watchAsset } = useContract();

useSeoMeta(prepareOG(`Just minted my ${query.name} NFT on Apillon!`, ``, `${query.image}`));

onBeforeMount(() => {
  if (!query.name || !query.image) {
    router.push('/');
  }
});

const metadata = ref<Metadata | null>({
  name: `${query?.name}`,
  description: `${query?.description}`,
  image: `${query?.image}`,
});
const nftId = ref<string | undefined>(`${query?.nftId}`);
const txHash = ref<string | undefined>(`${query?.txHash}`);

function transactionLink(transactionHash?: string | null): string {
  switch (config.public.CHAIN_ID) {
    case Chains.MOONBEAM:
      return transactionHash
        ? `https://moonbeam.moonscan.io/tx/${transactionHash}`
        : 'https://moonbeam.moonscan.io';
    case Chains.MOONBASE:
      return transactionHash
        ? `https://moonbase.moonscan.io/tx/${transactionHash}`
        : 'https://moonbase.moonscan.io';
    case Chains.ASTAR:
      return transactionHash
        ? `https://astar.subscan.io/tx/${transactionHash}`
        : 'https://astar.subscan.io';
    default:
      console.warn('Missing chainId');
      return '';
  }
}
</script>

<template>
  <div v-if="metadata" class="max-w-md w-full md:px-6 my-12 mx-auto">
    <div class="my-8 text-center">
      <h3 class="mb-6">Just minted my #{{ metadata.name }} NFT on Apillon!</h3>
      <p></p>
    </div>

    <div class="rounded-lg overflow-hidden mb-8">
      <img :src="metadata.image" class="" width="400" height="400" alt="nft" />

      <div class="p-6 bg-bg-light">
        <h5>{{ metadata.name }}</h5>
      </div>
      <div class="mt-4 text-center">
        <p class="mb-4">{{ metadata.description }}</p>

        <!-- Import NFT -->
        <Btn
          v-if="query?.nftId && nftId"
          size="large"
          class="!text-black mb-6 mobile:hidden"
          @click="watchAsset(nftId)"
        >
          Import NFT to wallet
        </Btn>

        <!-- Transaction -->
        <a
          v-if="query?.txHash && txHash"
          :href="transactionLink(txHash)"
          class="text-yellow hover:underline"
          target="_blank"
        >
          Transaction: {{ shortHash(txHash) }}
        </a>
      </div>
    </div>

    <Btn
      type="secondary"
      size="large"
      :href="`https://twitter.com/intent/tweet?text=Just minted my ${metadata.name} NFT on Apillon!&url=https://apillon.io/`"
    >
      <span class="inline-flex gap-2 items-center">
        <NuxtIcon name="x" class="text-xl" />
        Share on X
      </span>
    </Btn>
  </div>
</template>
