import type {NextPage} from 'next';
import {
  Heading,
  Button,
  HStack,
  Spacer,
  VStack,
  Text,
  DrawerContent,
  DrawerOverlay,
  Drawer,
  useDisclosure,
} from "@chakra-ui/react";
import Layout from "../components/layout";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import AddToken from "../components/AddToken";
import CashMenu from "../components/CashMenu";

const Home: NextPage = () => {
  const {isOpen: isCashMenuOpen, onOpen: onCashMenuOpen, onClose: onCashMenuClose} = useDisclosure()
  const {isOpen: isAddTokenOpen, onOpen: onAddTokenOpen, onClose: onAddTokenClose } = useDisclosure()

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
      <HStack spacing={0} pt={'20px'}>
        <Text fontSize={'sm'}>Do not see your token?</Text>
        <Button variant={'ghost'} fontSize={'sm'} size={'sm'} onClick={onAddTokenOpen}>Add Token</Button>
      </HStack>
      <Drawer placement={'bottom'} onClose={onCashMenuClose} isOpen={isCashMenuOpen}>
        <DrawerOverlay/>
        <DrawerContent h={'60vh'} alignItems={"center"} bg={'transparent'}>
          <CashMenu />
        </DrawerContent>
      </Drawer>
      <Drawer placement={'bottom'} onClose={onAddTokenClose} isOpen={isAddTokenOpen}>
        <DrawerOverlay/>
        <DrawerContent h={'60vh'} alignItems={"center"} bg={'transparent'}>
          <AddToken/>
        </DrawerContent>
      </Drawer>
    </Layout>
  );
};

export default Home;
