import {FC, useMemo} from "react";
import {HStack, Link, Stack, Text, Tooltip} from "@chakra-ui/react";
import {BigNumber, ethers} from "ethers";
import {erc20ABI, useContractReads, useNetwork} from "wagmi";
import {SNATCH_ADDRESS} from "../../constant/address";

export type PrizeProps = {
  token: string,
  value: BigNumber,
}

const SnatchPrizeInfo: FC<PrizeProps> = ({token, value}) => {
  const { chain, chains } = useNetwork()
  const PrizeTokenContract = {
    addressOrName: token,
    contractInterface: erc20ABI,
  }
  const {data} = useContractReads({
    contracts: [
      {
        ...PrizeTokenContract,
        functionName: 'name',
      },
      {
        ...PrizeTokenContract,
        functionName: 'decimals',
      },
      {
        ...PrizeTokenContract,
        functionName: 'balanceOf',
        args: [SNATCH_ADDRESS[chain?.id || 5]],
      }
    ],
    watch: true,
    cacheTime: 3_000,
  })

  const etherscanUrl = useMemo(() => {
    if (chain) {
      return chain?.blockExplorers?.etherscan?.url
    }
    if (chains) {
      return chains?.[0]?.blockExplorers?.etherscan?.url
    }
  }, [chain, chains])

  return (
    <Stack spacing={0}>
      <Link href={`${etherscanUrl}/token/${token}/?a=${SNATCH_ADDRESS[chain?.id || 5]}`} isExternal fontSize={'xs'}>{data?.[0]}</Link>
      { data?.[0] && data?.[1] && (
        <HStack fontSize={'xs'} justify={"end"} spacing={0}>
          <Tooltip label={`prize value`}>
            <Text cursor={"pointer"}>{ Number(ethers.utils.formatUnits(value, data?.[1])).toLocaleString() }</Text>
          </Tooltip>
          <Text>/</Text>
          <Tooltip label={'pool balance'}>
            <Text cursor={"pointer"}>{ Number(ethers.utils.formatUnits(data?.[2], data?.[1])).toLocaleString() }</Text>
          </Tooltip>
        </HStack>
      ) }
    </Stack>

  )
}

export default SnatchPrizeInfo;