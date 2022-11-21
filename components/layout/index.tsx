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
      <Stack maxW={'container.sm'} w={'full'} spacing={'0'} align={"center"}>
        <Stack direction={"row"} px={4} py={2} align={"center"} bg={'#FAE35A'} w={'full'} position={'sticky'} top={0} zIndex={100}
               borderBottom={"2px solid #400000"}>
          <Stack
            spacing={0}
            onClick={() => {
              router.push('/')
            }}
            cursor={"pointer"}
          >
            <Heading fontSize={'xx-small'} fontWeight={'normal'}> { user ? `Hello, @${user.username}` : 'WizardingPay' }</Heading>
            <Heading
              fontSize={"md"}
            >
              Casino
            </Heading>
          </Stack>
          <Spacer/>
          <ConnectButton/>
        </Stack>
        {children}
      </Stack>
    </Stack>
  )
}

export default Layout