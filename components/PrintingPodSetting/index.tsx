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
import {PRINTING_POD_ADDRESS} from "../../constant/address";
import {useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import PRINTING_POD_ABI from "../../abis/PrintingPod.json";
import {SettingsIcon} from "@chakra-ui/icons";

const PrintingPodSetting = () => {
  const {chain} = useNetwork()
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [requestParams, setRequestParams] = useState({
    _airnode: "0x9d3C147cA16DB954873A498e0af5852AB39139f2",
    _endpointIdUint256Array: "0x27cc2713e7f968e4e86ed274a051a5c8aaee9cca66946f23af6f29ecea9704c3",
    _sponsorWallet: "",
  })
  const {config} = usePrepareContractWrite({
    addressOrName: PRINTING_POD_ADDRESS[chain?.id || 5],
    contractInterface: PRINTING_POD_ABI,
    functionName: 'setRequestParameters',
    args: [requestParams._airnode, requestParams._endpointIdUint256Array, requestParams._sponsorWallet],
  })
  const {isLoading, write, data} = useContractWrite(config)
  const { status: waitStatus } = useWaitForTransaction({
    wait: data?.wait
  })

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
                <FormLabel>endpointIdUint256Array</FormLabel>
                <Input value={requestParams._endpointIdUint256Array}
                       onChange={(e) => setRequestParams({...requestParams, _endpointIdUint256Array: e.target.value})}/>
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
                --sponsor-address {PRINTING_POD_ADDRESS[chain?.id || 5]}
              </Code>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={!write}
              isLoading={isLoading || waitStatus === 'loading'}
              onClick={async () => {
                await write?.()
                if (waitStatus === 'success') {
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

export default PrintingPodSetting