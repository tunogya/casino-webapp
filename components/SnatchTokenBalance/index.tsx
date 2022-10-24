import {Badge} from "@chakra-ui/react";
import {ethers} from "ethers";
import {FC} from "react";
import {erc20ABI, useContractReads} from "wagmi";

type TokenBalanceProps = {
  token: string,
  address: string,
}

const SnatchTokenBalance:FC<TokenBalanceProps> = ({token, address}) => {
  const TokenContract = {
    addressOrName: token,
    contractInterface: erc20ABI,
  }
  const {data} = useContractReads({
    contracts: [
      {
        ...TokenContract,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        ...TokenContract,
        functionName: 'symbol',
      },
      {
        ...TokenContract,
        functionName: 'decimals',
      },
    ]
  })

  if (data?.[0] && data?.[2] && data?.[1]) {
    return (
      <Badge variant={"outline"}>{ ethers.utils.formatUnits(data[0], data[2]) } { data[1] }</Badge>
    )
  } else {
    return (
      <></>
    )
  }
}

export default SnatchTokenBalance