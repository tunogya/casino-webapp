import {Button} from "@chakra-ui/react";
import {FC} from "react";
import {Address, useAccount, useContractRead, useNetwork, useToken} from "wagmi";
import {CASH_ADDRESS} from "../../constant/address";
import {BigNumber, ethers} from "ethers";
import {CASH_ABI} from "../../constant/abi";

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
  })
  const {data: cashBalance, isLoading: cashIsLoading} = useContractRead({
    address: CASH_ADDRESS[chain?.id || 5],
    abi: CASH_ABI,
    functionName: "balanceOf",
    args: [token, address],
    cacheTime: 3_000,
  })

  return (
    <Button onClick={onClick} variant={'outline'} w={'full'} isLoading={tokenIsLoading || cashIsLoading} loadingText={'...'}>
      {ethers.utils.formatUnits(BigNumber.from(cashBalance || 0), tokenData?.decimals)} {tokenData?.symbol}
    </Button>
  )
}

export default CashItem