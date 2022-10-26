import Layout from "../../components/layout";
import {Badge, Button, HStack, Link, Spacer, Stack} from "@chakra-ui/react";
import {
  useAccount,
  useContractReads,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  erc20ABI,
  useBalance
} from "wagmi";
import {NATIVE_CURRENCY_ADDRESS, SNATCH_ADDRESS} from "../../constant/address";
import SNATCH_ABI from "../../abis/Snatch.json";
import {useRouter} from "next/router";
import {BigNumber, ethers} from "ethers";
import {useEffect, useMemo, useState} from "react";
import SnatchPrizeInfo from "../../components/SnatchPrizeInfo";
import SnatchSetting from "../../components/SnatchSetting";
import {AddIcon} from "@chakra-ui/icons";
import SnatchTokenBalance from "../../components/SnatchTokenBalance";
import {useRecoilState} from "recoil";
import {poolIdsAtom} from "../../state/snatchpools";

const Pool = () => {
  const {address} = useAccount()
  const {chain, chains} = useNetwork()
  const router = useRouter()
  const {id} = router.query

  const SnatchContract = {
    addressOrName: SNATCH_ADDRESS[chain?.id || 5],
    contractInterface: SNATCH_ABI,
  }

  const {data} = useContractReads({
    contracts: [
      {
        ...SnatchContract,
        functionName: 'poolConfigOf',
        args: [id],
      },
      {
        ...SnatchContract,
        functionName: 'rpOf',
        args: [address, id],
      },
      {
        ...SnatchContract,
        functionName: 'nextPoolId',
      },
      {
        ...SnatchContract,
        functionName: 'owner',
      },
      {
        ...SnatchContract,
        functionName: 'sponsorWallet',
      }
    ]
  })
  const {config: drawConfig} = usePrepareContractWrite({
    addressOrName: SNATCH_ADDRESS[chain?.id || 5],
    contractInterface: SNATCH_ABI,
    functionName: 'draw',
    args: [id],
    overrides: {
      value: data?.[0]?.paymentToken === NATIVE_CURRENCY_ADDRESS ? data?.[0]?.singleDrawPrice : '0',
      gasLimit: 1000000,
    }
  })
  const {config: batchDrawConfig} = usePrepareContractWrite({
    addressOrName: SNATCH_ADDRESS[chain?.id || 5],
    contractInterface: SNATCH_ABI,
    functionName: 'batchDraw',
    args: [id],
    overrides: {
      value: data?.[0]?.paymentToken === NATIVE_CURRENCY_ADDRESS ? data?.[0]?.batchDrawPrice : '0',
      gasLimit: 1000000,
    }
  })
  const {
    isLoading: isDrawLoading,
    write: drawWrite,
  } = useContractWrite(drawConfig);
  const {
    isLoading: isBatchDrawLoading,
    write: batchDrawWrite
  } = useContractWrite(batchDrawConfig);
  const poolConfig = useMemo(() => {
    return data?.[0]
  }, [data])
  const rp = data?.[1]?.toString() || undefined
  const normalPrizes = useMemo(() => {
    return poolConfig?.normalPrizesToken.map((prize: string, index: number) => {
      return {
        token: prize,
        value: poolConfig?.normalPrizesValue[index],
        rate: poolConfig?.normalPrizesRate[index],
      }
    })
  }, [poolConfig?.normalPrizesRate, poolConfig?.normalPrizesToken, poolConfig?.normalPrizesValue])
  const PaymentTokenContract = {
    addressOrName: poolConfig?.paymentToken,
    contractInterface: erc20ABI,
  }
  const {data: paymentTokenData} = useContractReads({
    contracts: [
      {
        ...PaymentTokenContract,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        ...PaymentTokenContract,
        functionName: 'symbol',
      },
      {
        ...PaymentTokenContract,
        functionName: 'decimals',
      },
      {
        ...PaymentTokenContract,
        functionName: 'allowance',
        args: [address, SNATCH_ADDRESS[chain?.id || 5]],
      }
    ]
  })
  const singleDrawPrice = useMemo(() => {
    if (poolConfig?.singleDrawPrice && paymentTokenData) {
      return Number(ethers.utils.formatUnits(poolConfig?.singleDrawPrice, paymentTokenData?.[2]))
    }
    return undefined
  }, [paymentTokenData, poolConfig?.singleDrawPrice])
  const batchDrawPrice = useMemo(() => {
    if (poolConfig?.batchDrawPrice && paymentTokenData) {
      return Number(ethers.utils.formatUnits(poolConfig?.batchDrawPrice, paymentTokenData?.[2]))
    }
    return undefined
  }, [paymentTokenData, poolConfig?.batchDrawPrice])
  const {config: approveConfig} = usePrepareContractWrite({
    addressOrName: poolConfig?.paymentToken,
    contractInterface: erc20ABI,
    functionName: 'approve',
    args: [SNATCH_ADDRESS[chain?.id || 5], ethers.constants.MaxUint256.toString()],
  })
  const {write: approveWrite, isLoading: isApproveLoading,} = useContractWrite(approveConfig);
  const [poolIds, setPoolIds] = useRecoilState(poolIdsAtom);
  const [sponsorWallet, setSponsorWallet] = useState<string | undefined>(undefined)
  const {data: sponsorWalletData} = useBalance({
    addressOrName: sponsorWallet,
  })

  const etherscanUrl = useMemo(() => {
    if (chain) {
      return chain?.blockExplorers?.etherscan?.url
    }
    if (chains) {
      return chains?.[0]?.blockExplorers?.etherscan?.url
    }
  }, [chain, chains])

  useEffect(() => {
    if (data?.[2]) {
      const nextPoolId = data?.[2].toNumber()
      const ids = []
      for (let i = 0; i < nextPoolId; i++) {
        ids.push(i)
      }
      setPoolIds(ids)
    }
  }, [data, setPoolIds])

  useEffect(() => {
    if (data?.[4]) {
      setSponsorWallet(data?.[4].toString())
    }
  }, [data])

  return (
    <Layout>
      <Stack direction={"row"} h={'full'} w={'full'}>
        <Stack minW={60} p={4} spacing={3} overflow={"scroll"}>
          {poolIds.map((item) => (
            <Button
              key={item}
              variant={Number(id) === item ? "solid" : "outline"}
              onClick={async () => {
                await router.push(`/pools/${item}`)
              }}
            >#{item} Pool</Button>
          ))}
          <Spacer/>
          {data?.[3] === address && (
            <HStack>
              <Button
                variant={"outline"}
                leftIcon={<AddIcon/>}
                onClick={async () => {
                  await router.push('/pools/create')
                }}
              >
                Pool
              </Button>
              <SnatchSetting/>
            </HStack>
          )}
        </Stack>
        <Stack w={'full'} h={'full'} alignItems={"center"} p={'20px'}>
          <HStack w={'full'} spacing={'20px'}>
            {sponsorWalletData && (
              <Link href={`${etherscanUrl}/address/${sponsorWallet}`} isExternal fontSize={'sm'}>sponsor
                balance: {Number(ethers.utils.formatUnits(sponsorWalletData.value, sponsorWalletData.decimals)).toLocaleString()} {sponsorWalletData.symbol}</Link>
            )}
            <Spacer/>
            {address && poolConfig && (
              <SnatchTokenBalance token={poolConfig.paymentToken} address={address}/>
            )}
            {address && poolConfig && (
              <SnatchTokenBalance token={poolConfig.rarePrizeToken} address={address}/>
            )}
          </HStack>
          <Spacer/>
          <Stack textAlign={"center"} w={'100px'}>
            <Badge borderRadius={'12px'} fontSize={'sm'}>RP: {rp}</Badge>
          </Stack>
          <Spacer/>
          <Stack direction={"row"} justify={"space-around"} w={'50%'}>
            {BigNumber.from(paymentTokenData?.[3] || 0).lt(BigNumber.from(poolConfig?.singleDrawPrice || 0)) ? (
              <Button
                size={'lg'}
                disabled={!approveWrite}
                onClick={() => approveWrite?.()}
                isLoading={isApproveLoading}
              >
                Approve {paymentTokenData?.[1]}
              </Button>
            ) : (
              <Button
                size={'lg'}
                disabled={!drawWrite}
                onClick={() => drawWrite?.()}
                isLoading={isDrawLoading}
              >
                {singleDrawPrice} {paymentTokenData?.[1]} 1X
              </Button>
            )}
            {BigNumber.from(paymentTokenData?.[3] || 0).lt(BigNumber.from(poolConfig?.batchDrawPrice || 0)) ? (
              <Button
                size={'lg'}
                onClick={() => approveWrite?.()}
                disabled={!approveWrite}
                isLoading={isApproveLoading}
              >
                Approve {paymentTokenData?.[1]}
              </Button>
            ) : (
              <Button
                size={'lg'}
                disabled={!batchDrawWrite}
                onClick={() => batchDrawWrite?.()}
                isLoading={isBatchDrawLoading}
              >
                {batchDrawPrice} {paymentTokenData?.[1]} {poolConfig?.batchDrawSize.toString()}X
              </Button>
            )}
          </Stack>
          <Spacer/>
        </Stack>
        <Stack minW={60} alignItems={"end"} h={'full'}>
          <Stack w={40} justify={"space-around"} h={'full'} pr={4}>
            <Button
              variant={"outline"}
              size={'lg'}
            >
              Store
            </Button>
            <Button
              variant={"outline"}
              size={'lg'}
            >
              Bonus
            </Button>
            <Stack spacing={4} bg={"teal.200"} border={"2px solid"} borderColor={'yellow.900'} p={4} minH={'60%'}
                   borderRadius={'12px'}>
              {poolConfig && (
                <SnatchPrizeInfo token={poolConfig.rarePrizeToken} value={poolConfig.rarePrizeValue}/>
              )}
              {normalPrizes && normalPrizes.map((prize: any, index: number) => (
                <SnatchPrizeInfo key={index} token={prize.token} value={prize.value}/>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Layout>
  )
}

export default Pool