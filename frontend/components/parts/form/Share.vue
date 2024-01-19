<script lang="ts" setup></script>

<template>
  <div class="max-w-md w-full md:px-6 my-12 mx-auto">
    <div class="my-8 text-center">
      <h3 class="mb-6">Celebrate your triumph!</h3>
      <p>Display Your 'NFT Basic' NFT Collectible on Social Media for All to Envy.</p>
    </div>

    <div class="rounded-lg overflow-hidden mb-8">
      <img
        src="https://bafybeiek6y5unwzvseyvc627ykdtnov7k6g27rjfelwfmafri45ciluxhe.ipfs.nectarnode.io/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaWQiOiJiYWZ5YmVpZWs2eTV1bnd6dnNleXZjNjI3eWtkdG5vdjdrNmcyN3JqZmVsd2ZtYWZyaTQ1Y2lsdXhoZSIsInByb2plY3RfdXVpZCI6IjMwNmIxNGRlLWIwZTEtNGMwYi05OGVkLWEwZWQwZWEzODg2OSIsImlhdCI6MTcwNTY2NjY0Mywic3ViIjoiSVBGUy10b2tlbiJ9.Gli699CsKJR4FU-JRISXaxocZ92UfAw2Rdrjv3VvKtU"
        class=""
        width="400"
        height="400"
        alt="nft"
      />

      <div class="p-6 bg-bg-lighter">
        <h5>NFT Basic</h5>
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
