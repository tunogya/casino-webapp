import {
  Box,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Deposit from "./Deposit";
import Gaming from "./Gaming";
import Withdraw from "./Withdraw";
import {Address, useNetwork, useToken} from "wagmi";
import {useRouter} from "next/router";

const CashMenu= () => {
  const cashMenu = [
    {title: 'recharge'},
    {title: 'gaming'},
    {title: 'redeem'},
  ]
  const router = useRouter()
  const {chain} = useNetwork()
  const {data: tokenData, isLoading: tokenIsLoading} = useToken({
    address: router.query.token as Address,
    chainId: chain?.id || 5,
  })

  return (
    <Stack maxW={'container.sm'} w={'full'} h={'full'} bg={"#1C1C1C"} px={'20px'} borderTopRadius={'20px'}
           color={"white"} align={"center"} pt={'10px'} spacing={0}>
      <Box bg={'#59585D'} h={'6px'} w={'48px'} borderRadius={'full'} mb={'10px'}/>
      {tokenIsLoading ? (
        <Heading fontSize={'2xl'} w={'full'} textAlign={"start"} pb={'20px'}>Loading...</Heading>
      ) : (
        <Heading fontSize={'2xl'} w={'full'} textAlign={"start"}
                 pb={'20px'}>{tokenData?.name} ({tokenData?.symbol})</Heading>
      )}
      <Tabs variant='soft-rounded' w={'full'} isLazy>
        <TabList>
          {
            cashMenu.map((item) => (
              <Tab key={item.title} color={'white'} fontSize={'xs'} onClick={() => {
                router.push({
                  pathname: '/',
                  query: {
                    ...router.query,
                    action: item.title.toLowerCase()
                  }
                })
              }}
                   _selected={{fontWeight: 'bold', fontSize: 'md'}}>
                {item.title.toUpperCase()}
              </Tab>
            ))
          }
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Deposit/>
          </TabPanel>
          <TabPanel p={0}>
            <Gaming/>
          </TabPanel>
          <TabPanel p={0}>
            <Withdraw/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  )
}

export default CashMenu