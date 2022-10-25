import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/modal";
import {
  Button,
  Code,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Stack,
  useDisclosure
} from "@chakra-ui/react";
import {useState} from "react";
import {FOUR_DUCKS_ADDRESS} from "../../constant/address";
import {useContractWrite, useNetwork, usePrepareContractWrite} from "wagmi";
import FOUR_DUCKS_API from "../../abis/FourDucks.json";
import {SettingsIcon} from "@chakra-ui/icons";

const FourDucksSetting = () => {
  const {chain} = useNetwork()
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [requestParams, setRequestParams] = useState({
    _airnode: "0x9d3C147cA16DB954873A498e0af5852AB39139f2",
    _endpointIdUint256: "0xfb6d017bb87991b7495f563db3c8cf59ff87b09781947bb1e417006ad7f55a78",
    _sponsorWallet: "",
  })
  const {config} = usePrepareContractWrite({
    addressOrName: FOUR_DUCKS_ADDRESS[chain?.id || 5],
    contractInterface: FOUR_DUCKS_API,
    functionName: 'setRequestParameters',
    args: [requestParams._airnode, requestParams._endpointIdUint256, requestParams._sponsorWallet],
  })
  const {isLoading, isSuccess, write} = useContractWrite(config)

  return (
    <>
      <Button
        variant={"outline"}
        leftIcon={<SettingsIcon/>}
        onClick={onOpen}
      >
        QRNG
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>QRNG Providers Setting</ModalHeader>
          <ModalCloseButton borderRadius={'full'}/>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>airnode</FormLabel>
                <Input value={requestParams._airnode}
                       onChange={(e) => setRequestParams({...requestParams, _airnode: e.target.value})}/>
                <FormHelperText>
                  <Link href={'https://docs.api3.org/qrng/reference/providers.html'}
                        isExternal>https://docs.api3.org/qrng/reference/providers.html</Link>
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>endpointIdUint256</FormLabel>
                <Input value={requestParams._endpointIdUint256}
                       onChange={(e) => setRequestParams({...requestParams, _endpointIdUint256: e.target.value})}/>
              </FormControl>
              <FormControl>
                <FormLabel>sponsorWallet</FormLabel>
                <Input value={requestParams._sponsorWallet}
                       onChange={(e) => setRequestParams({...requestParams, _sponsorWallet: e.target.value})}/>
              </FormControl>
              <Code fontSize={'xs'} overflow={"scroll"} w={'full'} p={4} borderRadius={8}>
                npx @api3/airnode-admin derive-sponsor-wallet-address
                --airnode-xpub
                xpub6DXSDTZBd4aPVXnv6Q3SmnGUweFv6j24SK77W4qrSFuhGgi666awUiXakjXruUSCDQhhctVG7AQt67gMdaRAsDnDXv23bBRKsMWvRzo6kbf
                --airnode-address 0x9d3C147cA16DB954873A498e0af5852AB39139f2
                --sponsor-address {FOUR_DUCKS_ADDRESS[chain?.id || 5]}
              </Code>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={!write}
              isLoading={isLoading}
              onClick={async () => {
                await write?.()
                if (isSuccess) {
                  onClose()
                }
              }}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default FourDucksSetting