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

const CashMenu = () => {
  const cashMenu = [
    {title: 'Recharge'},
    {title: 'Gaming'},
    {title: 'Redeem'},
  ]

  return (
    <Stack maxW={'container.sm'} w={'full'} h={'full'} bg={"#1C1C1C"} px={'20px'} borderTopRadius={'20px'}
           color={"white"} align={"center"} pt={'10px'} spacing={0}>
      <Box bg={'#59585D'} h={'6px'} w={'48px'} borderRadius={'full'}/>
      <Heading fontSize={'2xl'} w={'full'} textAlign={"start"} pb={'20px'}>WUSD</Heading>
      <Tabs variant='soft-rounded' w={'full'} isLazy>
        <TabList>
          {
            cashMenu.map((item) => (
              <Tab key={item.title} color={'white'} fontSize={'sm'} borderRadius={'0px'}
                   border={'1px dashed transparent'}
                   _selected={{color: 'white', border: '1px dashed white'}}>
                {item.title}
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