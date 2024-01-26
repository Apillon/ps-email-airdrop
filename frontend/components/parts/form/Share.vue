<script lang="ts" setup>
defineProps({
  metadata: { type: Object as PropType<Metadata>, default: null },
  txHash: { type: String, default: null },
});
</script>

<template>
  <div v-if="metadata" class="max-w-md w-full md:px-6 my-12 mx-auto">
    <div class="my-8 text-center">
      <h3 class="mb-6">Celebrate your triumph!</h3>
      <p>Display Your '{{ metadata.name }}' NFT Collectible on Social Media for All to Envy.</p>
    </div>

    <div class="rounded-lg overflow-hidden mb-8">
      <img :src="metadata.image" class="" width="400" height="400" alt="nft" />

      <div class="p-6 bg-bg-lighter">
        <h5>{{ metadata.name }}</h5>
      </div>
      <div class="mt-4 text-center">
        <p class="mb-4">{{ metadata.description }}</p>
        <a
          v-if="txHash"
          :href="`https://sepolia.etherscan.io/tx/${txHash}`"
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
      :href="`https://twitter.com/intent/tweet?text=Display Your '${metadata.name}' NFT Collectible on Social Media for All to Envy.`"
    >
      <span class="inline-flex gap-2 items-center">
        <NuxtIcon name="x" class="text-xl" />
        <span>Share on X</span>
      </span>
    </Btn>
  </div>
</template>
