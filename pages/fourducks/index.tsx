import Layout from "../../components/layout";
import {
  Heading,
  HStack, Link,
  Stack,
  Text, chakra,
} from "@chakra-ui/react";
import {useAccount, useBalance, useContractReads, useNetwork} from "wagmi";
import {useCallback, useEffect, useMemo, useState} from "react";
import FourDucksStake from "../../components/FourDucksStake";
import {FOUR_DUCKS_ADDRESS} from "../../constant/address";
import FOUR_DUCKS_API from "../../abis/FourDucks.json";
import {BigNumber, ethers} from "ethers";
import {useRouter} from "next/router";
import {isAddress} from "ethers/lib/utils";
import axios from "axios";
import FourDucksLog from "../../components/FourDucksLog";
import {useWindowSize} from "../../hooks/useWindowSize";
import {AddressZero} from "@ethersproject/constants";

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
  const [poolId, setPoolId] = useState(AddressZero)
  const {address} = useAccount()
  const {chain, chains} = useNetwork()
  const router = useRouter()
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
    watch: true,
    cacheTime: 3_000,
  })
  const [ducks, setDucks] = useState<{ t: number, r: number }[]>([])
  const [logs, setLogs] = useState<LogType[]>([])
  const {width} = useWindowSize()

  useEffect(() => {
    if (data?.[1]) {
      setSponsorWallet(data?.[1].toString())
    }
  }, [data])

  function randomQ() {
    // create a random big number
    const seed = ethers.BigNumber.from(Math.random().toString().slice(2))
    const q = ethers.utils.keccak256(seed.toHexString())
    setQ(q)
  }

  useEffect(() => {
    if (router.query.id && isAddress(router.query.id.toString())) {
      setPoolId(router.query.id.toString())
      if (router.query.q) {
        setQ(router.query.q.toString())
      } else {
        randomQ()
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
      <Stack spacing={'22px'} align={"center"} p={'22px'} pb={'44px'} w={'full'} bg={'#27F3F6'} borderBottom={'2px'}
             borderColor={'yellow.900'}>
        <Heading onClick={() => {
          router.push(`/fourducks/?id=${poolId}`)
        }} cursor={'pointer'}>
          FOUR DUCKS
        </Heading>
        <Link fontSize={'12px'} fontFamily={'Syncopate'} href={`${etherscanUrl}/address/${sponsorWallet}`}
              isExternal>SPONSOR: {Number(ethers.utils.formatUnits(sponsorWalletData?.value || 0, sponsorWalletData?.decimals || 18)).toLocaleString()} {sponsorWalletData?.symbol}</Link>
        <Stack bgImage={'/pool.png'} w={"full"} h={Math.min(width || 640, 640) - 44 } bgPosition={"center"}
               bgSize={'contain'} position={"relative"} bgRepeat={"no-repeat"} spacing={0}>
          {
            ducks.map((duck, index) => (
              <chakra.img
                key={index}
                cursor={"pointer"}
                onClick={randomQ}
                src={`/duck${index + 1}.png`}
                position={"absolute"}
                h={(Math.min(width || 640, 640) - 44) / 5}
                top={`calc(50% - ${Math.sin(duck.t * 2 * Math.PI)} * ${(Math.min(width || 640, 640) - 88) / 2 * duck.r}px)`}
                left={`calc(50% - ${Math.cos(duck.t * 2 * Math.PI)} * ${(Math.min(width || 640, 640) - 88) / 2 * duck.r}px)`}
                transform={'translate(-50%, -50%)'}
              />
            ))
          }
        </Stack>
        <Text fontSize={'16px'} fontFamily={'Syncopate'} fontWeight={'bold'} textOverflow={'ellipsis'}
              textAlign={"center"}>
          Can 4 ducks swim halfway<br/> down the pool?
        </Text>
        <HStack w={'full'} spacing={'22px'}>
          <FourDucksStake label={"Yes"} poolId={poolId} isOptimistic={true}/>
          <FourDucksStake label={"No"} poolId={poolId} isOptimistic={false}/>
        </HStack>
      </Stack>
      <Stack bg={'#FEFAC0'} w={'full'} h={'full'} p={'22px'}>
        <Text fontFamily={'Syncopate'} fontSize={'14px'} fontWeight={'bold'} color={'yellow.900'}>History of the
          pool</Text>
        {logs?.map((item) => (
          <FourDucksLog log={item} key={item.blockNumber}/>
        ))}
      </Stack>
    </Layout>
  );
}

export default _4Ducks;