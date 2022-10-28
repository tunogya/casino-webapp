import {
  Button, FormControl, FormLabel, HStack, Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger, Stack, Text
} from "@chakra-ui/react";
import {FC, useEffect, useMemo, useState} from "react";
import {erc20ABI, useAccount, useContractReads, useContractWrite, useNetwork, usePrepareContractWrite} from "wagmi";
import {FOUR_DUCKS_ADDRESS, NATIVE_CURRENCY_ADDRESS} from "../../constant/address";
import FOUR_DUCKS_API from "../../abis/FourDucks.json";
import {BigNumber, ethers} from "ethers";

type PickStakeProps = {
  label: string,
  poolId: string,
  isOptimistic: boolean,
}

const FourDucksStake: FC<PickStakeProps> = ({label, poolId}) => {
  const {chain} = useNetwork()
  const {address} = useAccount()
  const [token, setToken] = useState("0xDfcBBb16FeEB9dD9cE3870f6049bD11d28390FbF")
  const [amount, setAmount] = useState("")
  const TokenContract = {
    addressOrName: token,
    contractInterface: erc20ABI,
  }
  const FourDucksContract = {
    addressOrName: FOUR_DUCKS_ADDRESS[chain?.id || 5],
    contractInterface: FOUR_DUCKS_API,
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
      },
    ]
  })
  const {data: fourDucksData} = useContractReads({
    contracts: [
      {
        ...FourDucksContract,
        functionName: 'platformFee',
      },
      {
        ...FourDucksContract,
        functionName: 'sponsorFee',
      }
    ]
  })
  const parseAmount = useMemo(() => {
    if (data && amount) {
      return ethers.utils.parseUnits(amount, data[0])
    } else {
      return BigNumber.from(0)
    }
  }, [amount, data])
  const {config: pooledStakeConfig} = usePrepareContractWrite({
    addressOrName: FOUR_DUCKS_ADDRESS[chain?.id || 5],
    contractInterface: FOUR_DUCKS_API,
    functionName: 'pooledStake',
    args: [poolId, token, parseAmount],
    overrides: {
      value: token === NATIVE_CURRENCY_ADDRESS ? parseAmount : BigNumber.from(0),
      gasLimit: 1000000,
    }
  })
  const [platformFee, setPlatformFee] = useState('0')
  const [sponsorFee, setSponsorFee] = useState("0")
  const {isLoading: isPooledStakeLoading, write: poolStakeWrite} = useContractWrite(pooledStakeConfig)
  const {config: soloStakeConfig} = usePrepareContractWrite({
    addressOrName: FOUR_DUCKS_ADDRESS[chain?.id || 5],
    contractInterface: FOUR_DUCKS_API,
    functionName: 'soloStake',
    args: [poolId, token, parseAmount],
    overrides: {
      value: token === NATIVE_CURRENCY_ADDRESS ? parseAmount : ethers.utils.parseEther(sponsorFee),
      gasLimit: 1000000,
    }
  })
  const {isLoading: isSoloStakeLoading, write: soloStakeWrite} = useContractWrite(soloStakeConfig)
  const {config: approveConfig} = usePrepareContractWrite({
    addressOrName: token,
    contractInterface: erc20ABI,
    functionName: 'approve',
    args: [FOUR_DUCKS_ADDRESS[chain?.id || 5], ethers.constants.MaxUint256],
  })
  const {isLoading: isApproveLoading, write: approveWrite} = useContractWrite(approveConfig)

  useEffect(() => {
    if (fourDucksData) {
      setPlatformFee((Number(ethers.utils.formatEther(fourDucksData?.[0] || '0')) * 100).toString())
      setSponsorFee(ethers.utils.formatEther(fourDucksData?.[1]))
    }
  }, [fourDucksData])

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
            {(BigNumber.from(data?.[2] || 0).lt(parseAmount)) ? (
              <Button
                disabled={!approveWrite}
                onClick={() => approveWrite?.()}
                isLoading={isApproveLoading}
                size={'lg'}
              >
                Approve
              </Button>
            ) : (
              <HStack>
                <Button
                  disabled={!soloStakeWrite}
                  onClick={() => soloStakeWrite?.()}
                  isLoading={isSoloStakeLoading}
                  size={'lg'}
                >
                  Solo
                </Button>
                <Button
                  disabled={!poolStakeWrite}
                  onClick={() => poolStakeWrite?.()}
                  isLoading={isPooledStakeLoading}
                  size={'lg'}
                >
                  Pooled
                </Button>
              </HStack>
            )}
            <Stack spacing={0} fontSize={'xs'}>
              <Text>platform fee: {platformFee} %, sponsor fee: {sponsorFee} ETH</Text>
              <Text>Pooled stake without sponsor fee!</Text>
            </Stack>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default FourDucksStake