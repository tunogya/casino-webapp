import type {NextPage} from 'next';
import {Button, Stack} from "@chakra-ui/react";
import Layout from "../components/layout";
import PoolSetting from "../components/poolSetting";
import {useAccount, useContractReads, useNetwork} from "wagmi";
import {SNATCH_ADDRESS} from "../constant/address";
import SNATCH_ABI from "../abis/Snatch.json";
import {useRouter} from "next/router";

const Home: NextPage = () => {
  const {address} = useAccount()
  const {chain} = useNetwork()
  const router = useRouter()

  const SnatchContract = {
    addressOrName: SNATCH_ADDRESS[chain?.id || 5],
    contractInterface: SNATCH_ABI,
  }

  const {data} = useContractReads({
    contracts: [
      {
        ...SnatchContract,
        functionName: 'owner',
      }
    ]
  })

  return (
    <Layout>
      <Stack h={'full'} alignItems={"center"} justify={"center"}>
        {data?.[0].toLocaleString() === address?.toLocaleString() && (
          <Button
            onClick={async () => {
              await router.push('/create')
            }}
          >
            Create Pool
          </Button>
        )}
        <Button
          onClick={async () => {
            await router.push('/pools/0')
          }}
        >
          Pool
        </Button>
        {data?.[0].toLocaleString() === address?.toLocaleString() && (
          <PoolSetting/>
        )}
      </Stack>
    </Layout>
  );
};

export default Home;
