import type {NextPage} from 'next';
import {Heading, Button, HStack, Spacer, IconButton, chakra, VStack, Text} from "@chakra-ui/react";
import Layout from "../components/layout";
import {useRouter} from "next/router";

const Home: NextPage = () => {
  const router = useRouter()

  return (
    <Layout>
      <HStack w={'full'} pt={'10px'} px={'10px'}>
        <Heading fontSize={'20px'}>My Cash</Heading>
        <Spacer/>
        <IconButton aria-label={'notice'} icon={<chakra.img src={'/svg/bell.svg'} h={'20px'} w={'20px'}/>} variant={'ghost'}/>
        <IconButton aria-label={'history'} icon={<chakra.img src={'/svg/clock.arrow.circlepath.svg'} h={'20px'} w={'20px'}/>} variant={'ghost'}/>
        <IconButton aria-label={'setting'} icon={<chakra.img src={'/svg/gearshape.svg'} h={'20px'}/>} w={'20px'} variant={'ghost'} />
      </HStack>
      <VStack w={'full'} px={'10px'} spacing={'20px'}>
        <Button variant={'outline'} w={'full'} fontSize={'2xl'} size={'lg'} minH={'60px'}>
          200 WUSD
        </Button>
        <Button variant={'outline'} w={'full'} fontSize={'2xl'} size={'lg'} minH={'60px'}>
          200 WUSD
        </Button>
        <Button variant={'outline'} w={'full'} fontSize={'2xl'} size={'lg'} minH={'60px'}>
          200 WUSD
        </Button>
      </VStack>
      <VStack>
        <Text></Text>
      </VStack>
    </Layout>
  );
};

export default Home;
