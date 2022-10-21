import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type {AppProps} from 'next/app';
import {RainbowKitProvider, connectorsForWallets, DisclaimerComponent} from '@rainbow-me/rainbowkit';
import {chain, configureChains, createClient, WagmiConfig} from 'wagmi';
import {infuraProvider} from 'wagmi/providers/infura';
import {publicProvider} from 'wagmi/providers/public';
import {ChakraProvider} from "@chakra-ui/react";
import {
  argentWallet,
  braveWallet,
  coinbaseWallet, imTokenWallet,
  injectedWallet, ledgerWallet,
  metaMaskWallet, omniWallet,
  rainbowWallet, trustWallet,
  walletConnectWallet
} from "@rainbow-me/rainbowkit/wallets";
import theme from "../theme";

const {chains, provider, webSocketProvider} = configureChains(
  [
    chain.mainnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
      ? [chain.goerli, chain.hardhat]
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

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the{' '}
    <Link href="https://wizardingpay.com">Terms of Service</Link> and
    acknowledge you have read and understand the protocol{' '}
    <Link href="https://wizardingpay.com">WizardingPay</Link>
  </Text>
);

function MyApp({Component, pageProps}: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider coolMode chains={chains} appInfo={{
          appName: 'Playground',
          disclaimer: Disclaimer,
        }}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
