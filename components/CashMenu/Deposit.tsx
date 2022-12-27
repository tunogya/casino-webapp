import {
  Button,
  FormControl, HStack,
  Input,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack, Text
} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {useState} from "react";
import {Address, useAccount, useBalance, useNetwork, useToken} from "wagmi";
import {BigNumber} from "ethers";
import ApproveERC20Button from "../ApproveERC20Button";
import {CASH_ADDRESS} from "../../constant/address";

const Deposit= () => {
  const router = useRouter()
  const {chain} = useNetwork()
  const { address } = useAccount()
  const [amount, setAmount] = useState('')
  const { data: tokenData } = useToken({
    address: router.query?.token as Address,
    chainId: chain?.id
  })

  // get balance of token
  const {data: balanceData} = useBalance({
    address: address,
    chainId: chain?.id,
    token: router.query?.token as Address,
    formatUnits: tokenData?.decimals || 'ether',
    cacheTime: 3_000,
  })

  return (
    <Stack spacing={'20px'} pt={'40px'}>
      <FormControl>
        <Input type={'number'} variant={'flushed'} onChange={(e) => setAmount(e.target.value)}
               focusBorderColor={'white'}
               isInvalid={BigNumber.from(amount || '0').mul(BigNumber.from(10).pow(tokenData?.decimals || 18)).gt(balanceData?.value || '0')}
               placeholder={'Input amount'} _placeholder={{color: '#59585D'}}/>
      </FormControl>
      <Slider aria-label='slider-ex-1' defaultValue={50} step={25}>
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
        <Text fontSize={'xs'}>Available Balance: {balanceData?.formatted || '-'} {tokenData?.symbol || '-'}</Text>
      </Stack>
      <HStack pt={'40px'}>
        <ApproveERC20Button token={router.query.token} owner={address} spender={CASH_ADDRESS[chain?.id || 5]}
                            spendAmount={BigNumber.from(amount || 0).mul(BigNumber.from(10).pow(BigNumber.from(tokenData?.decimals || 18)))} />
        <Button w={'full'}>
          Deposit
        </Button>
      </HStack>
    </Stack>
  )
}

export default Deposit