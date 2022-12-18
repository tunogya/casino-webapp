import {Heading, Spacer, Stack} from "@chakra-ui/react";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useRouter} from "next/router";
import useTelegramWebApp from "../../hooks/useTelegramWebApp";

// @ts-ignore
const Layout = ({children}) => {
  const router = useRouter()
  const { user } = useTelegramWebApp()

  return (
    <Stack align={"center"} w={'full'} h={'full'}>
      <Stack maxW={'container.sm'} w={'full'} spacing={'20px'} align={"center"}>
        {children}
      </Stack>
    </Stack>
  )
}

export default Layout