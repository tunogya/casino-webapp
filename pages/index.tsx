import type {NextPage} from 'next';
import {Stack, Heading, Text, Button} from "@chakra-ui/react";
import Layout from "../components/layout";
import {useRouter} from "next/router";
import {useAccount} from "wagmi";
import {AddressZero} from "@ethersproject/constants";
import {useWindowSize} from "../hooks/useWindowSize";

const Home: NextPage = () => {
  const router = useRouter()
  const { address } = useAccount()
  const { width } = useWindowSize()

  return (
    <Layout>
      <Stack spacing={'11px'} w={'full'} h={'full'} p={'22px'} pb={'44px'}>
        <Stack w={'full'} h={ Math.min(width || 640, 640) - 44 } border={'2px'} bgImage={'/4ducks.png'} bgSize={'contain'} bgRepeat={'no-repeat'} bgPosition={'center'}
               borderRadius={'11px'} borderColor={'yellow.900'}>
        </Stack>
        <Button fontSize={'14px'} minH={'75px'} bg={'#EB5370'} onClick={() => {
          router.push(`/fourducks/?id=${address || AddressZero}`)
        }}>
          QUACK! QUACK! QUACK! QUACK!
        </Button>
      </Stack>
      <Stack p={'44px 22px'} w={'full'} spacing={'22px'} h={'full'} bg={'#81D8C5'} align={"center"} borderTop={'2px'} borderColor={'yellow.900'}>
        <Heading fontSize={'36px'} textAlign={"center"}>Snatch Pool</Heading>
        <Stack align={"center"} spacing={0}>
          <Text fontSize={'12px'}>The more draws, the higher the lucky value!</Text>
          <Text fontSize={'12px'} fontWeight={'bold'}>RP = 200, Special bonus!</Text>
        </Stack>
        <Button fontSize={'14px'} bg={'white'} w={'full'} color={'yellow.900'} onClick={() => {
          router.push(`/snatchpools/`)
        }}>
          Draw
        </Button>
      </Stack>
    </Layout>
  );
};

export default Home;
