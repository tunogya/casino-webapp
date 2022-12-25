import {Button, Wrap, WrapItem} from "@chakra-ui/react";
import {Address} from "wagmi";
import {FC} from "react";

type GamingProps = {
  token: Address;
}

const Gaming: FC<GamingProps> = ({token}) => {
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