import type {NextPage} from 'next';
import {
  Heading,
  Button,
  HStack,
  Spacer,
  IconButton,
  chakra,
  VStack,
  Text,
  DrawerContent,
  DrawerOverlay,
  Drawer,
  useDisclosure,
  Stack,
  Box,
  TabPanel,
  TabPanels,
  Tab,
  Tabs,
  TabList,
  FormControl,
  Input, SliderTrack, SliderThumb, Slider, SliderFilledTrack, SliderMark, Wrap, WrapItem,
} from "@chakra-ui/react";
import Layout from "../components/layout";
import {useState} from "react";
import {useRouter} from "next/router";
import {ConnectButton} from "@rainbow-me/rainbowkit";

const Home: NextPage = () => {
  const router = useRouter()
  const {isOpen: isCashMenuOpen, onOpen: onCashMenuOpen, onClose: onCashMenuClose} = useDisclosure()
  const {isOpen: isAddTokenOpen, onOpen: onAddTokenOpen, onClose: onAddTokenClose } = useDisclosure()
  const [depositSliderValue, setDepositSliderValue] = useState(50)
  const [withdrawSliderValue, setWithdrawSliderValue] = useState(50)

  const cashMenu = [
    {title: 'Recharge'},
    {title: 'Gaming'},
    {title: 'Redeem'},
  ]

  return (
    <Layout>
      <HStack w={'full'} pt={'10px'} px={'10px'}>
        <Heading fontSize={'20px'}>My Cash</Heading>
        <Spacer/>
        <ConnectButton />
      </HStack>
      <VStack w={'full'} px={'10px'} spacing={'20px'}>
        <Button variant={'outline'} w={'full'} onClick={onCashMenuOpen}>
          200 WUSD
        </Button>
        <Button variant={'outline'} w={'full'} onClick={onCashMenuOpen}>
          200 WUSD
        </Button>
        <Button variant={'outline'} w={'full'} onClick={onCashMenuOpen}>
          200 WUSD
        </Button>
      </VStack>
      <Drawer placement={'bottom'} onClose={onCashMenuClose} isOpen={isCashMenuOpen}>
        <DrawerOverlay/>
        <DrawerContent h={'60vh'} alignItems={"center"} bg={'transparent'}>
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
                        Deposit
                      </Button>
                    </Stack>
                  </Stack>
                </TabPanel>
                <TabPanel p={0}>
                  <Wrap spacing={'20px'} pt={'40px'}>
                    <WrapItem p={'4px'}>
                      <Button variant={"ghost"}>
                        Stake Ducks
                      </Button>
                    </WrapItem>
                  </Wrap>
                </TabPanel>
                <TabPanel p={0}>
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
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </DrawerContent>
      </Drawer>
      <VStack spacing={0} pt={'20px'}>
        <Text fontSize={'sm'}>Do not see your token?</Text>
        <Button variant={'ghost'} fontSize={'sm'} size={'sm'} onClick={onAddTokenOpen}>Add Token</Button>
      </VStack>
      <Drawer placement={'bottom'} onClose={onAddTokenClose} isOpen={isAddTokenOpen}>
        <DrawerOverlay/>
        <DrawerContent h={'60vh'} alignItems={"center"} bg={'transparent'}>
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
        </DrawerContent>
      </Drawer>
    </Layout>
  );
};

export default Home;
