import {Badge, HStack, Link, Spacer, Text} from "@chakra-ui/react";
import {FC} from "react";
import {LogType} from "../../pages/fourducks";
import {FOUR_DUCKS_ADDRESS} from "../../constant/address";
import FOUR_DUCKS_API from "../../abis/FourDucks.json";
import {useContractReads, useNetwork} from "wagmi";
import {useRouter} from "next/router";

interface FourDucksLogProps {
  log: LogType
}

const FourDucksLog: FC<FourDucksLogProps> = ({log}) => {
  const {chain} = useNetwork()
  const router = useRouter()
  const FourDucksContract = {
    addressOrName: FOUR_DUCKS_ADDRESS[chain?.id || 5],
    contractInterface: FOUR_DUCKS_API,
  }
  const {data, isLoading} = useContractReads({
    contracts: [
      {
        ...FourDucksContract,
        functionName: 'coordinatesOf',
        args: [log.topics?.[3]],
      },
      {
        ...FourDucksContract,
        functionName: 'calculate',
        args: [log.topics?.[3]],
      },
    ],
    watch: true,
    cacheTime: 3_000,
  })

  return (
    <HStack>
      { isLoading ? (
        <Badge color={'black'} bg={"white"} w={'60px'} textAlign={"center"}
        >...</Badge>
      ) : (
        <Badge cursor={"pointer"}
               color={'white'} bg={data?.[1] ? 'green.400' : 'red.400'} w={'60px'} textAlign={"center"}
               onClick={() => {
                 router.push({
                   query: {
                     ...router.query,
                     q: log.topics[3],
                   }
                 })
               }}
        >{data?.[1] ? 'Yes' : 'No'}</Badge>
      ) }
      <Link fontSize={'xs'} isExternal
            href={chain?.blockExplorers?.etherscan?.url + '/tx/' + log.transactionHash}>
        TX: {log.transactionHash.slice(0, 6) + '...' + log.transactionHash.slice(-4)}
      </Link>
      <Spacer/>
      <Text fontSize={'xs'} textAlign={"end"}>
        {new Date(Number(log.timeStamp) * 1000).toLocaleString()}
      </Text>
    </HStack>
  )
}

export default FourDucksLog