import {Badge, Link} from "@chakra-ui/react";
import {ethers} from "ethers";
import {FC} from "react";
import {chain, erc20ABI, useContractReads, useNetwork} from "wagmi";

type TokenBalanceProps = {
  token: string,
  address: string,
}

const SnatchTokenBalance:FC<TokenBalanceProps> = ({token, address}) => {
  const { chain } = useNetwork()
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
      <Badge variant={"outline"}>
        <Link href={`${chain?.blockExplorers?.etherscan?.url}/token/${token}/?a=${address}`} isExternal>
          { Number(ethers.utils.formatUnits(data[0], data[2])).toLocaleString() } { data[1] }
        </Link>
      </Badge>
    )
  } else {
    return (
      <></>
    )
  }
}

export default SnatchTokenBalance