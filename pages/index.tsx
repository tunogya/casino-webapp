import type {NextPage} from 'next';
import {Stack, Wrap, WrapItem, Heading} from "@chakra-ui/react";
import Layout from "../components/layout";
import {useRouter} from "next/router";

const Home: NextPage = () => {
  const router = useRouter()

  const games = [
    {
      id: 1,
      name: 'Snatch Pool',
      path: '/pools/0',
    },
    {
      id: 2,
      name: '4 Ducks',
      path: '/4ducks',
    }
  ]

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
              cursor={'pointer'}
              alignItems={"center"}
              justify={"center"}
              onClick={async () => {
                await router.push(game.path)
              }}
            >
              <Heading fontSize={'2xl'} fontWeight={'bold'}>{game.name}</Heading>
            </Stack>
          </WrapItem>
        )) }
      </Wrap>
    </Layout>
  );
};

export default Home;
