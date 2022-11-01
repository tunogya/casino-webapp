import {Badge, HStack, Link, Spacer, Text} from "@chakra-ui/react";
import {FC} from "react";
import {LogType} from "../../pages/4ducks/[id]";
import {FOUR_DUCKS_ADDRESS} from "../../constant/address";
import FOUR_DUCKS_API from "../../abis/FourDucks.json";
import {useContractReads, useNetwork} from "wagmi";

interface FourDucksLogProps {
  log: LogType
}

const FourDucksLog: FC<FourDucksLogProps> = ({log}) => {
  const { chain } = useNetwork()
  const FourDucksContract = {
    addressOrName: FOUR_DUCKS_ADDRESS[chain?.id || 5],
    contractInterface: FOUR_DUCKS_API,
  }
  const {data} = useContractReads({
    contracts: [
      {
        ...FourDucksContract,
        functionName: 'coordinatesOf',
        args: [log.topics[2]],
      },
      {
        ...FourDucksContract,
        functionName: 'calculate',
        args: [log.topics[2]],
      },
    ],
    watch: true,
    cacheTime: 3_000,
  })

  return (
    <HStack>
      <Badge w={'60px'} p={'1'} textAlign={"center"} fontSize={'xs'}>{data?.[1] ? 'Yes' : 'No'}</Badge>
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