import {FC} from "react";
import {Text} from "@chakra-ui/react";
import {BigNumber, ethers} from "ethers";
import {erc20ABI, useContractReads} from "wagmi";

export type PrizeProps = {
  token: string,
  value: BigNumber,
}

const Prize: FC<PrizeProps> = ({token, value}) => {
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
    ]
  })

  return (
    <Text fontSize={'xs'}>{data?.[0]} x{ Number(ethers.utils.formatUnits(value, data?.[1])) }</Text>
  )
}

export default Prize;