import {
  Button, FormControl, FormLabel, Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger, Stack
} from "@chakra-ui/react";
import {FC, useState} from "react";
import {useContractWrite, useNetwork, usePrepareContractWrite} from "wagmi";
import {FOUR_DUCKS_ADDRESS} from "../../constant/address";
import FOUR_DUCKS_API from "../../abis/FourDucks.json";

type PickStakeProps = {
  label: string,
  poolId: string
}

const PickStake: FC<PickStakeProps> = ({label, poolId}) => {
  const {chain} = useNetwork()
  const [token, setToken] = useState("")
  const [amount, setAmount] = useState("")
  const { config: stakeConfig } = usePrepareContractWrite({
    addressOrName: FOUR_DUCKS_ADDRESS[chain?.id || 5],
    contractInterface: FOUR_DUCKS_API,
    functionName: 'stake',
    args: [poolId, token, amount],
  })
  const {isLoading: isStakeLoading, write: stakeWrite} = useContractWrite(stakeConfig)

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          size={'lg'}
        >{label}</Button>
      </PopoverTrigger>
      <PopoverContent border={'2px solid'} borderColor={'yellow.900'} p={'12px'} borderRadius={'12px'}>
        <PopoverBody>
          <Stack spacing={'12px'}>
            <FormControl>
              <FormLabel
                fontSize={'xs'}
                color={'yellow.900'}
                fontWeight={'bold'}
                fontFamily={'Syncopate'}
              >Token</FormLabel>
              <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder={'Token Address'}/>
            </FormControl>
            <FormControl>
              <FormLabel
                fontSize={'xs'}
                color={'yellow.900'}
                fontWeight={'bold'}
                fontFamily={'Syncopate'}
              >Amount</FormLabel>
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={'Token Amount'}/>
            </FormControl>
            <Button
              disabled={!stakeWrite}
              onClick={() => stakeWrite?.()}
              isLoading={isStakeLoading}
              loadingText={'Pending'}
              size={'lg'}
            >
              Stake
            </Button>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default PickStake