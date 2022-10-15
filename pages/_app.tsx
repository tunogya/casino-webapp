import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type {AppProps} from 'next/app';
import {RainbowKitProvider, connectorsForWallets} from '@rainbow-me/rainbowkit';
import {chain, configureChains, createClient, WagmiConfig} from 'wagmi';
import {infuraProvider} from 'wagmi/providers/infura';
import {publicProvider} from 'wagmi/providers/public';
import {ChakraProvider, extendTheme} from "@chakra-ui/react";
import {
  argentWallet,
  braveWallet,
  coinbaseWallet, imTokenWallet,
  injectedWallet, ledgerWallet,
  metaMaskWallet, omniWallet,
  rainbowWallet, trustWallet,
  walletConnectWallet
} from "@rainbow-me/rainbowkit/wallets";

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })

const {chains, provider, webSocketProvider} = configureChains(
  [
    chain.mainnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
      ? [chain.goerli]
      : []),
  ],
  [
    infuraProvider({
      apiKey: process.env.INFURA_KEY,
    }),
    publicProvider(),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ chains }),
      walletConnectWallet({ chains }),
      coinbaseWallet({ chains, appName: 'Playground' }),
    ],
  },
  {
    groupName: 'Others',
    wallets: [
      rainbowWallet({ chains }),
      trustWallet({ chains }),
      ledgerWallet({ chains }),
      imTokenWallet({ chains }),
      omniWallet({ chains }),
      argentWallet({ chains }),
      braveWallet({ chains }),
    ],
  },
])

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({Component, pageProps}: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
