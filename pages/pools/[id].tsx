import Layout from "../../components/layout";
import {Button, Spacer, Stack, Text} from "@chakra-ui/react";
import {useAccount, useContractReads, useNetwork} from "wagmi";
import {SNATCH_ADDRESS} from "../../constant/address";
import SNATCH_ABI from "../../abis/Snatch.json";
import {useRouter} from "next/router";

const Pool = () => {
  const {address} = useAccount()
  const {chain} = useNetwork()
  const router = useRouter()
  const { id } = router.query

  const SnatchContract = {
    addressOrName: SNATCH_ADDRESS[chain?.id || 5],
    contractInterface: SNATCH_ABI,
  }

  const {data, isError, isLoading} = useContractReads({
    contracts: [
      {
        ...SnatchContract,
        functionName: 'poolConfigOf',
        args: [0],
      },
      {
        ...SnatchContract,
        functionName: 'rpOf',
        args: [address, 0],
      }
    ]
  })

  // get rp of myself
  if (data) {
    console.log(data[0])
    console.log(data[1])
  }

  // get pool config of id

  //


  return (
    <Layout>
      <Stack direction={"row"} h={'full'}>
        <Stack minW={60} bg={"blackAlpha.600"} p={4} spacing={5} overflow={"scroll"}>
          <Button>ETH</Button>
        </Stack>
        <Stack w={'full'} h={'full'} py={40} alignItems={"center"}>
          <Stack textAlign={"center"} w={'100px'} bg={"gray"} py={1} mt={'300px'}>
            <Text color={'white'}>RP</Text>
          </Stack>
          <Spacer/>
          <Stack direction={"row"} justify={"center"} spacing={20}>
            <Button bg={'gold'}>50, 1 draw</Button>
            <Button bg={'gold'}>200, 5 draws</Button>
          </Stack>
        </Stack>
        <Stack minW={60} alignItems={"end"} h={'full'}>
          <Stack w={40} justify={"space-around"} h={'full'} pr={4}>
            <Button size={'lg'}>
              Store
            </Button>
            <Button size={'lg'}>
              Bonus
            </Button>
            <Button size={'lg'}>
              Prize Pool
            </Button>
            <Stack spacing={4} bg={"gray"} p={4}>
              <Button size={'lg'}>
                Prize 1
              </Button>
              <Button size={'lg'}>
                Prize 2
              </Button>
              <Button size={'lg'}>
                Prize 3
              </Button>
              <Button size={'lg'}>
                Prize 4
              </Button>
              <Button size={'lg'}>
                Prize 5
              </Button>
            </Stack>

          </Stack>
        </Stack>
      </Stack>
    </Layout>
  )
}

export default Pool