import Head from "next/head";
import {Heading, Spacer, Stack} from "@chakra-ui/react";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useRouter} from "next/router";

// @ts-ignore
const Layout = ({children}) => {
  const router = useRouter()
  return (
    <Stack align={"center"} w={'full'} h={'full'}>
      <Head>
        <title>Casino | WizardingPay</title>
        <meta
          name="description"
          content="WizardingPay Casino"
        />
        <link rel="icon" href="/favicon.svg"/>
      </Head>
      <Stack maxW={'container.sm'} w={'full'} spacing={'0'} align={"center"}>
        <Stack direction={"row"} px={4} py={2} align={"center"} bg={'#FAE35A'} w={'full'} position={'sticky'} top={0} zIndex={100}
               borderBottom={"2px solid #400000"}>
          <Stack
            spacing={0}
            onClick={() => {
              router.push('/')
            }}
            cursor={"pointer"}
          >
            <Heading fontSize={'xx-small'} fontWeight={'normal'}>WizardingPay</Heading>
            <Heading
              fontSize={"md"}
            >
              Casino
            </Heading>
          </Stack>
          <Spacer/>
          <ConnectButton/>
        </Stack>
        {children}
      </Stack>
    </Stack>
  )
}

export default Layout