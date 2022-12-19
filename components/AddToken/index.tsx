import {Box, Button, FormControl, Heading, Input, Stack} from "@chakra-ui/react";

const AddToken = () => {
  return (
    <Stack maxW={'container.sm'} w={'full'} h={'full'} bg={"#1C1C1C"} px={'20px'} borderTopRadius={'20px'}
           color={"white"} align={"center"} pt={'10px'} spacing={0}>
      <Box bg={'#59585D'} h={'6px'} w={'48px'} borderRadius={'full'}/>
      <Heading fontSize={'2xl'} w={'full'} textAlign={"start"} pb={'20px'}>Add Token</Heading>
      <FormControl>
        <Input variant={'flushed'} placeholder={'Search token'} _placeholder={{color: '#59585D'}}/>
      </FormControl>
      <Stack pt={'40px'}>
        <Button variant={'ghost'} w={'full'}>
          Add
        </Button>
      </Stack>
    </Stack>
  )
}

export default AddToken