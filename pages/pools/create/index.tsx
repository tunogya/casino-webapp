import Layout from "../../../components/layout";
import {
  Button, Divider,
  FormControl,
  FormHelperText, FormLabel,
  HStack,
  Input,
  Stack,
  Text
} from "@chakra-ui/react";
import {useMemo, useState} from "react";
import {useContractWrite, useNetwork, usePrepareContractWrite} from "wagmi";
import {SNATCH_ADDRESS} from "../../../constant/address";
import SNATCH_ABI from "../../../abis/Snatch.json";
import {ethers} from "ethers";
import {AddIcon} from "@chakra-ui/icons";

type Config = {
  paymentToken: string | undefined,
  singleDrawPrice: string | undefined,
  batchDrawPrice: string | undefined,
  batchDrawSize: string | undefined,
  rarePrizeToken: string | undefined,
  rarePrizeInitRate: string | undefined,
  rarePrizeRateD: string | undefined,
  rarePrizeValue: string | undefined,
  rarePrizeMaxRP: string | undefined,
  normalPrizesToken: string[] | [],
  normalPrizesValue: string[] | [],
  normalPrizesRate: string[] | [],
}

const Create = () => {
  const {chain} = useNetwork()
  const [config, setConfig] = useState<Config>({
    paymentToken: "0xDfcBBb16FeEB9dD9cE3870f6049bD11d28390FbF",
    singleDrawPrice: "60",
    batchDrawPrice: "270",
    batchDrawSize: "5",
    rarePrizeToken: "0xDc5f81Ffa28761Fb5305072043EbF629A5c12351",
    rarePrizeInitRate: "0.0001",
    rarePrizeRateD: "0.00004444",
    rarePrizeValue: "1",
    rarePrizeMaxRP: "200",
    normalPrizesToken: [],
    normalPrizesValue: [],
    normalPrizesRate: [],
  })
  const [normalConfig, setNormalConfig] = useState({
    normalPrizesToken: '0xDfcBBb16FeEB9dD9cE3870f6049bD11d28390FbF',
    normalPrizesValue: "0",
    normalPrizesRate: "0",
  })
  const normalPrizeList = useMemo(() => {
    return config.normalPrizesToken.map((token, index) => {
      return {
        token,
        value: config.normalPrizesValue[index],
        rate: config.normalPrizesRate[index],
      }
    })
  }, [config])

  const {config: createConfig} = usePrepareContractWrite({
    addressOrName: SNATCH_ADDRESS[chain?.id || 5],
    contractInterface: SNATCH_ABI,
    functionName: 'createPool',
    args: {
      paymentToken: config.paymentToken,
      singleDrawPrice: ethers.utils.parseEther(config.singleDrawPrice || "0"),
      batchDrawPrice: ethers.utils.parseEther(config.batchDrawPrice || "0"),
      batchDrawSize: config.batchDrawSize,
      rarePrizeToken: config.rarePrizeToken,
      rarePrizeInitRate: ethers.utils.parseEther(config.rarePrizeInitRate || "0"),
      rarePrizeRateD: ethers.utils.parseEther(config.rarePrizeRateD || "0"),
      rarePrizeValue: ethers.utils.parseEther(config.rarePrizeValue || "0"),
      rarePrizeMaxRP: config.rarePrizeMaxRP,
      normalPrizesToken: config.normalPrizesToken,
      normalPrizesValue: config.normalPrizesValue.map(v => ethers.utils.parseEther(v)),
      normalPrizesRate: config.normalPrizesRate.map(r => ethers.utils.parseEther(r)),
    },
  })
  const {isLoading, write} = useContractWrite(createConfig)

  return (
    <Layout>
      <Stack p={'48px'}>
        <Stack w={'container.md'} p={'48px'} bg={"white"} borderRadius={'12px'}>
          <HStack>
            <FormControl>
              <FormLabel fontSize={'xs'} fontWeight={'bold'} fontFamily={'Syncopate'}>Payment Token Address</FormLabel>
              <Input placeholder={"Payment Token Address"} value={config.paymentToken}
                     onChange={e => setConfig({...config, paymentToken: e.target.value})}/>
              <FormHelperText></FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel fontSize={'xs'} fontWeight={'bold'} fontFamily={'Syncopate'}>Single Draw Price</FormLabel>
              <Input placeholder={"Single Draw Price"} type={"number"} value={config.singleDrawPrice}
                     onChange={e => setConfig({...config, singleDrawPrice: e.target.value})}/>
              <FormHelperText></FormHelperText>
            </FormControl>
          </HStack>
          <HStack>
            <FormControl>
              <FormLabel fontSize={'xs'} fontWeight={'bold'} fontFamily={'Syncopate'}>Batch Draw Size</FormLabel>
              <Input placeholder={"Batch Draw Size"} type={"number"} value={config.batchDrawSize}
                     onChange={e => setConfig({...config, batchDrawSize: e.target.value})}/>
              <FormHelperText></FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel fontSize={'xs'} fontWeight={'bold'} fontFamily={'Syncopate'}>Batch Draw Price</FormLabel>
              <Input placeholder={"Batch Draw Price"} type={"number"} value={config.batchDrawPrice}
                     onChange={e => setConfig({...config, batchDrawPrice: e.target.value})}/>
              <FormHelperText></FormHelperText>
            </FormControl>
          </HStack>
          <FormControl>
            <FormLabel fontSize={'xs'} fontWeight={'bold'} fontFamily={'Syncopate'}>Rare Prize Token</FormLabel>
            <Input placeholder={"Rare Prize Token"} value={config.rarePrizeToken}
                   onChange={e => setConfig({...config, rarePrizeToken: e.target.value})}/>
            <FormHelperText></FormHelperText>
          </FormControl>
          <HStack>
            <FormControl>
              <FormLabel fontSize={'xs'} fontWeight={'bold'} fontFamily={'Syncopate'}>Rare Prize Init Rate</FormLabel>
              <Input placeholder={"Rare Prize Init Rate"} type={"number"} value={config.rarePrizeInitRate}
                     onChange={e => setConfig({...config, rarePrizeInitRate: e.target.value})}/>
              <FormHelperText></FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel fontSize={'xs'} fontWeight={'bold'} fontFamily={'Syncopate'}>Rare Prize Rate D</FormLabel>
              <Input placeholder={"Rare Prize Avg Rate"} type={"number"} value={config.rarePrizeRateD}
                     onChange={e => setConfig({...config, rarePrizeRateD: e.target.value})}/>
              <FormHelperText></FormHelperText>
            </FormControl>
          </HStack>
          <HStack>
            <FormControl>
              <FormLabel fontSize={'xs'} fontWeight={'bold'} fontFamily={'Syncopate'}>Rare Prize Value</FormLabel>
              <Input placeholder={"Rare Prize Value"} type={"number"} value={config.rarePrizeValue}
                     onChange={e => setConfig({...config, rarePrizeValue: e.target.value})}/>
              <FormHelperText></FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel fontSize={'xs'} fontWeight={'bold'} fontFamily={'Syncopate'}>Rare Prize Max RP</FormLabel>
              <Input placeholder={"Rare Prize Max RP"} type={"number"} value={config.rarePrizeMaxRP}
                     onChange={e => setConfig({...config, rarePrizeMaxRP: e.target.value})}/>
              <FormHelperText></FormHelperText>
            </FormControl>
          </HStack>
          <Divider/>
          <HStack>
            <FormControl>
              <FormLabel fontSize={'xs'} fontWeight={'bold'} fontFamily={'Syncopate'}>Normal Prizes Token</FormLabel>
              <Input
                placeholder={"Normal Prizes Token"}
                onChange={e => setNormalConfig({...normalConfig, normalPrizesToken: e.target.value})}
                value={normalConfig.normalPrizesToken}
              />
              <FormHelperText></FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel fontSize={'xs'} fontWeight={'bold'} fontFamily={'Syncopate'}>Normal Prizes Value</FormLabel>
              <Input
                placeholder={"Normal Prizes Value"} type={"number"}
                onChange={e => setNormalConfig({...normalConfig, normalPrizesValue: e.target.value})}
                value={normalConfig.normalPrizesValue}
              />
              <FormHelperText></FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel fontSize={'xs'} fontWeight={'bold'} fontFamily={'Syncopate'}>Normal Prizes Rate</FormLabel>
              <Input
                placeholder={"Normal Prizes Rate"} type={"number"}
                onChange={e => setNormalConfig({...normalConfig, normalPrizesRate: e.target.value})}
                value={normalConfig.normalPrizesRate}
              />
              <FormHelperText></FormHelperText>
            </FormControl>
          </HStack>
          <HStack justify={"end"}>
            <Button
              leftIcon={<AddIcon/>}
              variant={"outline"}
              isDisabled={normalConfig.normalPrizesToken === "" || normalConfig.normalPrizesValue === "" || normalConfig.normalPrizesRate === ""}
              onClick={() => {
                setConfig({
                  ...config,
                  normalPrizesToken: [...config.normalPrizesToken, normalConfig.normalPrizesToken],
                  normalPrizesValue: [...config.normalPrizesValue, normalConfig.normalPrizesValue],
                  normalPrizesRate: [...config.normalPrizesRate, normalConfig.normalPrizesRate]
                })
                setNormalConfig({
                  normalPrizesToken: '0xDfcBBb16FeEB9dD9cE3870f6049bD11d28390FbF',
                  normalPrizesValue: "0",
                  normalPrizesRate: "0",
                })
              }}
            >
              Normal Prize
            </Button>
          </HStack>
          {normalPrizeList.map((item, index) => (
            <Stack key={index} direction={"row"}>
              <Text>#{index + 1}</Text>
              <Text>{item.token}</Text>
              <Text>{item.value}</Text>
              <Text>{item.rate}</Text>
            </Stack>
          ))}
          <Divider/>
          <HStack>
            <Button
              disabled={!write}
              isLoading={isLoading}
              loadingText={"Pending..."}
              onClick={() => write?.()}
            >
              Create Pool
            </Button>
          </HStack>
        </Stack>
      </Stack>
    </Layout>
  )
}

export default Create