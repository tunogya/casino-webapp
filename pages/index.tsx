import type {NextPage} from 'next';
import {Stack} from "@chakra-ui/react";
import Layout from "../components/layout";
import Link from "next/link";
import PoolSetting from "../components/poolSetting";
import {useAccount, useContractReads, useNetwork} from "wagmi";
import {SNATCH_ADDRESS} from "../constant/address";
import SNATCH_ABI from "../abis/Snatch.json";

const Home: NextPage = () => {
  const {address} = useAccount()
  const {chain} = useNetwork()

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
        { data?.[0].toLocaleString() === address?.toLocaleString() && (
          <Link href={'/create'}>Create Pool</Link>
        ) }
        <Link href={'/pools/0'}>Pool</Link>
        { data?.[0].toLocaleString() === address?.toLocaleString() && (
          <PoolSetting/>
        )}
      </Stack>
    </Layout>
  );
};

export default Home;
