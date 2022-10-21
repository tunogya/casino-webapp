import Layout from "../../../components/layout";
import {Button, Spacer, Stack, Text} from "@chakra-ui/react";
import {useAccount, useContractReads, useContractWrite, useNetwork, usePrepareContractWrite, erc20ABI} from "wagmi";
import {SNATCH_ADDRESS} from "../../../constant/address";
import SNATCH_ABI from "../../../abis/Snatch.json";
import {useRouter} from "next/router";
import {ethers} from "ethers";
import {useMemo} from "react";
import Prize from "../../../components/prize";

const Pool = () => {
  const {address} = useAccount()
  const {chain} = useNetwork()
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
    ]
  })
  const {config: drawConfig} = usePrepareContractWrite({
    addressOrName: SNATCH_ADDRESS[chain?.id || 5],
    contractInterface: SNATCH_ABI,
    functionName: 'draw',
    args: [id],
    overrides: {
      gasLimit: 1000000,
    }
  })
  const {config: batchDrawConfig} = usePrepareContractWrite({
    addressOrName: SNATCH_ADDRESS[chain?.id || 5],
    contractInterface: SNATCH_ABI,
    functionName: 'batchDraw',
    args: [id],
    overrides: {
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
      },
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
  const allowance = useMemo(() => {
    if (paymentTokenData?.[3] && paymentTokenData?.[2]) {
      return Number(ethers.utils.formatUnits(paymentTokenData?.[3], paymentTokenData?.[2]))
    }
    return undefined
  }, [paymentTokenData])
  const { config: approveConfig } = usePrepareContractWrite({
    addressOrName: poolConfig?.paymentToken,
    contractInterface: erc20ABI,
    functionName: 'approve',
    args: [SNATCH_ADDRESS[chain?.id || 5], ethers.constants.MaxUint256.toString()],
  })
  const { write: approveWrite, isLoading: isApproveLoading, } = useContractWrite(approveConfig);
  const poolIds = useMemo(() => {
    if (data?.[2]) {
      const nextPoolId = data?.[2].toNumber()
      const ids = []
      for (let i = 0; i < nextPoolId; i++) {
        ids.push(i)
      }
      return ids
    }
    return [0]
  }, [data])

  return (
    <Layout>
      <Stack direction={"row"} h={'full'} w={'full'}>
        <Stack minW={60} bg={"blackAlpha.600"} p={4} spacing={5} overflow={"scroll"}>
          { poolIds.map((item) => (
            <Button
              key={item}
              onClick={async () => {
                await router.push(`/pools/${item}`)
              }}
            >{item}</Button>
          )) }
        </Stack>
        <Stack w={'full'} h={'full'} py={40} alignItems={"center"}>
          <Stack textAlign={"center"} w={'100px'} bg={"gray"} py={1} mt={'300px'}>
            <Text color={'white'}>RP: {rp}</Text>
          </Stack>
          <Spacer/>
          <Stack direction={"row"} justify={"space-around"} w={'50%'}>
            { (allowance && singleDrawPrice) && (allowance < singleDrawPrice) ? (
              <Button
                bg={'gold'}
                loadingText={'Pending...'}
                disabled={!approveWrite}
                onClick={() => approveWrite?.()}
                isLoading={isApproveLoading}
              >
                Approve { paymentTokenData?.[1] }
              </Button>
            ) : (
              <Button
                bg={'gold'}
                disabled={!drawWrite}
                onClick={() => drawWrite?.()}
                isLoading={isDrawLoading}
                loadingText={'Pending...'}
              >
                {singleDrawPrice} {paymentTokenData?.[1]}, 1 X
              </Button>
            ) }
            { (allowance && batchDrawPrice) && (allowance < batchDrawPrice) ? (
              <Button
                bg={'gold'}
                loadingText={'Pending...'}
                onClick={() => approveWrite?.()}
                disabled={!approveWrite}
                isLoading={isApproveLoading}
              >
                Approve { paymentTokenData?.[1] }
              </Button>
            ) : (
              <Button
                bg={'gold'}
                disabled={!batchDrawWrite}
                onClick={() => batchDrawWrite?.()}
                isLoading={isBatchDrawLoading}
                loadingText={'Pending...'}
              >
                {batchDrawPrice} {paymentTokenData?.[1]}, {poolConfig?.batchDrawSize.toString()} X
              </Button>
            ) }
          </Stack>
        </Stack>
        <Stack minW={60} alignItems={"end"} h={'full'}>
          <Stack w={40} justify={"space-around"} h={'full'} pr={4}>
            <Button size={'lg'}>
              Store
            </Button>
            <Button size={'lg'}>
              Bonus
            </Button>
            <Stack spacing={4} bg={"gray"} p={4} minH={'60%'}>
              { poolConfig && (
                <Prize address={poolConfig.rarePrizeToken} value={poolConfig.rarePrizeValue} />
              ) }
              {normalPrizes && normalPrizes.map((prize: any, index: number) => (
                <Prize key={index} address={prize.address} value={prize.value} />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Layout>
  )
}

export default Pool