import Layout from "../../components/layout";
import {Button, Spacer, Stack, Text} from "@chakra-ui/react";
import {useAccount, useContractReads, useContractWrite, useNetwork, usePrepareContractWrite} from "wagmi";
import {SNATCH_ADDRESS} from "../../constant/address";
import SNATCH_ABI from "../../abis/Snatch.json";
import {useRouter} from "next/router";

const Pool = () => {
  const {address} = useAccount()
  const {chain} = useNetwork()
  const router = useRouter()
  const { id } = router.query

  const SnatchContract = {
    addressOrName: SNATCH_ADDRESS[chain?.id || 5],
    contractInterface: SNATCH_ABI,
  }

  const {data, isError, isLoading} = useContractReads({
    contracts: [
      {
        ...SnatchContract,
        functionName: 'poolConfigOf',
        args: [0],
      },
      {
        ...SnatchContract,
        functionName: 'rpOf',
        args: [address, 0],
      }
    ]
  })

  const { config: drawConfig } = usePrepareContractWrite({
    addressOrName: SNATCH_ADDRESS[chain?.id || 5],
    contractInterface: SNATCH_ABI,
    functionName: 'draw',
    args: [id],
  })
  const { config: batchDrawConfig } = usePrepareContractWrite({
    addressOrName: SNATCH_ADDRESS[chain?.id || 5],
    contractInterface: SNATCH_ABI,
    functionName: 'batchDraw',
    args: [id],
  })
  const {data: drawData, isLoading: isDrawLoading, isSuccess: isDrawSuccess, write: drawWrite} = useContractWrite(drawConfig);
  const {data: batchDrawData, isLoading: isBatchDrawLoading, isSuccess: isBatchDrawSuccess, write: batchDrawWrite} = useContractWrite(batchDrawConfig);

  const poolConfig = data?.[0]
  const rp = data?.[1]

  const normalPrizes = poolConfig?.normalPrizesToken.map((prize: string, index: number) => {
    return {
      token: prize,
      value: poolConfig?.normalPrizesValue[index],
      rate: poolConfig?.normalPrizesRate[index],
    }
  })

  return (
    <Layout>
      <Stack direction={"row"} h={'full'} w={'full'}>
        <Stack minW={60} bg={"blackAlpha.600"} p={4} spacing={5} overflow={"scroll"}>
          <Button>ETH</Button>
        </Stack>
        <Stack w={'full'} h={'full'} py={40} alignItems={"center"}>
          <Stack textAlign={"center"} w={'100px'} bg={"gray"} py={1} mt={'300px'}>
            <Text color={'white'}>RP</Text>
          </Stack>
          <Spacer/>
          <Stack direction={"row"} justify={"space-around"} w={'50%'}>
            <Button
              bg={'gold'}
              disabled={!drawWrite}
              onClick={() => drawWrite?.()}
              isLoading={isDrawLoading}
              loadingText={'Pending...'}
            >
              { isDrawSuccess ? "Success" : `${(Number(poolConfig?.singleDrawPrice)/1e18).toFixed(0)}, 1 draw` }
            </Button>
            <Button
              bg={'gold'}
              disabled={!batchDrawWrite}
              onClick={() => batchDrawWrite?.()}
              isLoading={isBatchDrawLoading}
              loadingText={'Pending...'}
            >
              { isBatchDrawSuccess ? "Success" : `${(Number(poolConfig?.batchDrawPrice)/1e18).toFixed(0)}, ${poolConfig?.batchDrawSize} draws` }
            </Button>
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
              { normalPrizes && normalPrizes.map((prize: any, index: number) => (
                <Button size={'lg'} key={index}>
                  {prize.token}
                </Button>
              )) }
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Layout>
  )
}

export default Pool