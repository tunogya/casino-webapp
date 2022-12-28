import {
  Button,
  FormControl,
  Input,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack, Text
} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {
  Address,
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useToken
} from "wagmi";
import {useEffect, useState} from "react";
import {CASH_ADDRESS} from "../../constant/address";
import {CASH_ABI} from "../../constant/abi";
import {BigNumber} from "ethers";

const Withdraw = () => {
  const router = useRouter()
  const {chain} = useNetwork()
  const { address } = useAccount()
  const [amount, setAmount] = useState('')
  const { data: tokenData } = useToken({
    address: router.query?.token as Address,
    chainId: chain?.id
  })
  const [sliderValue, setSliderValue] = useState(50)
  // get balance of cash
  const {data: cashBalance} = useContractRead({
    address: CASH_ADDRESS[chain?.id || 5],
    abi: CASH_ABI,
    functionName: "balanceOf",
    args: [router.query?.token as Address, address],
  })

  const { config: withdrawConfig } = usePrepareContractWrite({
    address: CASH_ADDRESS[chain?.id || 5],
    abi: CASH_ABI,
    functionName: 'withdraw',
    args: [router.query?.token as Address, BigNumber.from(amount || 0).mul(BigNumber.from(10).pow(tokenData?.decimals || 18))],
  })
  const { write: withdraw, status: withdrawStatus } = useContractWrite(withdrawConfig)

  useEffect(() => {
    setAmount(BigNumber.from(cashBalance || 0).mul(BigNumber.from(sliderValue)).div(BigNumber.from(10).pow(2)).div(BigNumber.from(10).pow(tokenData?.decimals || 18)).toString())
  }, [cashBalance, sliderValue, tokenData?.decimals])

  return (
    <Stack spacing={'20px'} pt={'40px'}>
      <FormControl>
        <Input variant={'flushed'} value={amount} placeholder={'Input amount'} onChange={(e) => setAmount(e.target.value)}
               _placeholder={{color: '#59585D'}}/>
      </FormControl>
      <Slider aria-label='slider-ex-1' defaultValue={50} step={25} value={sliderValue} onChange={(e) => setSliderValue(e)}>
        <SliderTrack bg='#59585D' h={'8px'}>
          <SliderFilledTrack bg='white'/>
        </SliderTrack>
        <SliderThumb borderRadius={0}/>
        <SliderMark value={25} fontSize={'sm'} mt={2} ml={-2.5}>
          25%
        </SliderMark>
        <SliderMark value={50} fontSize={'sm'} mt={2} ml={-2.5}>
          50%
        </SliderMark>
        <SliderMark value={75} fontSize={'sm'} mt={2} ml={-2.5}>
          75%
        </SliderMark>
      </Slider>
      <Stack py={'10px'}>
        <Text fontSize={'xs'}>Cash Balance: {BigNumber.from(cashBalance || 0).div(BigNumber.from(10).pow(tokenData?.decimals || 18)).toString() || '-'} {tokenData?.symbol || '-'}</Text>
      </Stack>
      <Stack pt={'40px'}>
        <Button w={'full'} isLoading={withdrawStatus === 'loading'} loadingText={'Withdrawing'} onClick={() => withdraw?.()}>
          Withdraw
        </Button>
      </Stack>
    </Stack>
  )
}

export default Withdraw