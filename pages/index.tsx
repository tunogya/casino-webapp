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
  DrawerContent, DrawerOverlay, Drawer, useDisclosure, Stack, Box,
} from "@chakra-ui/react";
import Layout from "../components/layout";
import {useRouter} from "next/router";
import {ChevronRightIcon} from "@chakra-ui/icons";

const Home: NextPage = () => {
  const router = useRouter()
  const {isOpen, onOpen, onClose} = useDisclosure()

  return (
    <Layout>
      <HStack w={'full'} pt={'10px'} px={'10px'}>
        <Heading fontSize={'20px'}>My Cash</Heading>
        <Spacer/>
        <IconButton aria-label={'notice'} icon={<chakra.img src={'/svg/bell.svg'} h={'20px'} w={'20px'}/>}
                    variant={'ghost'}/>
        <IconButton aria-label={'history'}
                    icon={<chakra.img src={'/svg/clock.arrow.circlepath.svg'} h={'20px'} w={'20px'}/>}
                    variant={'ghost'}/>
        <IconButton aria-label={'setting'} icon={<chakra.img src={'/svg/gearshape.svg'} h={'20px'}/>} w={'20px'}
                    variant={'ghost'}/>
      </HStack>
      <VStack w={'full'} px={'10px'} spacing={'20px'}>
        <Button variant={'outline'} w={'full'} fontSize={'2xl'} size={'lg'} minH={'60px'} onClick={onOpen}>
          200 WUSD
        </Button>
        <Button variant={'outline'} w={'full'} fontSize={'2xl'} size={'lg'} minH={'60px'} onClick={onOpen}>
          200 WUSD
        </Button>
        <Button variant={'outline'} w={'full'} fontSize={'2xl'} size={'lg'} minH={'60px'} onClick={onOpen}>
          200 WUSD
        </Button>
      </VStack>
      <Drawer placement={'bottom'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent h={'50vh'} alignItems={"center"} bg={'transparent'}>
          <Stack maxW={'container.sm'} w={'full'} h={'full'} bg={"#1C1C1C"} px={'20px'} borderTopRadius={'20px'}
                 color={"white"} align={"center"} pt={'10px'} spacing={0}>
            <Box bg={'#59585D'} h={'6px'} w={'48px'} borderRadius={'full'}/>
            <Heading fontSize={'2xl'} w={'full'} textAlign={"start"} pb={'20px'}>200 WUSD</Heading>
            <Button w={'full'} variant={"ghost"} justifyContent={"start"}
                    leftIcon={<chakra.img src={'/svg/arrow.left.arrow.right.svg'} w={'16px'} h={'16px'}/>}>
              <Text>Recharge</Text>
              <Spacer/>
              <ChevronRightIcon/>
            </Button>
            <Button w={'full'} variant={"ghost"} justifyContent={"start"}
                    leftIcon={<chakra.img src={'/svg/arrow.triangle.branch.svg'} w={'16px'} h={'16px'}/>}>
              <Text>Gaming</Text>
              <Spacer/>
              <ChevronRightIcon/>
            </Button>
            <Button w={'full'} variant={"ghost"} justifyContent={"start"}
                    leftIcon={<chakra.img src={'/svg/arrow.uturn.down.svg'} w={'16px'} h={'16px'}/>}>
              <Text>Recharge</Text>
              <Spacer/>
              <ChevronRightIcon/>
            </Button>
          </Stack>
        </DrawerContent>
      </Drawer>
      <VStack>
        <Text></Text>
      </VStack>
    </Layout>
  );
};

export default Home;
