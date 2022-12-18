import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import "@fontsource/readex-pro/400.css";
import "@fontsource/readex-pro/700.css";
import type {AppProps} from 'next/app';
import merge from 'lodash.merge';
import {
  RainbowKitProvider,
  connectorsForWallets,
  DisclaimerComponent,
  Theme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
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
import Script from "next/script";
import Head from "next/head";

const {chains, provider, webSocketProvider} = configureChains(
  [
    chain.goerli
  ],
  [
    infuraProvider({
      apiKey: process.env.INFURA_KEY!,
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

const myTheme = merge(lightTheme(), {
  colors: {
    accentColor: '#EB5370',
  },
  fonts: {
    body: 'Syncopate',
  },
} as Theme);

function MyApp({Component, pageProps}: AppProps) {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider coolMode theme={myTheme} chains={chains} appInfo={{
            appName: 'Playground',
            disclaimer: Disclaimer,
          }}>
            <Head>
              <title>Casino | WizardingPay</title>
              <meta
                name="description"
                content="WizardingPay Casino"
              />
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
              <link rel="icon" href="/favicon.svg"/>
            </Head>
            <Script id={"telegram-web-app"} async={true} src={"https://telegram.org/js/telegram-web-app.js"}></Script>
            <Script src={"https://www.googletagmanager.com/gtag/js?id=G-X9C08SL576"}></Script>
            <Script id="google-tag-manager" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                
                gtag('config', 'G-X9C08SL576');
              `}
            </Script>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default MyApp;
