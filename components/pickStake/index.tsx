import {
  Button, FormControl, FormLabel, Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger, Stack
} from "@chakra-ui/react";
import {FC, useMemo, useState} from "react";
import {erc20ABI, useAccount, useContractReads, useContractWrite, useNetwork, usePrepareContractWrite} from "wagmi";
import {FOUR_DUCKS_ADDRESS, NATIVE_CURRENCY_ADDRESS} from "../../constant/address";
import FOUR_DUCKS_API from "../../abis/FourDucks.json";
import {ethers} from "ethers";

type PickStakeProps = {
  label: string,
  poolId: string,
  isOptimistic: boolean,
}

const PickStake: FC<PickStakeProps> = ({label, poolId}) => {
  const {chain} = useNetwork()
  const {address } = useAccount()
  const [token, setToken] = useState("")
  const [amount, setAmount] = useState("")
  const TokenContract = {
    addressOrName: token,
    contractInterface: erc20ABI,
  }
  const {data} = useContractReads({
    contracts: [
      {
        ...TokenContract,
        functionName: 'decimals',
      },
      {
        ...TokenContract,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        ...TokenContract,
        functionName: 'allowance',
        args: [address, FOUR_DUCKS_ADDRESS[chain?.id || 5]],
      }
    ]
  })

  const parseAmount = useMemo(() => {
    if (data && amount) {
      return ethers.utils.parseUnits(amount, data[0])
    } else {
      return "0"
    }
  }, [amount, data])

  const { config: stakeConfig } = usePrepareContractWrite({
    addressOrName: FOUR_DUCKS_ADDRESS[chain?.id || 5],
    contractInterface: FOUR_DUCKS_API,
    functionName: 'stake',
    args: [poolId, token, parseAmount],
    overrides: {
      value: token === NATIVE_CURRENCY_ADDRESS ? parseAmount : "0",
      gasLimit: 1000000,
    }
  })
  const {isLoading: isStakeLoading, write: stakeWrite} = useContractWrite(stakeConfig)
  const { config: approveConfig } = usePrepareContractWrite({
    addressOrName: token,
    contractInterface: erc20ABI,
    functionName: 'approve',
    args: [FOUR_DUCKS_ADDRESS[chain?.id || 5], ethers.constants.MaxUint256],
  })
  const {isLoading: isApproveLoading, write: approveWrite} = useContractWrite(approveConfig)
  const allowance = useMemo(() => {
    if (data?.[0] && data?.[2]) {
      return Number(ethers.utils.formatUnits(data?.[2], data?.[0]))
    }
    return undefined
  }, [data])

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
            { (allowance !== undefined) && (allowance < Number(amount)) ? (
              <Button
                disabled={!approveWrite}
                onClick={() => approveWrite?.()}
                isLoading={isApproveLoading}
                loadingText={'Pending'}
                size={'lg'}
              >
                Approve
              </Button>
            ) : (
              <Button
                disabled={!stakeWrite}
                onClick={() => stakeWrite?.()}
                isLoading={isStakeLoading}
                loadingText={'Pending'}
                size={'lg'}
              >
                Stake
              </Button>
            ) }
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default PickStake