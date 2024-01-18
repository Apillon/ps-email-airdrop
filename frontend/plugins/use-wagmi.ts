import { UseWagmiPlugin, createConfig } from 'use-wagmi';
import { moonbaseAlpha } from 'use-wagmi/chains';
import { MetaMaskConnector } from 'use-wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'use-wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'use-wagmi/connectors/walletConnect';
import { createPublicClient, http } from 'viem';

export default defineNuxtPlugin(nuxtApp => {
  const chains = [moonbaseAlpha];
  const config = createConfig({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({
        chains,
        options: {
          UNSTABLE_shimOnConnectSelectAccount: true,
        },
      }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: 'Email test',
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          projectId: 'fefd3005e5f3b8fd2e73de5333eeccf9',
          qrcode: true,
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
