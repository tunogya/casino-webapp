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
import {useCallback, useEffect, useState} from "react";
import {useAccount, useNetwork} from "wagmi";
import axios from "axios";

const Home: NextPage = () => {
  const {isOpen: isCashMenuOpen, onOpen: onCashMenuOpen, onClose: onCashMenuClose} = useDisclosure()
  const {isOpen: isAddTokenOpen, onOpen: onAddTokenOpen, onClose: onAddTokenClose } = useDisclosure()
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [tokens, setTokens] = useState<string[]>([])

  const getMyTokens = useCallback(async () => {
    if (!address || !chain) {
      return
    }
    try {
      const res = await axios({
        method: "GET",
        url: `/api/${address?.toLowerCase()}?chainId=${chain?.id}`,
      })
      if (res.data?.tokens) {
        setTokens(res.data.tokens)
      }
    } catch (e: any) {
      if (e.response.status === 404) {
        try {
          await axios({
            method: "POST",
            url: `/api/${address?.toLowerCase()}?chainId=${chain?.id}`,
            data: {}
          })
        } catch (e) {
          console.log(e)
        }
      }
    }
  }, [address, chain])

  useEffect(() => {
    getMyTokens()
  }, [getMyTokens])

  return (
    <Layout>
      <HStack w={'full'} pt={'10px'} px={'10px'}>
        <Heading fontSize={'20px'}>My Cash</Heading>
        <Spacer/>
        <ConnectButton />
      </HStack>
      <VStack w={'full'} px={'10px'} spacing={'20px'}>
        { tokens.map((token, index) => (
          <Button key={index} variant={'outline'} w={'full'} onClick={onCashMenuOpen}>
            {token}
          </Button>
        )) }
      </VStack>
      <HStack spacing={0} pt={'20px'}>
        <Text fontSize={'sm'}>Do not see your token?</Text>
        <Button variant={'ghost'} fontSize={'sm'} size={'sm'} onClick={onAddTokenOpen}>Add Token</Button>
      </HStack>
      <Drawer placement={'bottom'} onClose={onCashMenuClose} isOpen={isCashMenuOpen} autoFocus={false}>
        <DrawerOverlay/>
        <DrawerContent h={'60vh'} alignItems={"center"} bg={'transparent'}>
          <CashMenu />
        </DrawerContent>
      </Drawer>
      <Drawer placement={'bottom'} onClose={onAddTokenClose} isOpen={isAddTokenOpen} autoFocus={false}>
        <DrawerOverlay/>
        <DrawerContent h={'60vh'} alignItems={"center"} bg={'transparent'}>
          <AddToken oldTokens={tokens} refresh={getMyTokens}/>
        </DrawerContent>
      </Drawer>
    </Layout>
  );
};

export default Home;
