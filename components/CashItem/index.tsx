import {Button} from "@chakra-ui/react";
import {FC} from "react";
import {Address, useAccount, useContractRead, useNetwork, useToken} from "wagmi";
import {CASH_ADDRESS} from "../../constant/address";
import CASH_ABI from "../../abis/CASH.json";
import {BigNumber, ethers} from "ethers";

type CashItemProps = {
  onClick: () => void;
  token:  Address;
}

const CashItem: FC<CashItemProps> = ({onClick, token }) => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { data: tokenData, isLoading: tokenIsLoading } = useToken({
    address: token,
    chainId: chain?.id,
    cacheTime: 30_000,
  })
  const {data: cashBalance, isLoading: cashIsLoading} = useContractRead({
    address: CASH_ADDRESS[chain?.id || 5],
    abi: CASH_ABI,
    functionName: "balanceOf",
    args: [token, address],
  })

  return (
    <Button onClick={onClick} variant={'outline'} w={'full'} isLoading={tokenIsLoading || cashIsLoading} loadingText={'...'}>
      {ethers.utils.formatUnits(BigNumber.from(cashBalance || 0), tokenData?.decimals)} {tokenData?.symbol}
    </Button>
  )
}

export default CashItem