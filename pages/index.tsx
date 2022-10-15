import {ConnectButton} from '@rainbow-me/rainbowkit';
import type {NextPage} from 'next';
import Head from 'next/head';
import {Button, Heading, Spacer, Stack, Text} from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
    <Stack h={'100vh'} spacing={0}>
      <Head>
        <title>Playground</title>
        <meta
          name="description"
          content="WizardingPay Playground"
        />
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <Stack direction={"row"} px={4} py={2} align={"center"} bg={'gold'}>
        <Heading fontSize={'md'}>WizardingPay Playground</Heading>
        <Spacer/>
        <ConnectButton/>
      </Stack>
      <Stack direction={"row"} h={'full'}>
        <Stack minW={60} bg={"blackAlpha.600"} p={4} spacing={5} overflow={"scroll"}>
          <Button>ETH</Button>
          <Button>NEST</Button>
          <Button>USDT</Button>
        </Stack>
        <Stack w={'full'} h={'full'} py={40} alignItems={"center"}>
          <Stack textAlign={"center"} w={'100px'} bg={"gray"} py={1} mt={'300px'}>
            <Text color={'white'}>RP: 20</Text>
          </Stack>
          <Spacer/>
          <Stack direction={"row"} justify={"center"} spacing={20}>
            <Button bg={'gold'}>50, 1 draw</Button>
            <Button bg={'gold'}>200, 5 draws</Button>
          </Stack>
        </Stack>
        <Stack minW={60} alignItems={"end"} h={'full'}>
          <Stack w={40} justify={"space-around"} h={'full'} pr={4}>
            <Button size={'lg'}>
              Store
            </Button>
            <Button size={'lg'}>
              Bonus
            </Button>
            <Button size={'lg'}>
              Prize Pool
            </Button>
            <Stack spacing={4} bg={"gray"} p={4}>
              <Button size={'lg'}>
                Prize 1
              </Button>
              <Button size={'lg'}>
                Prize 2
              </Button>
              <Button size={'lg'}>
                Prize 3
              </Button>
              <Button size={'lg'}>
                Prize 4
              </Button>
              <Button size={'lg'}>
                Prize 5
              </Button>
            </Stack>

          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Home;
