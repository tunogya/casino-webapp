import {Box, Button, FormControl, Heading, Input, Stack} from "@chakra-ui/react";
import {FC, useState} from "react";
import {isAddress} from "ethers/lib/utils";
import axios from "axios";
import {useAccount, useNetwork} from "wagmi";

type AddTokenProps = {
  oldTokens: string[]
  refresh: () => void
}

const AddToken: FC<AddTokenProps> = ({oldTokens, refresh}) => {
  const [token, setToken] = useState("")
  const { chain } = useNetwork()
  const { address } = useAccount()
  const [addStatus, setAddStatus] = useState("IDLE")

  const addToken = async () => {
    if (!isAddress(token) || !address || !chain) {
      return
    }
    setAddStatus("LOADING")
    try {
      await axios({
        method: "POST",
        url: `/api/${address?.toLowerCase()}?chainId=${chain?.id}`,
        data: {
          // @ts-ignore
          tokens: [...new Set([...oldTokens, token])]
        }
      })
      setAddStatus("SUCCESS")
      refresh()
      setInterval(() => {
        setAddStatus("IDLE")
      }, 3000)
    } catch (e) {
      setAddStatus("ERROR")
      setInterval(() => {
        setAddStatus("IDLE")
      }, 3000)
    }
  }

  return (
    <Stack maxW={'container.sm'} w={'full'} h={'full'} bg={"#1C1C1C"} px={'20px'} borderTopRadius={'20px'}
           color={"white"} align={"center"} pt={'10px'} spacing={0}>
      <Box bg={'#59585D'} h={'6px'} w={'48px'} borderRadius={'full'}/>
      <Heading fontSize={'2xl'} w={'full'} textAlign={"start"} pb={'20px'}>Add Token</Heading>
      <FormControl>
        <Input variant={'flushed'} onChange={(e) => setToken(e.target.value)} placeholder={'Search token'}
               _placeholder={{color: '#59585D'}}/>
      </FormControl>
      <Stack pt={'40px'}>
        <Button variant={'ghost'} w={'full'} onClick={addToken} isLoading={addStatus === "LOADING"} loadingText={"Adding"}
                disabled={!isAddress(token) || !address || !chain}>
          Add
        </Button>
      </Stack>
    </Stack>
  )
}

export default AddToken