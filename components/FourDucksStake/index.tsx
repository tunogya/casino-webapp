import {
  Button, FormControl, FormHelperText, FormLabel, HStack, Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger, Stack, Text
} from "@chakra-ui/react";
import {FC, useEffect, useMemo, useState} from "react";
import {
  erc20ABI,
  useAccount,
  useContractReads,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction
} from "wagmi";
import {FOUR_DUCKS_ADDRESS} from "../../constant/address";
import FOUR_DUCKS_API from "../../abis/FourDucks.json";
import {BigNumber, ethers} from "ethers";
import {AddressZero} from "@ethersproject/constants";

type PickStakeProps = {
  label: string,
  poolId: string,
  isOptimistic: boolean,
}

const FourDucksStake: FC<PickStakeProps> = ({label, poolId, isOptimistic}) => {
  const {chain} = useNetwork()
  const {address} = useAccount()
  const [token, setToken] = useState("0xDfcBBb16FeEB9dD9cE3870f6049bD11d28390FbF")
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [amount, setAmount] = useState("")
  const [tokenBalanceOfMe, setTokenBalanceOfMe] = useState("")
  const [tokenBalanceOfContract, setTokenBalanceOfContract] = useState("")
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
      {
        ...TokenContract,
        functionName: 'symbol',
      },
      {
        ...TokenContract,
        functionName: 'name',
      },
      {
        ...TokenContract,
        functionName: 'balanceOf',
        args: [FOUR_DUCKS_ADDRESS[chain?.id || 5]],
      }
    ],
    watch: true,
    cacheTime: 3_000,
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
    ],
    watch: true,
    cacheTime: 3_000,
  })
  const parseAmount = useMemo(() => {
    if (data && amount) {
      return ethers.utils.parseUnits(amount, data[0]).mul(isOptimistic ? BigNumber.from(1) : BigNumber.from(-1))
    } else {
      return BigNumber.from(0)
    }
  }, [amount, data, isOptimistic])
  const {config: pooledStakeConfig} = usePrepareContractWrite({
    addressOrName: FOUR_DUCKS_ADDRESS[chain?.id || 5],
    contractInterface: FOUR_DUCKS_API,
    functionName: 'pooledStake',
    args: [poolId, token, parseAmount],
    overrides: {
      value: token === AddressZero ? parseAmount : BigNumber.from(0),
      gasLimit: 1000000,
    }
  })
  const [platformFee, setPlatformFee] = useState('0')
  const [sponsorFee, setSponsorFee] = useState("0")
  const {
    isLoading: isPooledStakeLoading,
    write: poolStakeWrite,
    data: pooledStakeData
  } = useContractWrite(pooledStakeConfig)
  const {
    status: waitPooledStakeStatus
  } = useWaitForTransaction({
    wait: pooledStakeData?.wait
  })
  const {config: soloStakeConfig} = usePrepareContractWrite({
    addressOrName: FOUR_DUCKS_ADDRESS[chain?.id || 5],
    contractInterface: FOUR_DUCKS_API,
    functionName: 'soloStake',
    args: [poolId, token, parseAmount],
    overrides: {
      value: token === AddressZero ? parseAmount : ethers.utils.parseEther(sponsorFee),
      gasLimit: 1000000,
    }
  })
  const {write: soloStakeWrite, data: soloStakeData, isLoading: isSoloStakeLoading} = useContractWrite(soloStakeConfig)
  const {status: waitSoloStakeStatus} = useWaitForTransaction({
    wait: soloStakeData?.wait
  })
  const {config: approveConfig} = usePrepareContractWrite({
    addressOrName: token,
    contractInterface: erc20ABI,
    functionName: 'approve',
    args: [FOUR_DUCKS_ADDRESS[chain?.id || 5], ethers.constants.MaxUint256],
  })
  const {write: approveWrite, data: approveData, isLoading: isApproveLoading} = useContractWrite(approveConfig)
  const {status: waitApproveStatus} = useWaitForTransaction({
    wait: approveData?.wait
  })

  useEffect(() => {
    if (fourDucksData) {
      setPlatformFee((Number(ethers.utils.formatEther(fourDucksData?.[0] || '0')) * 100).toString())
      setSponsorFee(ethers.utils.formatEther(fourDucksData?.[1] || '0'))
    }
  }, [fourDucksData])

  useEffect(() => {
    if (data) {
      setTokenName(String(data[4]))
      setTokenBalanceOfMe(ethers.utils.formatUnits(data[1], data[0]))
      setTokenBalanceOfContract(ethers.utils.formatUnits(data[5], data[0]))
      setTokenSymbol(String(data[3]))
    }
  }, [data])

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          w={'full'}
          bg={isOptimistic ? 'green.400' : 'red.400'}
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
                >Token: {tokenName}</FormLabel>
                <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder={'Token Address'}/>
              </FormControl>
            <FormControl>
              <FormLabel
                fontSize={'xs'}
                color={'yellow.900'}
                fontWeight={'bold'}
                fontFamily={'Syncopate'}
              >Amount:</FormLabel>
              <Input type={"number"} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={'Token Amount'}/>
              <FormHelperText
                fontSize={'xs'}
                color={'yellow.900'}
                textAlign={"end"}
              >
                <Text
                  color={Number(tokenBalanceOfMe) < Number(amount) ? 'red.400' : ''}>My
                  Balance: {Number(tokenBalanceOfMe).toLocaleString()} {tokenSymbol}<br/></Text>
                <Text
                  color={Number(tokenBalanceOfContract) < Number(amount) * 2 ? 'red.400' : ''}
                >Pool
                  Balance: {Number(tokenBalanceOfContract).toLocaleString()} {tokenSymbol}</Text>
              </FormHelperText>
            </FormControl>
            <Stack pt={'24px'}>
              {(BigNumber.from(data?.[2] || 0).lt(parseAmount)) ? (
                <Button
                  bg={isOptimistic ? 'green.400' : 'red.400'}
                  disabled={!approveWrite}
                  onClick={() => approveWrite?.()}
                  isLoading={isApproveLoading || waitApproveStatus === 'loading'}
                  size={'lg'}
                >
                  Approve
                </Button>
              ) : (
                <HStack>
                  <Button
                    variant={'outline'}
                    color={isOptimistic ? 'green.400' : 'red.400'}
                    disabled={!soloStakeWrite || amount == '' || Number(ethers.utils.formatUnits(data?.[1] || '0', data?.[0]).toString()) < Number(amount)}
                    onClick={() => soloStakeWrite?.()}
                    isLoading={isSoloStakeLoading || waitSoloStakeStatus === 'loading'}
                    size={'lg'}
                  >
                    Solo
                  </Button>
                  <Button
                    bg={isOptimistic ? 'green.400' : 'red.400'}
                    disabled={!poolStakeWrite || amount == '' || Number(ethers.utils.formatUnits(data?.[1] || '0', data?.[0]).toString()) < Number(amount)}
                    onClick={() => poolStakeWrite?.()}
                    isLoading={isPooledStakeLoading || waitPooledStakeStatus === 'loading'}
                    size={'lg'}
                  >
                    Pooled
                  </Button>
                </HStack>
              )}
            </Stack>
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