import {FC} from "react";
import {Link, Stack, Text} from "@chakra-ui/react";
import {BigNumber, ethers} from "ethers";
import {erc20ABI, useContractReads, useNetwork} from "wagmi";
import {SNATCH_ADDRESS} from "../../constant/address";

export type PrizeProps = {
  token: string,
  value: BigNumber,
}

const SnatchPrizeInfo: FC<PrizeProps> = ({token, value}) => {
  const { chain } = useNetwork()
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
    ]
  })

  return (
    <Stack spacing={0}>
      <Link href={`${chain?.blockExplorers?.etherscan?.url}/token/${token}/?a=${SNATCH_ADDRESS[chain?.id || 5]}`} isExternal fontSize={'xs'}>{data?.[0]}</Link>
      { data?.[0] && data?.[1] && (
        <Text fontSize={'xs'} align={"end"}>
          { Number(ethers.utils.formatUnits(value, data?.[1])) } / {Number(ethers.utils.formatUnits(data?.[2], data?.[1]))}
        </Text>
      ) }
    </Stack>

  )
}

export default SnatchPrizeInfo;