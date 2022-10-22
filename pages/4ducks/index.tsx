import Layout from "../../components/layout";
import {Button, Heading, HStack, Stack, Text} from "@chakra-ui/react";
import ChakraBox from "../../components/chakraBox";
import {useAccount} from "wagmi";

const _4Ducks = () => {
  const {address} = useAccount()

  return (
    <Layout>
      <HStack w={'full'} h={'full'} alignItems={"start"}>
        <Stack p={'24px'} w={'full'} alignItems={"center"} spacing={'48px'}>
          <HStack w={'full'} spacing={'24px'}>
            <Heading fontWeight={'bold'}>4 Ducks</Heading>
          </HStack>
          <HStack justify={"space-around"} w={'full'}>
            <Button
              size={'lg'}
              colorScheme={'green'}>Yes</Button>
            <ChakraBox
              border={"2px solid"}
              borderColor={"yellow.900"}
              w={'600px'} h={'600px'} bg={"gold"} borderRadius={'full'}
              animate={{
                scale: [1, 0.918, 1, 0.918, 1],
              }}
              // @ts-ignore
              transition={{
                duration: 5,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
            </ChakraBox>
            <Button
              size={'lg'}
              colorScheme={'green'}
            >No</Button>
          </HStack>
          <HStack
            pt={'24px'}
            spacing={'12px'}>
            <Button
              size={'lg'}
              minW={'160px'}>
              Pay 2 ducks
            </Button>
          </HStack>
        </Stack>
        <Stack minW={'300px'} h={'full'} bg={"gray.50"} p={'12px'}>
          <Text>Users</Text>
        </Stack>
      </HStack>
    </Layout>
  );
}

export default _4Ducks;