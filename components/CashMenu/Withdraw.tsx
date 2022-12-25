import {
  Button,
  FormControl,
  Input,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack
} from "@chakra-ui/react";
import {Address} from "wagmi";
import {FC} from "react";

type WithdrawProps = {
  token: Address;
}

const Withdraw: FC<WithdrawProps> = ({token}) => {
  return (
    <Stack spacing={'20px'} pt={'40px'}>
      <FormControl>
        <Input variant={'flushed'} placeholder={'Input amount'} _placeholder={{color: '#59585D'}}/>
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
      <Stack pt={'40px'}>
        <Button variant={'ghost'} w={'full'}>
          Withdraw
        </Button>
      </Stack>
    </Stack>
  )
}

export default Withdraw