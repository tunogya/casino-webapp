import {chakra, Heading, HStack, IconButton} from "@chakra-ui/react";
import Layout from "../../components/layout";
import {useRouter} from "next/router";

const History = () => {
  const router = useRouter()

  return (
    <Layout>
      <HStack w={'full'} pt={'10px'}>
        <IconButton aria-label={'notice'} icon={<chakra.img src={'/svg/arrowtriangle.left.svg'} h={'20px'} w={'20px'}/>}
                    variant={'ghost'} onClick={() => router.push('/')}/>
        <Heading fontSize={'20px'}>History</Heading>
      </HStack>
    </Layout>
  )
}

export default History