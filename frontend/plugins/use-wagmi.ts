import { UseWagmiPlugin, createConfig } from 'use-wagmi';
import { moonbaseAlpha } from 'use-wagmi/chains';
import { MetaMaskConnector } from 'use-wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'use-wagmi/connectors/coinbaseWallet';
import { createPublicClient, http } from 'viem';

export default defineNuxtPlugin(nuxtApp => {
  const config = createConfig({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({
        moonbaseAlpha,
        options: {
          UNSTABLE_shimOnConnectSelectAccount: true,
        },
      }),
      new CoinbaseWalletConnector({
        moonbaseAlpha,
        options: {
          appName: 'Email test',
        },
      }),
      // new InjectedConnector({
      //   chains,
      //   options: {
      //     name: detectedName =>
      //       `Injected (${
      //         typeof detectedName === 'string' ? detectedName : detectedName.join(', ')
      //       })`,
      //     shimDisconnect: true,
      //   },
      // }),
    ],
    publicClient: createPublicClient({
      chain: moonbaseAlpha,
      transport: http(),
    }),
  });

  nuxtApp.vueApp.use(UseWagmiPlugin, config);
});
