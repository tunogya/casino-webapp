import Layout from "../../components/layout";
import {
  Heading,
  HStack, Link,
  Spacer,
  Stack,
  Text
} from "@chakra-ui/react";
import ChakraBox from "../../components/ChakraBox";
import {useAccount, useBalance, useContractReads, useEnsName, useNetwork} from "wagmi";
import {useEffect, useState} from "react";
import _4DucksStake from "../../components/_4DucksStake";
import _4DucksSetting from "../../components/_4DucksSetting";
import {FOUR_DUCKS_ADDRESS} from "../../constant/address";
import FOUR_DUCKS_API from "../../abis/FourDucks.json";
import {ethers} from "ethers";
import {useRouter} from "next/router";
import {isAddress} from "ethers/lib/utils";

const _4Ducks = () => {
  const [poolId, setPoolId] = useState("")
  const {address} = useAccount()
  const {chain} = useNetwork()
  const router = useRouter()
  const {data: poolEnsName} = useEnsName({
    address: poolId
  })
  const FourDucksContract = {
    addressOrName: FOUR_DUCKS_ADDRESS[chain?.id || 5],
    contractInterface: FOUR_DUCKS_API,
  }
  const {data} = useContractReads({
    contracts: [
      {
        ...FourDucksContract,
        functionName: 'owner',
      },
      {
        ...FourDucksContract,
        functionName: 'sponsorWallet',
      },
      {
        ...FourDucksContract,
        functionName: 'poolConfigOf',
        args: [poolId],
      }
    ]
  })
  const [sponsorWallet, setSponsorWallet] = useState<string | undefined>(undefined)
  const {data: sponsorWalletData } = useBalance({
    addressOrName: sponsorWallet,
  })

  useEffect(() => {
    if (data?.[1]) {
      setSponsorWallet(data?.[1].toString())
    }
  }, [data])

  useEffect(() => {
    if (router.query.id && isAddress(router.query.id.toString())) {
      setPoolId(router.query.id.toString())
    } else {
      if (address) {
        setPoolId(address)
      }
    }
  }, [address, router])

  return (
    <Layout>
      <HStack w={'full'} h={'full'} alignItems={"start"}>
        <Stack p={'24px'} w={'full'} alignItems={"center"} spacing={'48px'}>
          <HStack w={'full'} spacing={'24px'}>
            <Heading fontWeight={'bold'}>4 Ducks</Heading>
            {sponsorWalletData && (
              <Link href={`${chain?.blockExplorers?.etherscan?.url}/address/${sponsorWallet}`} isExternal fontSize={'sm'}>sponsor
                balance: {Number(ethers.utils.formatUnits(sponsorWalletData.value, sponsorWalletData.decimals)).toFixed(6)} {sponsorWalletData.symbol}</Link>
            )}
            <Spacer/>
            <Text fontSize={'sm'}>The Pool: {poolEnsName ? poolEnsName : poolId}</Text>
            {
              data?.[0] === address && (
                <_4DucksSetting/>
              )
            }
          </HStack>
          <HStack justify={"space-around"} w={'full'}>
            <_4DucksStake label={"Yes"} poolId={poolId} isOptimistic={true}/>

            <ChakraBox
              border={"2px solid"}
              borderColor={"yellow.900"}
              w={'600px'} h={'600px'} bg={"gold"} borderRadius={'full'}
              animate={{
                scale: [1, 0.96, 1, 0.96, 1],
              }}
              // @ts-ignore
              transition={{
                duration: 5,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
            </ChakraBox>

            <_4DucksStake label={"No"} poolId={poolId} isOptimistic={false}/>
          </HStack>
        </Stack>
        <Stack minW={'300px'} h={'full'} bg={"gray.50"} p={'12px'}>
          <Text>Join other pools:</Text>
        </Stack>
      </HStack>
    </Layout>
  );
}

export default _4Ducks;