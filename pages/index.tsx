import type {NextPage} from 'next';
import {Stack, Wrap, WrapItem, Heading, useConst, Text} from "@chakra-ui/react";
import Layout from "../components/layout";
import {useRouter} from "next/router";
import {FOUR_DUCKS_ADDRESS, SNATCH_ADDRESS} from "../constant/address";
import {useNetwork} from "wagmi";

const Home: NextPage = () => {
  const router = useRouter()
  const { chain } = useNetwork()

  const games = useConst([
    {
      id: 1,
      name: 'Snatch Pool',
      path: '/pools',
      contract: SNATCH_ADDRESS[chain?.id || 5],
    },
    {
      id: 2,
      name: '4 Ducks',
      path: '/4ducks',
      contract: FOUR_DUCKS_ADDRESS[chain?.id || 5],
    }
  ])

  return (
    <Layout>
      <Wrap h={'full'} justify={"space-around"} p={'48px'} spacing={'48px'} w={'full'}>
        { games.map((game) => (
          <WrapItem key={game.id}>
            <Stack
              bg={'gold'}
              w={'400px'}
              h={'400px'}
              border={"2px solid"}
              borderColor={"yellow.900"}
              borderRadius={'24px'}
              alignItems={"center"}
              justify={"space-around"}
            >
              <Heading fontSize={'2xl'} fontWeight={'bold'}
                       cursor={'pointer'}
                       p={'24px'}
                       onClick={async () => {
                         await router.push(game.path)
                       }}
              >{game.name}</Heading>
              <Text fontSize={'xs'}>View Contract: <br/>{game.contract}</Text>
            </Stack>
          </WrapItem>
        )) }
      </Wrap>
    </Layout>
  );
};

export default Home;
