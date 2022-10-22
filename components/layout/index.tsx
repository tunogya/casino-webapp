import Head from "next/head";
import {Heading, HStack, Link, Spacer, Stack, Text} from "@chakra-ui/react";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useRouter} from "next/router";

// @ts-ignore
const Layout = ({children}) => {
  const router = useRouter()
  return (
    <Stack h={'100vh'} spacing={0} align={"center"} bg={'yellow.100'}>
      <Head>
        <title>Casino | WizardingPays</title>
        <meta
          name="description"
          content="WizardingPay Casino"
        />
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <Stack direction={"row"} px={4} py={2} align={"center"} bg={'gold'} w={'full'} borderBottom={"2px solid #400000"}>
        <Heading fontSize={'md'}>
          <Heading fontSize={'xx-small'} fontWeight={'normal'}>WizardingPay</Heading>
          <Heading
            fontSize={"md"}
            onClick={() => {
              router.push('/')
            }}
            cursor={"pointer"}
          >
            Casino
          </Heading>
        </Heading>
        <Spacer/>
        <ConnectButton/>
      </Stack>
      {children}
    </Stack>
  )
}

export default Layout