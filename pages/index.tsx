import type {NextPage} from 'next';
import {Stack, Wrap, WrapItem, Heading, useConst, Text, Link} from "@chakra-ui/react";
import Layout from "../components/layout";
import {useRouter} from "next/router";
import {FOUR_DUCKS_ADDRESS, PRINTING_POD_ADDRESS, SNATCH_ADDRESS} from "../constant/address";
import {useAccount, useNetwork} from "wagmi";
import {AddressZero} from "@ethersproject/constants";

const Home: NextPage = () => {
  const router = useRouter()
  const { chain } = useNetwork()
  const { address } = useAccount()

  const games = useConst([
    {
      id: 1,
      name: 'Snatch Pool',
      path: '/snatchpools/',
      contract: SNATCH_ADDRESS[chain?.id || 5],
    },
    {
      id: 2,
      name: '4 Ducks',
      path: `/fourducks/?id=${address || AddressZero}`,
      contract: FOUR_DUCKS_ADDRESS[chain?.id || 5],
    },
    {
      id: 3,
      name: 'Printing Pod',
      path: '/printingpod/',
      contract: PRINTING_POD_ADDRESS[chain?.id || 5],
    }
  ])

  return (
    <Layout>
      <Wrap h={'full'} justify={"space-around"} p={['24px', '48px']} spacing={['24px', '48px']} w={'full'}>
        { games.map((game) => (
          <WrapItem key={game.id} w={['full', '400px']}>
            <Stack
              bg={'gold'}
              h={['300px', '400px']}
              w={['full', '400px']}
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
              <Text fontSize={'xs'}>View Contract:<br/>
                <Link href={chain?.blockExplorers?.etherscan?.url + '/address/' + game.contract } isExternal>{game.contract}</Link>
              </Text>
            </Stack>
          </WrapItem>
        )) }
      </Wrap>
    </Layout>
  );
};

export default Home;
