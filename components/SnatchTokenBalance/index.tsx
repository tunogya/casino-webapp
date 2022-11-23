import {Badge, Link} from "@chakra-ui/react";
import {ethers} from "ethers";
import {FC, useMemo} from "react";
import {erc20ABI, useContractReads, useNetwork} from "wagmi";

type TokenBalanceProps = {
  token: string,
  address: string,
}

const SnatchTokenBalance:FC<TokenBalanceProps> = ({token, address}) => {
  const { chain, chains } = useNetwork()
  const TokenContract = {
    address: token,
    abi: erc20ABI,
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

  if (data?.[0] && data?.[2] && data?.[1]) {
    return (
      <Badge variant={"outline"}>
        <Link href={`${etherscanUrl}/token/${token}/?a=${address}`} isExternal>
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