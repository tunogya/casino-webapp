import {Button, Wrap, WrapItem} from "@chakra-ui/react";
import {useRouter} from "next/router";

const Gaming = () => {
  const router = useRouter()

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