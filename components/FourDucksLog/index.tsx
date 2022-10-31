import {Stack, Text} from "@chakra-ui/react";
import {FC, useState} from "react";
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
    <Stack>
      <Text>{data?.[1] ? 'Yes' : 'No'}</Text>
    </Stack>
  )
}

export default FourDucksLog