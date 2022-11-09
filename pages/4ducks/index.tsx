import Layout from "../../components/layout";
import {
  Heading,
  HStack, Link,
  Spacer,
  Stack,
  Text, chakra, Badge
} from "@chakra-ui/react";
import {useAccount, useBalance, useContractReads, useEnsName, useNetwork} from "wagmi";
import {useCallback, useEffect, useMemo, useState} from "react";
import FourDucksStake from "../../components/FourDucksStake";
import FourDucksSetting from "../../components/FourDucksSetting";
import {FOUR_DUCKS_ADDRESS} from "../../constant/address";
import FOUR_DUCKS_API from "../../abis/FourDucks.json";
import {BigNumber, ethers} from "ethers";
import {useRouter} from "next/router";
import {isAddress} from "ethers/lib/utils";
import axios from "axios";
import FourDucksLog from "../../components/FourDucksLog";

export type LogType = {
  address: string,
  blockHash: string,
  blockNumber: number,
  data: string,
  gasPrice: BigNumber,
  logIndex: number,
  timeStamp: number,
  topics: string[],
  transactionHash: string,
  transactionIndex: number,
}

const _4Ducks = () => {
  const [poolId, setPoolId] = useState("")
  const {address} = useAccount()
  const {chain, chains} = useNetwork()
  const router = useRouter()
  const {data: poolEnsName} = useEnsName({
    address: poolId
  })
  const FourDucksContract = {
    addressOrName: FOUR_DUCKS_ADDRESS[chain?.id || 5],
    contractInterface: FOUR_DUCKS_API,
  }
  const [q, setQ] = useState<string | undefined>(undefined)
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
  const {data: qData} = useContractReads({
    contracts: [
      {
        ...FourDucksContract,
        functionName: 'coordinatesOf',
        args: [q],
      }
    ]
  })
  const [sponsorWallet, setSponsorWallet] = useState<string | undefined>(undefined)
  const {data: sponsorWalletData} = useBalance({
    addressOrName: sponsorWallet,
  })
  const [ducks, setDucks] = useState<{ t: number, r: number }[]>([])
  const [logs, setLogs] = useState<LogType[]>([])

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
        router.push({
          query: {
            ...router.query,
            id: address,
          }
        })
      }
    }
  }, [address, router])

  useEffect(() => {
    if (router.query.q) {
      setQ(router.query.q.toString())
    } else {
      setDucks([])
    }
  }, [router])

  const fetchDucks = useCallback(() => {
    setDucks([])
    if (qData?.[0]) {
      for (let i = 0; i < qData?.[0].length; i += 2) {
        setDucks((ducks) => [...ducks, {
          t: BigNumber.from(qData[0][i]).toNumber() / BigNumber.from('0x100000000').toNumber(),
          r: BigNumber.from(qData[0][i + 1]).toNumber() / BigNumber.from('0x100000000').toNumber(),
        }])
      }
    }
  }, [qData])

  useEffect(() => {
    fetchDucks()
  }, [fetchDucks])

  const etherscanUrl = useMemo(() => {
    if (chain) {
      return chain?.blockExplorers?.etherscan?.url
    }
    if (chains) {
      return chains?.[0]?.blockExplorers?.etherscan?.url
    }
  }, [chain, chains])

  const fetchLogs = useCallback(async () => {
    if (!poolId) {
      return
    }
    const topic0 = "0x754200201f11dd285de648ff60f1b2e399df9ae7964b9b0043c0cb50aca874db"
    const topic1 = "0x000000000000000000000000" + poolId.replace("0x", "")
    const apiKey = process.env.ETHERSCAN_API_KEY
    const res = await axios({
      url: `https://api-goerli.etherscan.io/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&topic0=${topic0}&topic0_1_opr=and&topic1=${topic1}&page=1&offset=1000&apikey=${apiKey}`,
      method: 'GET',
    })
    if (res.data?.result?.length > 0) {
      try {
        setLogs(res.data.result?.reverse())
      } catch (e) {
        console.log(e)
      }
    }
  }, [poolId])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return (
    <Layout>
      <Stack w={'full'} p={['12px', '24px']} h={'full'}>
        <Stack spacing={['8px', '24px']} direction={['column', 'row']} justify={"space-between"}>
          <Stack direction={"row"} justify={"space-around"} alignItems={"center"}>
            <Heading fontWeight={'bold'} cursor={'pointer'} onClick={() => {
              router.push('/4ducks/')
            }}>4 Ducks</Heading>
            {
              data?.[0] === address && (
                <FourDucksSetting/>
              )
            }
          </Stack>
          <Stack direction={'row'} justify={"space-around"} alignItems={"center"}>
            {sponsorWalletData && (
              <Badge variant={'outline'}>
                <Link href={`${etherscanUrl}/address/${sponsorWallet}`} isExternal
                      fontSize={'sm'}>sponsor: {Number(ethers.utils.formatUnits(sponsorWalletData.value, sponsorWalletData.decimals)).toLocaleString()} {sponsorWalletData.symbol}</Link>
              </Badge>
            )}
            <Spacer/>
            {chain && poolId && (
              <Badge>
                <Link href={`${chain?.blockExplorers?.etherscan?.url}/address/${FOUR_DUCKS_ADDRESS[chain?.id || 5]}`}
                      isExternal fontSize={'sm'}>pool: {poolEnsName ? poolEnsName : poolId.slice(0, 4) + '...' + poolId.slice(-4)}</Link>
              </Badge>
            )}
          </Stack>
        </Stack>
        <Stack direction={['column', 'row']} w={'full'} h={'full'} alignItems={"start"}>
          <Stack w={'full'} alignItems={"center"} spacing={'48px'} h={'full'} justify={"center"}>
            <Stack bgImage={'/pool.svg'} w={['full', '480px']} h={['320px', '480px']} bgPosition={"center"}
                   bgSize={'contain'}
                   position={"relative"} bgRepeat={"no-repeat"} spacing={0}>
              {
                ducks.map((duck, index) => (
                  <chakra.img
                    key={index}
                    src={'/duck.svg'}
                    w={['22px', '44px']} h={['22px', '44px']}
                    position={"absolute"}
                    top={`calc(50% - ${Math.sin(duck.t * 2 * Math.PI)} * ${240 * duck.r}px)`}
                    left={`calc(50% - ${Math.cos(duck.t * 2 * Math.PI)} * ${240 * duck.r}px)`}
                    transform={'translate(-50%, -50%)'}
                  />
                ))
              }
            </Stack>
            <Text fontSize={'2xl'} fontWeight={'bold'} textAlign={"center"}>Can 4 ducks swim halfway down the pool?</Text>
            <HStack spacing={['24px', '48px']} maxW={'full'} justify={"center"}>
              <FourDucksStake label={"Yes"} poolId={poolId} isOptimistic={true}/>
              <FourDucksStake label={"No"} poolId={poolId} isOptimistic={false}/>
            </HStack>
          </Stack>
          <Stack py={'24px'} spacing={'24px'} minW={['full', '360px']} w={['full', '360px']}>
            <Stack minH={'120px'} bg={"gray.50"} p={'20px'} borderRadius={'20px'}>
              <Text fontSize={'sm'} fontWeight={'bold'}>Join other pools:</Text>
            </Stack>
            <Stack bg={"gray.50"} p={'20px'} borderRadius={'20px'}>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <Text fontSize={'sm'} fontWeight={'bold'}>History of this pool:</Text>
              <Stack maxH={'480px'} overflow={"scroll"}>
                {logs?.map((item) => (
                  <FourDucksLog log={item} key={item.blockNumber}/>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Layout>
  );
}

export default _4Ducks;