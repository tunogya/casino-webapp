import Layout from "../../components/layout";
import {Button, Heading, HStack, Stack} from "@chakra-ui/react";
import PrintingPodCard from "../../components/PrintingPodCard";

const Printingpod = () => {
  return (
    <Layout>
      <Stack h={'full'} w={'full'} align={"center"} p={['12px', '24px']} spacing={'48px'}>
        <Heading>Printing Pod</Heading>
        <Stack w={'full'} h={'full'} maxW={'container.md'} spacing={'48px'}>
          <HStack spacing={'24px'} justify={"center"}>
            <Button>Draw x3</Button>
          </HStack>
          <HStack spacing={'24px'} justify={"center"}>
            <PrintingPodCard />
            <PrintingPodCard />
            <PrintingPodCard />
          </HStack>
        </Stack>
      </Stack>
    </Layout>
  )
}

export default Printingpod