import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import "@fontsource/syncopate/400.css";
import "@fontsource/syncopate/700.css";
import "@fontsource/readex-pro/400.css";
import "@fontsource/readex-pro/700.css";
import type {AppProps} from 'next/app';
import {RainbowKitProvider, connectorsForWallets, DisclaimerComponent} from '@rainbow-me/rainbowkit';
import {chain, configureChains, createClient, WagmiConfig} from 'wagmi';
import {infuraProvider} from 'wagmi/providers/infura';
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
import {RecoilRoot} from "recoil";

const {chains, provider, webSocketProvider} = configureChains(
  [
    chain.goerli
  ],
  [
    infuraProvider({
      apiKey: process.env.INFURA_KEY,
      priority: 0
    }),
  ],
  {
    pollingInterval: 10_000,
    targetQuorum: 3,
    stallTimeout: 5_000,
  }
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({chains}),
      metaMaskWallet({chains}),
      walletConnectWallet({chains}),
      coinbaseWallet({chains, appName: 'Playground'}),
    ],
  },
  {
    groupName: 'Others',
    wallets: [
      rainbowWallet({chains}),
      trustWallet({chains}),
      ledgerWallet({chains}),
      imTokenWallet({chains}),
      omniWallet({chains}),
      argentWallet({chains}),
      braveWallet({chains}),
    ],
  },
])

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const Disclaimer: DisclaimerComponent = ({Text, Link}) => (
  <Text>
    By connecting your wallet, you agree to the{' '}
    <Link href="https://wizardingpay.com">Terms of Service</Link> and
    acknowledge you have read and understand the protocol{' '}
    <Link href="https://wizardingpay.com">WizardingPay</Link>
  </Text>
);

function MyApp({Component, pageProps}: AppProps) {
  return (
    <RecoilRoot>
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
    </RecoilRoot>
  );
}

export default MyApp;
