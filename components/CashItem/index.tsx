import {Button} from "@chakra-ui/react";
import {FC} from "react";
import {useAccount, useNetwork, useToken} from "wagmi";

type CashItemProps = {
  onClick: () => void;
  token: string;
}

const CashItem: FC<CashItemProps> = ({onClick, token }) => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { data, isLoading } = useToken({
    // @ts-ignore
    address: token,
    chainId: chain?.id,
    cacheTime: 30_000,
  })

  return (
    <Button onClick={onClick} variant={'outline'} w={'full'} isLoading={isLoading} loadingText={'...'}>
      {data?.symbol}
    </Button>
  )
}

export default CashItem