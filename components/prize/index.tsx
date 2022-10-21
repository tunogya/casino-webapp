import {Stack} from "@chakra-ui/react";
import {FC} from "react";
import {Text} from "@chakra-ui/react";
import {BigNumber, ethers} from "ethers";
import {erc20ABI, useContractReads} from "wagmi";

type PrizeProps = {
  address: string,
  value: BigNumber,
}

const Prize: FC<PrizeProps> = ({address, value}) => {
  const PrizeTokenContract = {
    addressOrName: address,
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
        functionName: 'symbol',
      },
      {
        ...PrizeTokenContract,
        functionName: 'decimals',
      },
    ]
  })

  return (
    <Stack>
      <Text fontSize={'md'}>{data?.[0]} x{ Number(ethers.utils.formatUnits(value, data?.[2])) }</Text>
    </Stack>
  )
}

export default Prize;