<script lang="ts" setup>
import NftPNG from '~/assets/images/nft.png';
</script>

<template>
  <div class="max-w-md w-full md:px-6 my-12 mx-auto">
    <div class="my-8 text-center">
      <h3 class="mb-6">Celebrate your triumph!</h3>
      <p>Display Your 'NFTino' NFT Collectible on Social Media for All to Envy.</p>
    </div>

    <div class="rounded-lg overflow-hidden mb-8">
      <img :src="NftPNG" class="" width="400" height="400" alt="nft" />

      <div class="p-6 bg-bg-lighter">
        <h5>NFT Nino</h5>
      </div>
    </div>

    <Btn
      type="secondary"
      size="large"
      :href="`https://twitter.com/intent/tweet?text=Display Your 'NFTino' NFT Collectible on Social Media for All to Envy.`"
    >
      <span class="inline-flex gap-2 items-center">
        <NuxtIcon name="x" class="text-xl" />
        <span>Share on X</span>
      </span>
    </Btn>
  </div>
</template>
