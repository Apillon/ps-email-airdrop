<script lang="ts" setup>
import AirdropSVG from '~/assets/images/airdrop.svg';
import colors from '~~/tailwind.colors';
import { Countdown } from 'vue3-flip-countdown';

defineProps({
  deadline: { type: String, default: '' },
});
</script>

<template>
  <div class="max-w-md w-full md:px-6 my-12 mx-auto">
    <img :src="AirdropSVG" class="mx-auto" width="202" height="240" alt="airdrop claim" />

    <div class="my-8 text-center">
      <h3 class="mb-6">Nino’s soldiers NFT</h3>
      <n-tag class="mb-6" type="info" size="small" :bordered="false" round>
        Only 100 available
      </n-tag>
      <p>
        Connect your wallet to claim Nino's Soldiers NFTs, a unique collection of digital soldier
        characters that blend artistic creativity with the cutting-edge world of blockchain
        collectibles.
      </p>
    </div>

    <div class="">
      <div class="text-center mb-4">
        <strong>Time left to claim</strong>
      </div>
      <Countdown
        :flip-animation="false"
        :label-color="colors.bodyDark"
        :main-color="colors.white"
      />

      <Btn class="mt-8" size="large" @click="$emit('proceed')">Proceed</Btn>
    </div>
  </div>
</template>
