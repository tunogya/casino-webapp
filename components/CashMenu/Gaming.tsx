import {Button, Wrap, WrapItem} from "@chakra-ui/react";

const Gaming = () => {
  return (
    <Wrap spacing={'20px'} pt={'40px'}>
      <WrapItem p={'4px'}>
        <Button variant={"ghost"}>
          Stake Ducks
        </Button>
      </WrapItem>
    </Wrap>
  )
}

export default Gaming