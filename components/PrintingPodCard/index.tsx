import {Button, Stack} from "@chakra-ui/react";
import {useState} from "react";

const PrintingPodCard = () => {
  const [show, setShow] = useState(false)

  return (
    <Stack spacing={'24px'} h={'600px'} onMouseOver={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <Stack borderRadius={20} border={'2px solid'} borderColor={'yellow.900'} p={'20px'} w={'300px'} h={'536px'}
             bg={'gold'} cursor={'pointer'}>
        <div>Printing Pod</div>
      </Stack>
      { show && (
        <Button>
          Mint
        </Button>
      ) }
    </Stack>

  )
}

export default PrintingPodCard