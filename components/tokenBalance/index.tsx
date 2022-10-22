import {Badge} from "@chakra-ui/react";
import {ethers} from "ethers";
import {FC} from "react";
import {erc20ABI, useContractReads} from "wagmi";

type TokenBalanceProps = {
  token: string,
  address: string,
}

const TokenBalance:FC<TokenBalanceProps> = ({token, address}) => {
  const PaymentTokenContract = {
    addressOrName: token,
    contractInterface: erc20ABI,
  }
  const {data} = useContractReads({
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
    ]
  })

  if (data && address) {
    return (
      <Badge variant={"outline"}>{ ethers.utils.formatUnits(data?.[0], data?.[2]) } { data?.[1] }</Badge>
    )
  } else {
    return (
      <></>
    )
  }
}

export default TokenBalance