import Head from "next/head";
import {Heading, Spacer, Stack} from "@chakra-ui/react";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import Link from "next/link";

// @ts-ignore
const Layout = ({ children }) => {
  return (
    <Stack h={'100vh'} spacing={0} align={"center"}>
      <Head>
        <title>Playground</title>
        <meta
          name="description"
          content="WizardingPay Playground"
        />
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <Stack direction={"row"} px={4} py={2} align={"center"} bg={'gold'} w={'full'}>
        <Heading fontSize={'md'}>
          <Link href={'/'}>
            WizardingPay Playground
          </Link>
        </Heading>
        <Spacer/>
        <ConnectButton/>
      </Stack>
      {children}
    </Stack>
  )
}

export default Layout