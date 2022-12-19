import {Stack} from "@chakra-ui/react";

// @ts-ignore
const Layout = ({children}) => {
  return (
    <Stack align={"center"} w={'full'} h={'full'}>
      <Stack maxW={'container.sm'} w={'full'} spacing={'20px'} align={"center"}>
        {children}
      </Stack>
    </Stack>
  )
}

export default Layout